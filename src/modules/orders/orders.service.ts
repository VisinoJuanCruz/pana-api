// src/modules/orders/orders.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Crear un pedido
  async create(dto: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    let totalOrder = 0;
    const itemsData = dto.items.map((item) => {
      const unitPrice = 0; // reemplazar por cálculo de precio real si quieres
      totalOrder += unitPrice * item.quantity;
      return {
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
      };
    });

    const orderData: any = {
      customer: { connect: { id: dto.customerId } },
      total: totalOrder,
      items: { create: itemsData },
    };

    const order = await this.prisma.order.create({
      data: orderData,
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
    });

    return order;
  }

  // Obtener todos los pedidos
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtener un pedido por id
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }

  // Actualizar estado del pedido
  async updateStatus(
    id: number,
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED',
  ) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
    });
  }

  // Asignar repartidor a un pedido (crea o actualiza Delivery)
  async assignDeliveryPerson(orderId: number, deliveryPersonId: number) {
    // verificar que el pedido exista
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    // verificar que el repartidor exista
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id: deliveryPersonId },
    });
    if (!deliveryPerson)
      throw new NotFoundException('Repartidor no encontrado');

    // crear o actualizar la delivery asociada
    const delivery = await this.prisma.delivery.upsert({
      where: { orderId },
      create: {
        orderId,
        deliveryPersonId,
      },
      update: {
        deliveryPersonId,
      },
      include: {
        deliveryPerson: true,
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
      },
    });

    return delivery;
  }
}
