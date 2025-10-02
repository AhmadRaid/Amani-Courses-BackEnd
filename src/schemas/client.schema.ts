import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

// نوع TypeScript للمستند
export type ClientDocument = HydratedDocument<Client>;

@Schema({
  timestamps: true, // لإضافة createdAt و updatedAt
  collection: 'clients',
})
export class Client {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    default: [],
  })
  purchasedCourses: mongoose.Types.ObjectId[];

  @Prop({ type: Number, required: true, unique: true })
  whatsAppPhone: number;

  @Prop({ type: String, required: true, unique: true })
  telegramPhone: string;

  @Prop({ default: true })
  isActive: boolean;
}

// إنشاء المخطط بناءً على الكلاس
export const ClientSchema = SchemaFactory.createForClass(Client);
