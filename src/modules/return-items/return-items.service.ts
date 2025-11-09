import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';
import { ReturnDestination } from '@prisma/client';

@Injectable()
export class ReturnItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un ReturnItem
   */
  async create(dto: CreateReturnItemDto) {
    // Validar return
    const existingReturn = await this.prisma.return.findUnique({
      where: { id: dto.returnId },
    });
    if (!existingReturn) throw new NotFoundException('Return no encontrado');

    // Validar product
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product no encontrado');

    return this.prisma.returnItem.create({
      data: {
        returnId: dto.returnId,
        productId: dto.productId, // ⚡ Usar productId directo
        quantity: dto.quantity,
        unitPrice: dto.unitPrice ?? 0,
        totalValue: dto.totalValue ?? 0,
        reason: dto.reason ?? null,
        destination: dto.destination ?? ReturnDestination.DISCARDED,
        discountApplied: dto.discountApplied ?? false,
      },
      include: { product: true, return: true },
    });
  }

  async findAll(filters?: {
    returnId?: number;
    productId?: number;
    destination?: ReturnDestination;
    reasonContains?: string;
    from?: string;
    to?: string;
  }) {
    const where: any = {};

    if (filters?.returnId) where.returnId = filters.returnId;
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.destination) where.destination = filters.destination;
    if (filters?.reasonContains)
      where.reason = { contains: filters.reasonContains };
    if (filters?.from || filters?.to) {
      where.return = {};
      where.return.date = {};
      if (filters.from) where.return.date.gte = new Date(filters.from);
      if (filters.to) where.return.date.lte = new Date(filters.to);
    }

    return this.prisma.returnItem.findMany({
      where,
      include: { product: true, return: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.returnItem.findUnique({
      where: { id },
      include: { product: true, return: true },
    });
    if (!item) throw new NotFoundException('ReturnItem no encontrado');
    return item;
  }

  async update(id: number, dto: UpdateReturnItemDto) {
    const existing = await this.prisma.returnItem.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('ReturnItem no encontrado');

    const data: any = {};

    if (dto.returnId !== undefined) {
      const existingReturn = await this.prisma.return.findUnique({
        where: { id: dto.returnId },
      });
      if (!existingReturn) throw new NotFoundException('Return no encontrado');
      data.returnId = dto.returnId;
    }

    if (dto.productId !== undefined) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!product) throw new NotFoundException('Product no encontrado');
      data.productId = dto.productId; // ⚡ productId directo
    }

    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) data.unitPrice = dto.unitPrice;
    if (dto.totalValue !== undefined) data.totalValue = dto.totalValue;
    if (dto.reason !== undefined) data.reason = dto.reason;
    if (dto.destination !== undefined)
      data.destination = dto.destination as ReturnDestination;
    if (dto.discountApplied !== undefined)
      data.discountApplied = dto.discountApplied;

    return this.prisma.returnItem.update({
      where: { id },
      data,
      include: { product: true, return: true },
    });
  }

  async delete(id: number) {
    return this.prisma.returnItem.delete({
      where: { id },
    });
  }
}
