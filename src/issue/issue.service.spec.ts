import { Test, TestingModule } from '@nestjs/testing';
import { IssueService } from './issue.service';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';


describe('IssueService', () => {
  let issueService: IssueService;
  let mockAppend = jest.fn();



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueService
      ],
    }).compile();
    issueService = module.get<IssueService>(IssueService);
    mockAppend = jest.fn();
    (FormData.prototype.append as jest.Mock) = mockAppend;
  });

  describe('create', () => {
    it('should throw BadRequestException when title is empty', async () => {
        const issue = { title: '', email: 'fopagacher@patzenhoffer.eu', description: 'Issue description' };         
        await expect(issueService.create(issue)).rejects.toThrow(new BadRequestException('Error: Title is required'));
    });

    it('should throw BadRequestException if email is empty', async () => {
        const issue = { title: 'Issue Test', email: '', description: 'Issue description' };
        await expect(issueService.create(issue)).rejects.toThrow(new BadRequestException('Error: Email is required'));
    });

    it('should throw BadRequestException if description is empty', async () => {
        const createIssueDto = {
            title : 'Issue Test', email : 'fopagacher@patzenhoffer.eu', description : ''};
        await expect(issueService.create(createIssueDto)).rejects.toThrow(new BadRequestException('Error: Description is required'));
    });
    it('test to send image but error', async () => {
      const mockImage = {
        buffer: Buffer.from('mock image buffer'),
        mimetype: 'image/jpeg',
        originalname: 'mockImage.jpg',
      };
      axios.post = jest.fn().mockRejectedValue(new Error('error'));
      await expect(issueService.uploadImage(mockImage)).rejects.toThrow(new Error('TypeError: images is not iterable'));
    });
    it('should upload images and return their URLs', async () => {
      const images = [
        {
          buffer: Buffer.from('test'),
          mimetype: 'image/jpeg',
          originalname: 'test.jpg',
        },
      ];
  
      const mockResponse = { data: { url: '/uploads/test.jpg' } };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);
  
      const result = await issueService.uploadImage(images);
  
      expect(mockAppend).toHaveBeenCalledWith('file', expect.any(Blob), images[0].originalname);
      expect(axios.post).toHaveBeenCalledWith(
        'https://gitlab.patzenhoffer.eu/api/v4/projects/20/uploads/', expect.any(FormData),
        {
          headers: {
            'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
          },
        }
      );
      expect(result).toEqual([" https://gitlab.patzenhoffer.eu/back/issue" + mockResponse.data.url]);
    });
  });
});