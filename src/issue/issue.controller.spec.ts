import { Test, TestingModule } from '@nestjs/testing';
import { issueController } from './issue.controller';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

describe('issueController', () => {
    let controller: issueController;
    let issueService: IssueService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [issueController],
            providers: [IssueService],
        }).compile();

        controller = module.get<issueController>(issueController);
        issueService = module.get<IssueService>(IssueService);
    });

    describe('uploadImage', () => {
        it('should upload an image', async () => {
          const image = {
            buffer: 'buffer',
            mimetype: 'mimetype',
            originalname: 'originalname',
          };
    
          const result = 'https://gitlab.patzenhoffer.eu/api/v4/projects/20/uploads/' + image.originalname;
    
          jest.spyOn(issueService, 'uploadImage').mockResolvedValue(result);
    
          const response = await issueService.uploadImage(image);

          expect(response).toEqual(result);
        });
    });
    it('should create an issue', async () => {
      const createIssueDto: CreateIssueDto = {
          title : 'Issue Test', email : 'test@patzenhoffer.eu', description : 'Issue description'};

      const result = { message: 'Issue created' };

      jest.spyOn(issueService, 'create').mockResolvedValue(result);

      const response = await controller.create(createIssueDto);

      expect(response).toEqual(result);
  });
});
