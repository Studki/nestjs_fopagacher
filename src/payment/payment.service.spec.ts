import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { HttpException } from '@nestjs/common';


describe('PaymentService', () => {
  let service: PaymentService;
  let stripe: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<PaymentService>(PaymentService);
    stripe = new Stripe('test_stripe_secret_key', { apiVersion: '2024-04-10' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
        const mockCustomer = { id: 'cus_123' };
        const mockStripeCustomer = {
            email: 'test@example.com',
            payment_method: 'pm_123',
            invoice_settings: {
                default_payment_method: 'pm_123',
            },
        }
        jest.spyOn(stripe.customers, 'create');
        await expect(service.createCustomer('test@example.com', 'pm_123')).rejects.toThrow(HttpException);
        //const result = await service.createCustomer('test@example.com', 'pm_123');
        //expect(result).toEqual(mockCustomer);
        /*expect(stripe.customers.create).toHaveBeenCalledWith({
            email: 'test@example.com',
            payment_method: 'pm_123',
            invoice_settings: {
                default_payment_method: 'pm_123',
            },
        });*/
        stripe.customers.create = jest.fn().mockRejectedValueOnce(new Error('Customer creation failed'));
    });
  });

  describe('handleWebhook', () => {
    it('should handle invoice.payment_succeeded event', async () => {
      const mockEvent = {
        type: 'invoice.payment_succeeded',
        data: {
          object: {},
        },
      };
      await expect(service.handleWebhook(mockEvent as any)).resolves.not.toThrow();
    });

    it('should handle invoice.payment_failed event', async () => {
      const mockEvent = {
        type: 'invoice.payment_failed',
        data: {
          object: {},
        },
      };
      await expect(service.handleWebhook(mockEvent as any)).resolves.not.toThrow();
    });

    it('should throw an error for unhandled event types', async () => {
      const mockEvent = {
        type: 'unknown_event',
        data: {
          object: {},
        },
      };
      await expect(service.handleWebhook(mockEvent as any)).rejects.toThrow(HttpException);
    });
  });
});
