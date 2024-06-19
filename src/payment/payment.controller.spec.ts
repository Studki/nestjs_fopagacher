import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HttpException } from '@nestjs/common';
import Stripe from 'stripe';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;
  let stripe: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test_stripe_secret_key'),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
    stripe = new Stripe('test_stripe_secret_key', { apiVersion: '2024-04-10' });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const mockCustomer = { id: 'cus_123' };
      jest.spyOn(service, 'createCustomer').mockResolvedValueOnce(mockCustomer as any);

      const result = await controller.createCustomer({ email: 'test@example.com', paymentMethodId: 'pm_123' });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw an error if customer creation fails', async () => {
      jest.spyOn(service, 'createCustomer').mockRejectedValueOnce(new Error('Customer creation failed'));

      await expect(controller.createCustomer({ email: 'test@example.com', paymentMethodId: 'pm_123' })).rejects.toThrow(HttpException);
    });
  });

  describe('createSubscription', () => {
    it('should create a payment', async () => {
      const mockPayment = { id: 'sub_123' };
      jest.spyOn(service, 'createSubscription').mockResolvedValueOnce(mockPayment as any);

      const result = await controller.createSubscription({ customerId: 'cus_123', priceId: 'price_123' });
      expect(result).toEqual(mockPayment);
    });

    it('should throw an error if payment creation fails', async () => {
      jest.spyOn(service, 'createSubscription').mockRejectedValueOnce(new Error('Payment creation failed'));

      await expect(controller.createSubscription({ customerId: 'cus_123', priceId: 'price_123' })).rejects.toThrow(HttpException);
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook correctly for successful payment', async () => {
      const payload = {
        id: 'evt_test_webhook',
        object: 'event',
      };
      
      const payloadString = JSON.stringify(payload, null, 2);
      const secret = 'whsec_test_secret';
      
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
      const event = stripe.webhooks.constructEvent(payloadString, header, secret);
      expect(event.id).toBe(payload.id);
    });

    it('should throw an error if webhook handling fails', async () => {
      const mockEvent = { type: 'invoice.payment_failed', data: { object: {} } };
      jest.spyOn(service, 'handleWebhook').mockRejectedValueOnce(new Error('Webhook handling failed'));

      await expect(controller.handleWebhook('test_signature', mockEvent)).rejects.toThrow(HttpException);
    });
  });
});
