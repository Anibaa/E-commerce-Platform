import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const users = db.collection('users');

    try {
      // Find user
      const user = await users.findOne({ email: email.toLowerCase() });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Update last login timestamp
      await users.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      );

      // Return user data (excluding sensitive information)
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    } finally {
      // Always close the connection
      await client.close();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 