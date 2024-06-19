import { Controller, Get, Post, Put, Delete, Req, Param, Res, BadRequestException, StreamableFile, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocService } from './doc.service';
import { Public } from 'src/shared/public.decorator';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Readable } from 'stream';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('doc')
export class DocController {
    constructor(private readonly docService: DocService) {}

    @Public()
    @Get('/:name')
    @ApiOperation({ summary: 'Get a document' })
    @ApiResponse({
        status: 200,
        description: 'The document has been successfully retrieved.',
    })
    async getDoc(
        @Param('name') name: string ,
        @Res({ passthrough: true }) response: Response,
        ) {
        try {
            const pdf = await this.docService.getPDFFile(name);
            if (!pdf) {
                throw new BadRequestException('Document not found');
            }
            const stream = Readable.from(pdf);

            response.set(
                {
                    'Content-Disposition': `attachment; filename=${name}`,
                    'Content-Type': 'application/pdf',
                },
            )

            return new StreamableFile(stream);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('/')
    @ApiOperation({ summary: 'Upload a document' })
    @ApiResponse({
        status: 201,
        description: 'The document has been successfully uploaded.',
    })
    @UseInterceptors(FileInterceptor('pdf'))
    async uploadDoc(@UploadedFile() file : Express.Multer.File) {
        if (file === undefined) {
            throw new BadRequestException('No file uploaded');
        }
        try {
            let name;
            try {
                name = file.originalname;
            }  
            catch (error) {
               name = "default.pdf";
            }
            await this.docService.savePDFFile(name, file.buffer);
            return { name: file.originalname };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('/:name')
    @ApiOperation({ summary: 'Delete a document' })
    @ApiResponse({
        status: 201,
        description: 'The document has been successfully deleted.',
    })
    async deleteDoc(@Param('name') name: string ,) {
        try {
            this.docService.deletePDFFile(name);
            return { name: name };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}