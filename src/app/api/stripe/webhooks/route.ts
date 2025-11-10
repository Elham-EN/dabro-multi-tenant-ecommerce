import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { ExpandedLineItem } from "@/modules/checkout/types";

/**
 * Stripe Webhook Endpoint - Handles payment notifications from Stripe
 *
 * WHY WE NEED THIS:
 * When a customer completes a payment on Stripe, the payment happens on
 * Stripe's servers, not on our website. We need a way for Stripe to tell
 * us "Hey, this payment just succeeded!" so we can create an order record
 * in our database.
 *
 *
 * SECURITY:
 * We verify the webhook signature to ensure requests are genuinely from Stripe,
 * preventing fake payment notifications from creating fraudulent orders.
 */

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    // Constructs and verifies the signature of an Event
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown Error";
    if (error! instanceof Error) {
      console.error(error);
    }
    console.error(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      {
        message: `Webhook Error: ${errorMessage}`,
      },
      { status: 400 }
    );
  }

  console.log(`✅ Success: ${event.id}`);

  const permittedEvents: string[] = [
    // Occurs when a Checkout Session has been successfully completed.
    "checkout.session.completed",
  ];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          // A Checkout Session represents your customer's session
          // as they pay for one-time purchases through Checkout.
          data = event.data
            .object as Stripe.Checkout.Session;
          if (!data.metadata?.userId) {
            throw new Error("User ID is required");
          }
          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });
          if (!user) {
            throw new Error("User not found");
          }
          // Fetch the full checkout session details from Stripe with additional
          // product information By default, Stripe only returns basic session data.
          // The "expand" option tells Stripe to include nested details like the actual
          // product information (name, description, etc.) that was purchased, not just IDs.
          // This gives us everything we need to create an order.
          const expandedSession =
            await stripe.checkout.sessions.retrieve(
              data.id,
              {
                expand: ["line_items.data.price.product"],
              }
            );

          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const item of lineItems) {
            // Create order for each product
            await payload.create({
              collection: "orders",
              data: {
                // Check if some products were bought togather
                stripeCheckoutSessionId: data.id,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name,
              },
            });
          }
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Webhook handler failed",
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    { message: "Received" },
    { status: 200 }
  );
}
