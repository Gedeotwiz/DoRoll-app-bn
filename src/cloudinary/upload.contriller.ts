import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/uploadDto';


type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

@Controller('upload')
@ApiTags('Upload image')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'File to upload', type: UploadFileDto })
  @ApiResponse({ status: 201, description: 'The image has been uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. No file provided or file buffer is undefined.' })
  async uploadImage(@UploadedFile() file: MulterFile) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      url: result.secure_url,
    };
  }
}
