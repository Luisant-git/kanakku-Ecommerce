import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiProperty } from '@nestjs/swagger';

class UploadResponse {
  @ApiProperty({ example: ['http://localhost:4010/uploads/123e4567-e89b-12d3-a456-426614174000.jpg'] })
  urls: string[];
}

class ErrorResponse {
  @ApiProperty({ example: 'File upload failed' })
  message: string;
}

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Post()
  @ApiOperation({ 
    summary: 'Upload multiple files', 
    description: 'Upload multiple image files to the server. Supports up to 10 files at once. Files are saved with unique names to prevent conflicts.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'Image files to upload (jpg, jpeg, png, gif supported)',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: UploadResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file format or upload failed',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 413,
    description: 'Payload too large - File size exceeds limit',
    type: ErrorResponse,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = files.map(file => `${process.env.ENV_UPLOAD || 'http://localhost:4010'}/uploads/${file.filename}`);
    return { urls };
  }
}
