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
  ) {
    // Build aggregation pipeline
    const pipeline: any[] = [];
    const match: any = {};
    if (phone) {
      match.phone = { $regex: phone, $options: 'i' };
    }
    if (name) {
      match.name = { $regex: name, $options: 'i' };
    }
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // Sorting
    if (sort) {
      const sortObject: any = {};
      const sortFields = sort.split(',');
      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          sortObject[field.substring(1)] = -1;
        } else {
          sortObject[field] = 1;
        }
      });
      pipeline.push({ $sort: sortObject });
    }

    // Pagination
    const limitValue = limit ?? 10;
    const offsetValue = offset ?? 0;
    pipeline.push({ $skip: offsetValue });
    pipeline.push({ $limit: limitValue });

    // Get paginated clients
    const clients = await this.clientModel.aggregate(pipeline).exec();

    // Get total count (with same filter)
    const countPipeline: any[] = [];
    if (Object.keys(match).length > 0) {
      countPipeline.push({ $match: match });
    }
    countPipeline.push({ $count: 'total' });
    const countResult = await this.clientModel.aggregate(countPipeline).exec();
    const totalClients = countResult[0]?.total || 0;

    const currentPage = limitValue > 0 ? Math.floor(offsetValue / limitValue) + 1 : 0;
    const totalPages = limitValue > 0 ? Math.ceil(totalClients / limitValue) : 0;
    const nextPage = currentPage < totalPages ? currentPage + 1 : 0;

    return {
      clients,
      pagination: {
        offset: offsetValue,
        limit: limitValue,
        currentPage,
        totalPages,
        nextPage,
        totalClients,
      },
    };
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
