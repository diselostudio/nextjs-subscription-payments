// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"I found another product\"}", -> Cancel
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"Missing features\"}", -> Cancel
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"Technical issues\",\"technical_issue\":\"Cancel subscription\"}", -> Cancel
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"Technical issues\",\"technical_issue\":\"Instant chat with support\"}", -> Void
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"Too expensive\",\"overpriced_subscription\":\"Decline Offer\"}", -> Cancel
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"Too expensive\",\"overpriced_subscription\":\"Accept Offer\"}", -> Discount 20% OFF
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"I don't need it anymore\",\"pause_subscription\":\"Cancel\"}", -> Cancel
// "message": "{\"subscription_id\":\"sub_1PEGyz062MaUli7BOJVPrQrI\",\"canceling_reason\":\"I don't need it anymore\",\"pause_subscription\":\"Pause\"}", -> Pause

import { stripe } from '@/utils/stripe/config';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const { headers, url } = req;
    const body = await req.json();
    const stripeSubscriptionId = body?.subscription_id

    if (!stripeSubscriptionId) {
        return new Response('NOOK', {
            status: 404
        })
    }

    if (body?.pause_subscription === "Pause") {
        try {
            const resumes_at = new Date();
            resumes_at.setMonth(resumes_at.getMonth() + 2);

            await stripe.subscriptions.update(stripeSubscriptionId, {
                pause_collection: {
                    behavior: 'void',
                    resumes_at: resumes_at.getTime()
                },
            });
        } catch (error) {
            // STORE ERROR IN SUPABASE ?
            return new Response(null, {
                status: (error as Stripe.Response<unknown>)?.lastResponse?.statusCode || 404
            })
        }
    }

    if (body?.overpriced_subscription === "Accept Offer") {
        try {
            await stripe.subscriptions.update(stripeSubscriptionId, {
                discounts: [{
                    coupon: "OFF20"
                }],
            });
        } catch (error) {
            // STORE ERROR IN SUPABASE ?
            return new Response(null, {
                status: (error as Stripe.Response<unknown>)?.lastResponse?.statusCode || 404
            })
        }
    }

    if (
        body?.canceling_reason === "I found another product" ||
        body?.canceling_reason === "Missing features" ||
        body?.technical_issue === "Cancel subscription" ||
        body?.overpriced_subscription === "Decline Offer" ||
        body?.pause_subscription === "Cancel"
    ) {
        try {
            await stripe.subscriptions.cancel(stripeSubscriptionId)
        } catch (error) {
            // STORE ERROR IN SUPABASE ?
            return new Response(null, {
                status: (error as Stripe.Response<unknown>)?.lastResponse?.statusCode || 404
            })
        }
    }

    return new Response(null, {
        status: 204
    })
}

