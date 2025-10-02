import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from 'src/schemas/course.schema';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateUploadConfig } from 'src/config/upload.file.config';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseInterceptors(FileInterceptor('image', generateUploadConfig('courses')))
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto,    @UploadedFile() image: Express.Multer.File,
): Promise<Course> {
    return this.courseService.create(createCourseDto,image);
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get(':courseId')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('image', generateUploadConfig('courses')))
  @Put(':courseId')
  async update(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.courseService.update(courseId, updateCourseDto);
  }

  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string): Promise<void> {
    await this.courseService.remove(courseId);
  }
}
