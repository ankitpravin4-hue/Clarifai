import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type VerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  userId?: string;
};

export async function POST(request: Request) {
  try {
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "Razorpay is not configured on the server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as VerifyBody;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error } = await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: authUserId,
        plan: "pro",
        razorpay_payment_id,
        razorpay_order_id,
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Failed to save subscription:", error);
      return NextResponse.json(
        { error: "Payment verified but subscription could not be saved." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
