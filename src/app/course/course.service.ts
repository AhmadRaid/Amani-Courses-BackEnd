import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from 'src/schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  // Creates a new course
  async create(
    createCourseDto: CreateCourseDto,
    image: Express.Multer.File,
  ): Promise<Course> {
    const courseData = {
      ...createCourseDto,
      image: image ? image.path : null,
    };

    const createdCourse = new this.courseModel(courseData);

    return createdCourse.save();
  }

  // Finds all courses
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Finds a single course by its ID, with error handling
  async findOne(courseId: string): Promise<Course> {
    // Validate the ID format to avoid Mongoose casting errors
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException(`Invalid ID format: ${courseId}`);
    }

    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
    return course;
  }

  // Updates a course by its courseId
  async update(
    courseId: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException(`Invalid ID format: ${courseId}`);
    }

    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(courseId, updateCourseDto, { new: true }) // `new: true` returns the updated document
      .exec();
    if (!updatedCourse) {
      throw new NotFoundException(
        `Course with courseId ${courseId} not found.`,
      );
    }
    return updatedCourse;
  }

  // Removes a course by its courseId
  async remove(courseId: string): Promise<void> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException(`Invalid ID format: ${courseId}`);
    }

    const result = await this.courseModel
      .findByIdAndUpdate(
        courseId,
        {
          isDeleted: true,
        },
        { new: true },
      ) // `new: true` returns the updated document
      .exec();
    if (!result) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  }
}
