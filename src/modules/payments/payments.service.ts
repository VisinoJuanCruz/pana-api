import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    if (dto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: dto.customerId },
      });
      if (!customer) throw new NotFoundException('Customer no encontrado');
    }

    if (dto.deliveryId) {
      const delivery = await this.prisma.delivery.findUnique({
        where: { id: dto.deliveryId },
      });
      if (!delivery) throw new NotFoundException('Delivery no encontrado');
    }

    return this.prisma.payment.create({
      data: {
        customerId: dto.customerId,
        deliveryId: dto.deliveryId,
        amount: dto.amount,
        method: dto.method,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { customer: true, delivery: true, customerBalance: true },
    });
  }

  async findAll(filters?: {
    customerId?: number;
    deliveryId?: number;
    from?: string;
    to?: string;
  }) {
    const where: any = {};
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.deliveryId) where.deliveryId = filters.deliveryId;
    if (filters?.from || filters?.to) {
      where.date = {};
      if (filters.from) where.date.gte = new Date(filters.from);
      if (filters.to) where.date.lte = new Date(filters.to);
    }

    return this.prisma.payment.findMany({
      where,
      include: { customer: true, delivery: true, customerBalance: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { customer: true, delivery: true, customerBalance: true },
    });
    if (!payment) throw new NotFoundException('Payment no encontrado');
    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const existing = await this.prisma.payment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Payment no encontrado');

    return this.prisma.payment.update({
      where: { id },
      data: {
        amount: dto.amount ?? existing.amount,
        method: dto.method ?? existing.method,
        description: dto.description ?? existing.description,
        date: dto.date ? new Date(dto.date) : existing.date,
      },
      include: { customer: true, delivery: true, customerBalance: true },
    });
  }

  async delete(id: number) {
    return this.prisma.payment.delete({ where: { id } });
  }
}
