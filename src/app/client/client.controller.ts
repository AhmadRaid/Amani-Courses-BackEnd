import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from 'src/schemas/client.schema';

@Controller('clients') 
export class ClientController {
  
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }
@Get()
async findAll(
  @Query('phone') phone?: string,
  @Query('name') name?: string,
  @Query('limit') limit?: string,
  @Query('offset') offset?: string,
  @Query('sort') sort?: string
) {
  // Parse limit and offset to numbers with defaults
  const limitValue = limit ? parseInt(limit, 10) : 10;
  const offsetValue = offset ? parseInt(offset, 10) : 0;
  return this.clientService.findAll(phone, name, limitValue, offsetValue, sort);
}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: string): Promise<void> {
    await this.clientService.remove(id);
  }
}