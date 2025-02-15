import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

// MongoDB connection URL - using environment variable with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: { client: MongoClient | null; promise: Promise<MongoClient> | null } = (global as any).mongoClient;

if (!cachedClient) {
  cachedClient = (global as any).mongoClient = { client: null, promise: null };
}

export async function connectToDatabase() {
  if (cachedClient.client) {
    return { client: cachedClient.client, db: cachedClient.client.db() };
  }

  if (!cachedClient.promise) {
    cachedClient.promise = MongoClient.connect(MONGODB_URI);
  }

  try {
    cachedClient.client = await cachedClient.promise;
  } catch (e) {
    cachedClient.promise = null;
    throw e;
  }

  return { client: cachedClient.client, db: cachedClient.client.db() };
}

// Mongoose connection for models
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function ensureAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecommstore.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  
  try {
    const client = await connectDB();
    
    // Define User Schema with validation
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['admin', 'user', 'guest'],
        default: 'user',
      },
      name: {
        type: String,
        required: true,
      },
      lastLogin: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
    });

    // Add password hashing middleware
    userSchema.pre('save', async function(next) {
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
    });

    const User = client.models.User || client.model('User', userSchema);

    // Check if admin exists
    const adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      // Create admin user
      await User.create({
        email: adminEmail,
        password: adminPassword, // Will be hashed by the pre-save middleware
        role: 'admin',
        name: 'Admin',
      });
      
      console.log('Default admin account created successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error ensuring admin account:', error);
    throw error; // Propagate error for proper handling
  }
}

export default connectDB; 