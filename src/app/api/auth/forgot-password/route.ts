import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Generate a random 6-digit code
    const resetCode = randomBytes(3).toString('hex').toUpperCase();
    const resetCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save the reset code and expiration to the user document
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          resetCode,
          resetCodeExpires,
        },
      }
    );

    // Send the reset code via email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <h1>Password Reset</h1>
        <p>You requested to reset your password. Here is your reset code:</p>
        <h2 style="color: #4F46E5; font-size: 24px; letter-spacing: 2px;">${resetCode}</h2>
        <p>This code will expire in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json(
      { message: 'Reset code sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 