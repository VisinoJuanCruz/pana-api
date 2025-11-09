import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';

@Injectable()
export class DeliveryPersonsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDeliveryPersonDto) {
    return this.prisma.deliveryPerson.create({ data });
  }

  async findAll() {
    return this.prisma.deliveryPerson.findMany({
      include: {
        deliveries: {
          include: {
            order: { include: { customer: true } },
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id },
      include: {
        deliveries: {
          include: {
            order: { include: { customer: true } },
          },
        },
      },
    });
    if (!deliveryPerson)
      throw new NotFoundException('Repartidor no encontrado');
    return deliveryPerson;
  }

  async update(id: number, data: Partial<CreateDeliveryPersonDto>) {
    const existing = await this.prisma.deliveryPerson.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Repartidor no encontrado');

    return this.prisma.deliveryPerson.update({ where: { id }, data });
  }

  async delete(id: number) {
    const existing = await this.prisma.deliveryPerson.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Repartidor no encontrado');

    return this.prisma.deliveryPerson.delete({ where: { id } });
  }
}
