import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CashClosure } from '@prisma/client';

@Injectable()
export class CashClosuresService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Crear un nuevo cierre de caja
  async create(data: {
    deliveryId: number;
    total: number;
  }): Promise<CashClosure> {
    return this.prisma.cashClosure.create({ data });
  }

  // ✅ Crear múltiples cierres (para testing o cierres masivos)
  async createMany(
    data: { deliveryId: number; total: number }[],
  ): Promise<CashClosure[]> {
    return this.prisma.$transaction(
      data.map((item) => this.prisma.cashClosure.create({ data: item })),
    );
  }

  // ✅ Obtener todos los cierres, con filtros opcionales
  async findAll(params?: {
    deliveryId?: number;
    from?: string;
    to?: string;
    includeDeliveries?: boolean;
  }): Promise<CashClosure[]> {
    const { deliveryId, from, to, includeDeliveries } = params || {};

    const filters: Prisma.CashClosureWhereInput = {};

    if (deliveryId) filters.deliveryId = deliveryId;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.gte = new Date(from);
      if (to) filters.createdAt.lte = new Date(to);
    }

    return this.prisma.cashClosure.findMany({
      where: filters,
      include: includeDeliveries ? { delivery: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Obtener cierre de caja por ID
  async findOne(id: number): Promise<CashClosure> {
    const closure = await this.prisma.cashClosure.findUnique({ where: { id } });
    if (!closure)
      throw new NotFoundException(`CashClosure con ID ${id} no encontrado`);
    return closure;
  }

  // ✅ Obtener cierres por rango de fecha (más específico)
  async findByDateRange(from: string, to: string): Promise<CashClosure[]> {
    return this.prisma.cashClosure.findMany({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ✅ Calcular el total de todos los cierres (opcionalmente filtrado)
  async getTotalSum(params?: {
    deliveryId?: number;
    from?: string;
    to?: string;
  }): Promise<number> {
    const { deliveryId, from, to } = params || {};

    const filters: Prisma.CashClosureWhereInput = {};

    if (deliveryId) filters.deliveryId = deliveryId;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.gte = new Date(from);
      if (to) filters.createdAt.lte = new Date(to);
    }

    const result = await this.prisma.cashClosure.aggregate({
      _sum: { total: true },
      where: filters,
    });

    return result._sum.total ?? 0;
  }

  // ✅ Actualizar cierre
  async update(id: number, data: Partial<CashClosure>): Promise<CashClosure> {
    const closure = await this.findOne(id);
    if (!closure) throw new NotFoundException('Cierre no encontrado');

    return this.prisma.cashClosure.update({
      where: { id },
      data,
    });
  }

  // ✅ Eliminar cierre
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.cashClosure.delete({ where: { id } });
    return { message: `CashClosure con ID ${id} eliminado correctamente` };
  }

  // ✅ Obtener resumen agrupado por delivery
  async getSummaryByDelivery(): Promise<
    { deliveryId: number; totalCierres: number; sumaTotal: number }[]
  > {
    const closures = await this.prisma.cashClosure.groupBy({
      by: ['deliveryId'],
      _count: { deliveryId: true },
      _sum: { total: true },
    });

    return closures.map((c) => ({
      deliveryId: c.deliveryId,
      totalCierres: c._count.deliveryId,
      sumaTotal: c._sum.total ?? 0,
    }));
  }

  // ✅ Obtener últimos N cierres
  async getLastClosures(limit = 5): Promise<CashClosure[]> {
    return this.prisma.cashClosure.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
