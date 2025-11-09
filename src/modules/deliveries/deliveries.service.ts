// src/modules/deliveries/deliveries.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryStatus, Prisma } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class DeliveriesService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
  ) {}

  // Crear delivery a partir de un order existente (copia items del order)
  async create(dto: CreateDeliveryDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    const dp = await this.prisma.deliveryPerson.findUnique({
      where: { id: dto.deliveryPersonId },
    });
    if (!dp) throw new NotFoundException('DeliveryPerson no encontrado');

    // Verificar si ya existe delivery para este order
    const existingDelivery = await this.prisma.delivery.findUnique({
      where: { orderId: dto.orderId },
    });
    if (existingDelivery) {
      throw new BadRequestException(
        'Este pedido ya tiene una delivery asignada',
      );
    }

    const delivery = await this.prisma.delivery.create({
      data: {
        orderId: order.id,
        deliveryPersonId: dto.deliveryPersonId,
        status: dto.status ?? 'PENDING',
        date: dto.date ?? new Date(),
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

  // findAll con filtros y paginación
  async findAll(
    page = 1,
    perPage = 10,
    filters?: {
      status?: DeliveryStatus;
      deliveryPersonId?: number;
      customerName?: string;
      deliveryPersonName?: string;
      productId?: number;
      from?: string;
      to?: string;
    },
  ) {
    const skip = (page - 1) * perPage;
    const take = perPage;

    // Construir where dinámico
    const where: Prisma.DeliveryWhereInput = {};

    if (filters?.status) where.status = filters.status;
    if (typeof filters?.deliveryPersonId !== 'undefined') {
      where.deliveryPersonId = filters.deliveryPersonId;
    }

    if (filters?.from || filters?.to) {
      where.date = {};
      if (filters.from) where.date.gte = new Date(filters.from);
      if (filters.to) where.date.lte = new Date(filters.to);
    }

    // Filtros por relaciones
    const relationalFilters: Prisma.DeliveryWhereInput[] = [];
    if (filters?.customerName) {
      relationalFilters.push({
        order: {
          customer: {
            name: { contains: filters.customerName, mode: 'insensitive' },
          },
        },
      });
    }
    if (filters?.deliveryPersonName) {
      relationalFilters.push({
        deliveryPerson: {
          name: { contains: filters.deliveryPersonName, mode: 'insensitive' },
        },
      });
    }
    if (filters?.productId) {
      relationalFilters.push({
        items: { some: { productId: filters.productId } },
      });
    }

    if (relationalFilters.length) {
      where.AND = relationalFilters.map((f) => ({ ...f }));
    }

    const [total, data] = await Promise.all([
      this.prisma.delivery.count({ where }),
      this.prisma.delivery.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: {
          order: {
            include: { customer: true, items: { include: { product: true } } },
          },
          deliveryPerson: true,
          items: { include: { product: true } },
          payments: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

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
    if (!delivery) throw new NotFoundException('Delivery no encontrada');
    return delivery;
  }

  async update(id: number, dto: UpdateDeliveryDto) {
    const existing = await this.prisma.delivery.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) throw new NotFoundException('Delivery no encontrada');

    if (dto.deliveryPersonId) {
      const dp = await this.prisma.deliveryPerson.findUnique({
        where: { id: dto.deliveryPersonId },
      });
      if (!dp) throw new NotFoundException('DeliveryPerson no encontrado');
    }

    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.date) data.date = dto.date;
    if (dto.deliveryPersonId) data.deliveryPersonId = dto.deliveryPersonId;

    if (dto.items && Array.isArray(dto.items)) {
      data.items = {
        deleteMany: {},
        create: dto.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
      };
    }

    return this.prisma.delivery.update({
      where: { id },
      data,
      include: {
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
        deliveryPerson: true,
        items: { include: { product: true } },
        payments: true,
      },
    });
  }

  async markAsDelivered(id: number, amountPaid?: number, method?: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
    });
    if (!delivery) throw new NotFoundException('Delivery no encontrada');

    const updated = await this.prisma.delivery.update({
      where: { id },
      data: { status: 'DELIVERED', deliveredAt: new Date() },
      include: {
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
        deliveryPerson: true,
        items: { include: { product: true } },
        payments: true,
      },
    });

    if (amountPaid && method) {
      await this.paymentsService.create({
        deliveryId: id,
        amount: amountPaid,
        method,
      });
    }

    return updated;
  }

  async getPayments(deliveryId: number) {
    return this.prisma.payment.findMany({
      where: { deliveryId },
      include: { customer: true },
      orderBy: { date: 'desc' },
    });
  }

  async delete(id: number) {
    return this.prisma.delivery.delete({ where: { id } });
  }
}
