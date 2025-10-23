import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    // validate delivery exists
    const delivery = await this.prisma.delivery.findUnique({
      where: { id: dto.deliveryId },
    });
    if (!delivery) throw new NotFoundException('Delivery not found');

    const payment = await this.prisma.payment.create({
      data: {
        deliveryId: dto.deliveryId,
        amount: dto.amount,
        method: dto.method,
      },
    });

    return payment;
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        delivery: { include: { order: { include: { customer: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDelivery(deliveryId: number) {
    return this.prisma.payment.findMany({
      where: { deliveryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const p = await this.prisma.payment.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Payment not found');
    return p;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    await this.findOne(id);
    return this.prisma.payment.update({
      where: { id },
      data: {
        amount: dto.amount,
        method: dto.method,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.payment.delete({ where: { id } });
  }
}
