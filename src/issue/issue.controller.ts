import { 
  Controller, 
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Req
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { Public } from 'src/shared/public.decorator';

@Controller('issue')
@ApiTags('issue')
export class issueController {
  constructor(private readonly IssueService: IssueService) {}
  @Public() //a spr après
  @Post()
  @ApiOperation({ summary: 'Create a issue' })
  @ApiResponse({ status: 201, description: 'The issue has been created in Gitlab', })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseInterceptors(FilesInterceptor('image', 5))
  async create(
    @Body() createIssueDto: CreateIssueDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<{ message: string }> {
    try {
      let imageUrl = '';
      if (images) {
        for (const image of images) {
          console.log(image);
        }

        imageUrl = await this.IssueService.uploadImage(images);
      }
      this.IssueService.create(createIssueDto, imageUrl);
      return { message: 'Issue created'};
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}