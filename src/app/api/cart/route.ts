import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { Types } from "mongoose";

// Middleware to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [, userId] = decoded.split('-');
    return userId;
  } catch (error) {
    return null;
  }
}

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product');
    
    if (!cart) {
      // Create a new cart if one doesn't exist
      const newCart = await Cart.create({
        user: userId,
        items: []
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Add/Update cart items
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    await connectDB();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item: { product: Types.ObjectId }) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product');

    return NextResponse.json(populatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item: { product: Types.ObjectId }) => item.product.toString() !== productId
    );
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product');

    return NextResponse.json(populatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 