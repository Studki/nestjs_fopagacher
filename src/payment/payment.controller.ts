import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ApiTags, ApiResponse, ApiOperation, ApiParam  } from '@nestjs/swagger';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  private stripe: Stripe;

  constructor(
    private readonly PaymentService: PaymentService,
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
    });
  }


  @Post('create-customer')
  @ApiOperation({ summary: 'Create a customer on stripe' })
  @ApiResponse({ status: 201, description: 'json of the new customer' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'email', required: true, type: 'string' })
  @ApiParam({ name: 'paymentMethodId', required: true, type: 'string' })
  async createCustomer(@Body() body: { email: string; paymentMethodId: string }) {
    try {
      const customer = await this.PaymentService.createCustomer(body.email, body.paymentMethodId);
      return customer;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create-subscription')
  @ApiOperation({ summary: 'Create a subscription on stripe' })
  @ApiResponse({ status: 201, description: 'json of the new subscription' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'customerId', required: true, type: 'string' })
  @ApiParam({ name: 'priceId', required: true, type: 'string' })
  async createSubscription(@Body() body: { customerId: string; priceId: string }) {
    try {
      const subscription = await this.PaymentService.createSubscription(body.customerId, body.priceId);
      return subscription;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle stripe webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook received' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async handleWebhook(@Headers('stripe-signature') signature: string, @Body() body: any) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    await this.PaymentService.handleWebhook(event);

    return { received: true };
  }
}
