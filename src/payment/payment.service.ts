import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';


@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-04-10',
        });
    }

    async createCustomer(email: string, paymentMethodId: string): Promise<Stripe.Customer> {
        try {
            const customer = await this.stripe.customers.create({
              email,
              payment_method: paymentMethodId,
              invoice_settings: {
                default_payment_method: paymentMethodId,
              },
            });
            return customer;
          } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          }
    }

    async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
        try {
          const subscription = await this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
          });
          return subscription;
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      async handleWebhook(event: Stripe.Event): Promise<void> {
        // Handle webhook events such as invoice.payment_succeeded or invoice.payment_failed
        switch (event.type) {
          case 'invoice.payment_succeeded':
            const paymentIntent = event.data.object;
            // Handle successful payment here
            break;
          case 'invoice.payment_failed':
            const invoice = event.data.object as Stripe.Invoice;
            // Handle failed payment here
            break;
          default:
            throw new HttpException('Unhandled event type', HttpStatus.BAD_REQUEST);
        }
      }

}