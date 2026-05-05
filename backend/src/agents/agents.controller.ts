import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AgentsService } from './agents.service';
import { extractPdfText } from './tools';

@Controller('ai')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(
    @UploadedFile() file: Express.Multer.File,
    @Body('message') message: string,
  ) {
    // ✅ Validate file
    if (!file) {
      throw new BadRequestException('No file uploaded. Please provide a PDF.');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are supported.');
    }

    // ✅ Validate message
    if (!message || message.trim().length < 2) {
      throw new BadRequestException('Please provide a valid instruction.');
    }

    // ✅ Extract PDF text
    const pdfText = await extractPdfText(file.buffer);

    if (!pdfText || pdfText.trim().length < 5) {
      throw new BadRequestException(
        'Could not extract readable text from PDF (might be scanned/image-based).'
      );
    }

    console.log('PDF TEXT LENGTH:', pdfText.length);
    console.log('USER MESSAGE:', message);

    // 🔥 FIX: send 2 arguments (NOT combined input)
    return await this.agentsService.processRequest(message, pdfText);
  }
}