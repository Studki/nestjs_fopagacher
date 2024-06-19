import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

export class IssueService {
    constructor() {}
    async create(createIssueDto: any, imageUrl?: string): Promise<{ message: string }> {
        try {
            if (!createIssueDto.title) {
                throw new Error('Title is required');
            }
            if (!createIssueDto.description) {
                throw new Error('Description is required');
            }
            if (!createIssueDto.email) {
                throw new Error('Email is required');
            }
            let data = {};
            if (!imageUrl) {
                data = {
                    title: createIssueDto.title,
                    description: "email : " + createIssueDto.email + " description : " + createIssueDto.description,
                };               
            } else {
                data = {
                    title: createIssueDto.title,
                    description: "email : " + createIssueDto.email + " description : " + createIssueDto.description + " Image :" + imageUrl,
                };
            }
            await axios.post('https://gitlab.patzenhoffer.eu/api/v4/projects/20/issues/', data, {
                headers: {
                    'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
        return { message: 'The issue has been created' };
    }
    async uploadImage(images: any): Promise<any> {
        try {
            const urls = [];
            for (const image of images) {
                const formData = new FormData();
                const blob = new Blob([image.buffer], { type: image.mimetype });
                formData.append('file', blob, image.originalname);
                const response = await axios.post(
                    'https://gitlab.patzenhoffer.eu/api/v4/projects/20/uploads/', formData,
                    {
                        headers: {
                            'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
                        },
                    }
                );
                const url = " https://gitlab.patzenhoffer.eu/back/issue" + response.data.url;
                urls.push(url);
            }
            return urls;
        } catch (error) {
            throw new Error(error);
        }
    }
}