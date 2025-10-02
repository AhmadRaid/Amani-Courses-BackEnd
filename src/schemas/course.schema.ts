import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true, type: String, maxlength: 100, minlength: 5 })
  title: string;

  @Prop({ required: true, type: String, maxlength: 5000, minlength: 20 })
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ type: Number, min: 0 })
  specialPrice: number;

  @Prop()
  image: string;

  @Prop({ default: [] })
  topics: string[];

  @Prop({ default: [] })
  instructors: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  prerequisites: Course[];

  @Prop({
    type: [{ user: String, rating: Number, comment: String }],
    default: [],
  })
  reviews: { user: string; rating: number; comment: string }[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
