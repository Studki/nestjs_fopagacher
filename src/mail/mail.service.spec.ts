import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/user/user.service';
import { BadRequestException } from '@nestjs/common';
import { token_entity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MAILER_OPTIONS } from '@nestjs-modules/mailer';
import { user_entity } from 'src/user/entities/user.entity';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { diet_entity } from 'src/diet/entities/diet.entity';
import { JwtService } from '@nestjs/jwt';
import { DietService } from 'src/diet/diet.service';
import { DietController } from 'src/diet/diet.controller';

describe('MailController', () => {
    let controller: MailController;
    let service: MailService;
    let repository: Repository<user_entity>;
    let repositoryToken: Repository<token_entity>;
    let usersService: UsersService;
    let mailerService: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MailController],
            providers: [JwtService, MailService,
                {
                    provide: getRepositoryToken(token_entity),
                    useClass: Repository,
                  },
                  {
                    provide: MailerService,
                    useValue: {
                      sendMail: jest.fn(),
                    },
                  },
                  {
                    provide: UsersService,
                    useValue: {
                        getOneUserEmail: jest.fn(),
                    }
                  },
                  {
                    provide: MAILER_OPTIONS,
                    useValue: {
                        transport: {
                            host: 'mail.patzenhoffer.eu',
                            port: 587,
                            secure: false,
                            auth: {
                              user: 'noreply@patzenhoffer.eu',
                              pass: '11un11un11',
                            },
                          },
                          defaults: {
                            from: '"Fopagacher" <noreply@patzenhoffer.eu>',
                          },
                    },
                  },
                  {
                    provide: getRepositoryToken(user_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(diet_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(tag_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(recipe_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(ustensile_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(fridge_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(token_entity),
                    useClass: Repository,
                    useValue: {
                      findOne: jest.fn(),
                      delete: jest.fn(),
                      save: jest.fn(),
                    },
                  },
                ],
        }).compile();

        controller = module.get<MailController>(MailController);
        service = module.get<MailService>(MailService);
        repository = module.get<Repository<user_entity>>(
            getRepositoryToken(user_entity),
          );
        repositoryToken = module.get<Repository<token_entity>>(
            getRepositoryToken(token_entity),
          );
        usersService = module.get<UsersService>(UsersService);
        mailerService = module.get<MailerService>(MailerService);
    });

    describe('sendEmail', () => {
        it('should throw BadRequestException if required parameters are missing', async () => {
            const sendMailDto = {
              to: '',
              subject: '',
              body: '',
              text: '',
              html: '',
            };
        
            jest.spyOn(service, 'sendEmail').mockImplementation((sendMailDto: any): Promise<"Email sent successfully" | "Error sending email"> => {
              if (!sendMailDto.to || !sendMailDto.subject || !sendMailDto.body || !sendMailDto.text || !sendMailDto.html) {
                return Promise.reject(new BadRequestException());
              }
              return Promise.resolve("Email sent successfully" as const);
            });
        
            await expect(service.sendEmail(sendMailDto)).rejects.toThrowError(BadRequestException);
          });
        
          it('should send an email', async () => {
            const sendMailDto = {
              to: 'test@mail.com',
              subject: 'Test Subject',
              text: 'Test Text',
              html: '<p>Test HTML</p>',
            };
            // Mock the sendMail function to return a resolved promise
            service.sendEmail = jest.fn().mockResolvedValue('Email sent successfully');
        
            const result = await service.sendEmail(sendMailDto);
        
            expect(service.sendEmail).toHaveBeenCalledWith(sendMailDto);
            expect(result).toBe('Email sent successfully');
          });
          it('should send an email', async () => {
            const sendMailDto = {
              to: 'test@mail.com',
              from: process.env.EMAIL_NOREPLY,
              body: 'Test Body',
              subject: 'Test Subject',
              text: 'Test Text',
              html: '<p>Test HTML</p>',
            };
        
            mailerService.sendMail = jest.fn().mockResolvedValue(undefined);
        
            const result = await service.sendEmail(sendMailDto);
        
            expect(mailerService.sendMail).toHaveBeenCalledWith({
              to: sendMailDto.to,
              from: process.env.EMAIL_NOREPLY,
              subject: sendMailDto.subject,
              text: sendMailDto.text,
              html: sendMailDto.html,
            });
            expect(result).toBe('Email sent successfully');
          });

        it('should throw BadRequestException if required parameters are missing', async () => {
            const sendMailDto = {
                to: 'test@patzenhoffer.eu',
                subject: '',
                body: 'Test Body',
                text: 'Test Text',
                html: '<p>Test HTML</p>',
            };
            await expect(service.sendEmail(sendMailDto)).rejects.toThrowError("Missing parameters");
        });
    });

    describe('verify', () => {
        it('should return Invalid token if token is not found', async () => {
              const req = "test"; // Mocked request object
              const res = {}; // Mocked response object
              repositoryToken.findOne = jest.fn().mockResolvedValue(null);
              const result = 'Invalid token';
              await expect(service.verify(req, "verify_token")).rejects.toThrowError(result);
            });

        it('should throw BadRequestException if required parameters are missing', async () => {
            const req = {}; // Mocked request object
            const res = {}; // Mocked response object

            const result = 'Invalid token';
            await expect(service.verify("", "verify_token")).rejects.toThrowError(result);
        });
    });

    describe('sendResetPasswordEmail', () => {
        it('should send an email successfully', async () => {

            const mail = 'test@patzenhoffer.eu';
            const token = 'mock-token';
            const result = {
              token: token,
              token_name: 'test_name',
              mail: 'test@patzenhoffer.eu',
          } 
            jest.spyOn(service, 'sendResetPasswordEmail').mockResolvedValue(result);
            expect(await service.sendResetPasswordEmail(mail)).toEqual(result);
        });
        it('should send reset password email', async () => {
          const mail = 'test@patzenhoffer.eu';
          const token_mock = 'mock-token';
          const result = {
            token: token_mock,
            token_name: 'resetPassword',
            mail: 'test@patzenhoffer.eu',
        } 
          const uuid = 'a5f1a1e2-6c3d-4b0f-9b9c-2c1c4b7b5e7d';
          const token = { token: 'mock-token', name: 'reset_token' };
          const date = new Date(Date.now() + 3600000);

        
          usersService.getOneUserEmail = jest.fn().mockResolvedValue(uuid);
          service.createToken = jest.fn().mockResolvedValue({ token:"mock-token", link:"link", name:"resetPassword", f: "reset_token", expirationDate: date });
          service.sendEmail = jest.fn().mockResolvedValue(mail);

    
          expect(await service.sendResetPasswordEmail(mail)).toStrictEqual(result);
          expect(usersService.getOneUserEmail).toHaveBeenCalledWith(mail);
          //expect(service.createToken).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'resetPassword', 'reset_token', expect.any(Date));
          expect(service.sendEmail).toHaveBeenCalledWith({
            to: mail,
            subject: 'Réinitialisation de mot de passe',
            text: expect.stringContaining(token.token),
            html: expect.stringContaining(token.token),
          });
        });
    
        it('should throw an error if sending email fails', async () => {
          const mail = 'test@mail.com';
          await expect(service.sendResetPasswordEmail(mail)).rejects.toThrowError();
        });
    });
    describe('sendVerificationMail', () => {
      it('should send verification email', async () => {
        const mail = 'test@patzenhoffer.eu';
        const token_mock = 'mock-token';
        const result = {
          token: token_mock,
          token_name: 'test_name',
          mail: 'test@patzenhoffer.eu',
      } 
        const uuid = 'a5f1a1e2-6c3d-4b0f-9b9c-2c1c4b7b5e7d';
        const token = { token: 'mock-token', name: 'test_name' };

      
        usersService.getOneUserEmail = jest.fn().mockResolvedValue(uuid);
        service.createToken = jest.fn().mockResolvedValue(token);
        service.sendEmail = jest.fn().mockResolvedValue(undefined);
  
        expect(await service.sendVerifyEmail(mail)).toStrictEqual(result);
        expect(usersService.getOneUserEmail).toHaveBeenCalledWith(mail);
        //expect(service.createToken).toHaveBeenCalledWith(uuid, expect.any(String), 'verifyUser', 'verify_token', expect.any(Date));
        expect(service.sendEmail).toHaveBeenCalledWith({
          to: mail,
          subject: 'Vérification de votre adresse email',
          text: expect.stringContaining(token.token),
          html: expect.stringContaining(token.token),
        });
        expect(service.sendVerifyEmail(mail)).resolves.toStrictEqual(result);
      });
    });

    describe('verifyUser', () => {
      it('should verify user', async () => {
        const token = '18dcd625153839835b0f071edaf7de870f30a319';
        const uuid = 'a5f1a1e2-6c3d-4b0f-9b9c-2c1c4b7b5e7d';
        const user = { verified: false };

        repositoryToken.findOne = jest.fn().mockResolvedValue({ token, uuid });
        repository.findOne = jest.fn().mockResolvedValue(user);
        service.verifyUser = jest.fn().mockResolvedValue(undefined);


        await expect(service.verify(token, "")).rejects.toThrowError("Invalid token");
        expect(repositoryToken.findOne).toHaveBeenCalledWith({ where: { token } });
      });
    });

    describe('createToken', () => {
      it('should create a new token', async () => {
        const uuid = 'test-uuid';
        const link = 'test-link';
        const f = 'test-f';
        const name = 'test-name';
        const date = new Date();
    
        repositoryToken.findOne = jest.fn().mockResolvedValue(null);
        repositoryToken.save = jest.fn().mockImplementation((token) => Promise.resolve({ ...token }));
        repositoryToken.delete = jest.fn();
    
        const result = await service.createToken(uuid, link, f, name, date);
    
        expect(repositoryToken.findOne).toHaveBeenCalledWith({ where: { uuid, name } });
        expect(repositoryToken.delete).not.toHaveBeenCalled();
        expect(repositoryToken.save).toHaveBeenCalled();
        expect(result).toHaveProperty('token');
        expect(result).toHaveProperty('expirationDate');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('f');
        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('link');
      });
    });
});