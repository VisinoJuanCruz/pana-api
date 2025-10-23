// src/modules/deliveries/deliveries.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryStatus } from '@prisma/client'; // <-- agregar esto

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  // Crear una nueva delivery
  async create(dto: CreateDeliveryDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    const delivery = await this.prisma.delivery.create({
      data: {
        orderId: order.id,
        deliveryPersonId: dto.deliveryPersonId,
        status: 'PENDING',
        date: dto.date || new Date(),
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
        deliveryPerson: true,
        items: { include: { product: true } },
        payments: true,
      },
    });

    return delivery;
  }

  async findAll(skip?: number, take?: number, status?: DeliveryStatus) {
    return this.prisma.delivery.findMany({
      where: status ? { status } : undefined,
      skip,
      take,
      include: {
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
        deliveryPerson: true,
        items: { include: { product: true } },
        payments: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // Obtener una delivery por id
  async findOne(id: number) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
        deliveryPerson: true,
        items: { include: { product: true } },
        payments: true,
      },
    });
    if (!delivery) throw new NotFoundException('Entrega no encontrada');
    return delivery;
  }

  // Marcar delivery como entregada
  async markAsDelivered(id: number, amountPaid?: number, method?: string) {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: { status: 'DELIVERED', deliveredAt: new Date() },
      include: {
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
        deliveryPerson: true,
        items: { include: { product: true } },
      },
    });

    if (amountPaid && method) {
      await this.addPayment(id, amountPaid, method);
    }

    return delivery;
  }

  // Agregar un pago a la delivery
  async addPayment(deliveryId: number, amount: number, method: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
    });
    if (!delivery) throw new NotFoundException('Entrega no encontrada');

    const payment = await this.prisma.payment.create({
      data: {
        deliveryId,
        amount,
        method,
      },
    });

    return payment;
  }

  // Obtener pagos de una delivery
  async getPayments(deliveryId: number) {
    return this.prisma.payment.findMany({
      where: { deliveryId },
    });
  }
}
