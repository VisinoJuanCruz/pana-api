import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto, CreateReturnItemDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ReturnDestination } from '@prisma/client';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReturnDto) {
    // Validar cliente
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    // Validar deliveryPerson opcional
    if (dto.deliveryPersonId) {
      const dp = await this.prisma.deliveryPerson.findUnique({
        where: { id: dto.deliveryPersonId },
      });
      if (!dp) throw new NotFoundException('DeliveryPerson no encontrado');
    }

    const created = await this.prisma.return.create({
      data: {
        customerId: dto.customerId,
        deliveryPersonId: dto.deliveryPersonId,
        date: dto.date ?? new Date(),
        notes: dto.notes ?? null,
        totalLoss: dto.totalLoss ?? 0,
        items: dto.items
          ? {
              create: dto.items.map((item: CreateReturnItemDto) => ({
                product: { connect: { id: item.productId } },
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalValue: item.totalValue,
                reason: item.reason ?? null,
                destination: item.destination ?? ReturnDestination.DISCARDED,
                discountApplied: item.discountApplied ?? false,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        deliveryPerson: true,
        items: { include: { product: true } },
      },
    });

    return created;
  }

  async findAll(
    page = 1,
    perPage = 10,
    filters?: {
      customerId?: number;
      deliveryPersonId?: number;
      from?: string;
      to?: string;
    },
  ) {
    const skip = (page - 1) * perPage;

    const where: any = {};
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.deliveryPersonId)
      where.deliveryPersonId = filters.deliveryPersonId;
    if (filters?.from || filters?.to) {
      where.date = {};
      if (filters.from) where.date.gte = new Date(filters.from);
      if (filters.to) where.date.lte = new Date(filters.to);
    }

    const [total, items] = await Promise.all([
      this.prisma.return.count({ where }),
      this.prisma.return.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { date: 'desc' },
        include: {
          customer: true,
          deliveryPerson: true,
          items: { include: { product: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number) {
    const ret = await this.prisma.return.findUnique({
      where: { id },
      include: {
        customer: true,
        deliveryPerson: true,
        items: { include: { product: true } },
      },
    });
    if (!ret) throw new NotFoundException('Return no encontrado');
    return ret;
  }

  async update(id: number, dto: UpdateReturnDto) {
    const existing = await this.prisma.return.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) throw new NotFoundException('Return no encontrado');

    const data: any = { ...dto };

    if (dto.items && Array.isArray(dto.items)) {
      data.items = {
        deleteMany: {},
        create: dto.items.map((item) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalValue: item.totalValue,
          reason: item.reason ?? null,
          destination: item.destination ?? ReturnDestination.DISCARDED,
          discountApplied: item.discountApplied ?? false,
        })),
      };
    }

    const updated = await this.prisma.return.update({
      where: { id },
      data,
      include: {
        customer: true,
        deliveryPerson: true,
        items: { include: { product: true } },
      },
    });

    return updated;
  }

  async remove(id: number) {
    return this.prisma.return.delete({ where: { id } });
  }
}
