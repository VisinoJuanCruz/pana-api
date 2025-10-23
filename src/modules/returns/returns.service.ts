import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReturnDto) {
    const { items, ...returnData } = data;

    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    const createdReturn = await this.prisma.return.create({
      data: {
        ...returnData,
        totalLoss: items.reduce((acc, item) => acc + item.totalValue, 0),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalValue: item.totalValue,
            reason: item.reason,
            destination: item.destination,
          })),
        },
      },
      include: { items: true, customer: true, deliveryPerson: true },
    });

    return createdReturn;
  }

  async findAll() {
    return this.prisma.return.findMany({
      include: { customer: true, deliveryPerson: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCustomer(customerId: number) {
    return this.prisma.return.findMany({
      where: { customerId },
      include: { items: true, deliveryPerson: true },
    });
  }

  async findOne(id: number) {
    const ret = await this.prisma.return.findUnique({
      where: { id },
      include: { items: true, customer: true, deliveryPerson: true },
    });

    if (!ret) throw new NotFoundException(`Devolución #${id} no encontrada`);
    return ret;
  }

  async update(id: number, data: UpdateReturnDto) {
    await this.findOne(id);

    return this.prisma.return.update({
      where: { id },
      data: {
        notes: data.notes,
        deliveryPersonId: data.deliveryPersonId,
      },
      include: { items: true },
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return this.prisma.return.delete({
      where: { id },
    });
  }

  async assignDeliveryPerson(returnId: number, deliveryPersonId: number) {
    await this.findOne(returnId);

    return this.prisma.return.update({
      where: { id: returnId },
      data: { deliveryPersonId },
      include: { customer: true, deliveryPerson: true },
    });
  }
}
