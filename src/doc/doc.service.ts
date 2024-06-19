import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { doc_entity } from './entity/doc.entity';

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(doc_entity)
    private readonly docRepository: Repository<doc_entity>,
  ) {}

  processPDFFile(file: string): void {}

  async savePDFFile(file: string, data: Buffer): Promise<void> {
    const pdf = this.docRepository.create({ name: file, pdf: data });
    if (!pdf) {
      throw new NotFoundException('Document not created');
    }
    await this.docRepository.save(pdf);
    // this.processPDFFile(file);
    return;
  }

  deletePDFFile(file: string): void {
    this.docRepository.delete({ name: file });
  }

  async getPDFFile(file: string): Promise<Buffer> {
    const doc = await this.docRepository.findOne({ where: { name: file } });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    return doc.pdf;
  }
}
