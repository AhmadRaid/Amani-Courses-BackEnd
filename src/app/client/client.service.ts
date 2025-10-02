import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'; // لتشفير كلمة المرور
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, ClientDocument } from 'src/schemas/client.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  // 1. إنشاء عميل جديد (مع تشفير كلمة المرور)
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const saltOrRounds = 10;
    // تشفير كلمة المرور قبل حفظها
    const hashedPassword = await bcrypt.hash(
      createClientDto.password,
      saltOrRounds,
    );

    const createdClient = new this.clientModel({
      ...createClientDto,
      password: hashedPassword, // استخدام كلمة المرور المشفرة
    });
    return createdClient.save();
  }

  async findAll(
    phone?: string,
    name?: string,
    limit?: number,
    offset?: number,
    sort?: string,
  ): Promise<Client[]> {
    // بناء كائن البحث
    const filter: any = {};

    if (phone) {
      filter.phone = { $regex: phone, $options: 'i' }; // بحث جزئي غير حساس لحالة الأحرف
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // بحث جزئي غير حساس لحالة الأحرف
    }

    // بناء الاستعلام
    let query = this.clientModel.find(filter);

    // التصنيف (Sort)
    if (sort) {
      const sortObject: any = {};
      const sortFields = sort.split(',');

      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          sortObject[field.substring(1)] = -1; // تنازلي
        } else {
          sortObject[field] = 1; // تصاعدي
        }
      });

      query = query.sort(sortObject);
    }

    // التخطي (Offset)
    if (offset) {
      query = query.skip(offset);
    }

    // الحد الأقصى (Limit)
    if (limit) {
      query = query.limit(limit);
    }

    return query.exec();
  }

  // 3. الحصول على عميل حسب الـ ID
  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  // 4. تحديث عميل
  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    // إذا تم تمرير كلمة مرور جديدة، يجب تشفيرها قبل التحديث
    if (updateClientDto.password) {
      const saltOrRounds = 10;
      updateClientDto.password = await bcrypt.hash(
        updateClientDto.password,
        saltOrRounds,
      );
    }

    const existingClient = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .exec();

    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${id} not found for update`);
    }
    return existingClient;
  }

  // 5. حذف عميل
  async remove(id: string): Promise<void> {
    const deletedClient = await this.clientModel.findByIdAndDelete(id).exec();
    if (!deletedClient) {
      throw new NotFoundException(
        `Client with ID ${id} not found for deletion`,
      );
    }
  }
}
