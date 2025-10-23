import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';

@Injectable()
export class DeliveryPersonsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateDeliveryPersonDto) {
    return this.prisma.deliveryPerson.create({ data });
  }

  findAll() {
    return this.prisma.deliveryPerson.findMany();
  }
}
