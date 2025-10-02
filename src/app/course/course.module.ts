import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
    imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}
