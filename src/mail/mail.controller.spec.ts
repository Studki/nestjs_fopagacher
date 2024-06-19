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
import { allergy_entity } from 'src/allergy/entities/allergy.entity';
import { JwtService } from '@nestjs/jwt';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';


describe('MailController', () => {
    let controller: MailController;
    let service: MailService;
    let repository: Repository<user_entity>;
    let repositoryToken: Repository<token_entity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MailController],
            providers: [JwtService, MailService, MailerService, UsersService,
                {
                    provide: getRepositoryToken(token_entity),
                    useClass: Repository,
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
                    provide: getRepositoryToken(tag_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(recipe_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(allergy_entity),
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
                    provide: getRepositoryToken(calendar_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(diet_entity),
                    useClass: Repository,
                  },
                  {
                    provide: getRepositoryToken(token_entity),
                    useClass: Repository,
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
    });

    describe('sendEmail', () => {
        it('should send an email successfully', async () => {
            const sendMailDto = {
                to: 'test@patzenhoffer.eu',
                subject: 'Test Subject',
                body: 'Test Body',
                text: 'Test Text',
                html: '<p>Test HTML</p>',
            };

            const result = 'Email sent successfully';

            jest.spyOn(service, 'sendEmail').mockResolvedValue(result);

            expect(await controller.sendEmail(sendMailDto)).toEqual(result);
        });

        it('should throw BadRequestException if required parameters are missing', async () => {
            const sendMailDto = {
                body: 'Test Body',
                text: 'Test Text',
                html: '<p>Test HTML</p>',
            };
            await expect(controller.sendEmail(sendMailDto)).rejects.toThrowError(
                BadRequestException,
            );
        });
    });

    describe('verify', () => {
        it('should return Invalid token if token is not found', async () => {
              const req = "test"; // Mocked request object
              repositoryToken.findOne = jest.fn().mockResolvedValue(null);
              const result = 'Invalid token';
              await expect(controller.verifyToken(req, "verify_token")).rejects.toThrowError(
                BadRequestException,
            );
            });

        it('should throw BadRequestException if required parameters are missing', async () => {

            const result = 'Invalid token';
            await expect(controller.verifyToken("", "verify_token")).rejects.toThrowError(
              BadRequestException,
          );
        });
    });

    describe('sendResetPasswordEmail', () => {
        it('should send an email successfully', async () => {
            const mail = 'test@patzenhoffer.eu'
            const token = 'mock-token';
            const result = {
                token: token,
                token_name: 'test_name',
                mail: 'test@patzenhoffer.eu',
            }

            jest.spyOn(service, 'sendResetPasswordEmail').mockResolvedValue(result);
            expect(await controller.sendResetPasswordEmail(mail)).toEqual(result);
        });
    });

    describe('sendVerificationEmail', () => {
        it('should send an email successfully', async () => {
            const mail = 'test@patzenhoffer.eu'
            const token = 'mock-token';
            const result = {
              token: token,
              token_name: 'test_name',
              mail: 'test@patzenhoffer.eu',
          }

            jest.spyOn(service, 'sendVerifyEmail').mockResolvedValue(result);
            expect(await controller.sendVerificationMail(mail)).toEqual(result);
        });
    });
});
