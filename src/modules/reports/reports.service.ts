import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // sum of orders in range (by createdAt)
  async salesSummary(from?: string, to?: string) {
    const where: any = {};
    if (from || to) where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);

    const totalSales = await this.prisma.order.aggregate({
      _sum: { total: true },
      where,
    });

    const count = await this.prisma.order.count({ where });

    return {
      totalSales: totalSales._sum.total ?? 0,
      ordersCount: count,
    };
  }

  // payments summary (cash vs other)
  async paymentsSummary(from?: string, to?: string) {
    const where: any = {};
    if (from || to) where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);

    const payments = await this.prisma.payment.groupBy({
      by: ['method'],
      where,
      _sum: { amount: true },
    });

    return payments.map((p) => ({
      method: p.method,
      total: p._sum.amount ?? 0,
    }));
  }

  // top products sold (by quantity) in range
  async topProducts(from?: string, to?: string, limit = 10) {
    const whereOrder: any = {};
    if (from || to) whereOrder.createdAt = {};
    if (from) whereOrder.createdAt.gte = new Date(from);
    if (to) whereOrder.createdAt.lte = new Date(to);

    // join OrderItem via orders
    // Prisma doesn't support GROUP BY join easily -> use findMany and aggregate in JS for simplicity
    const orders = await this.prisma.order.findMany({
      where: whereOrder,
      include: { items: true },
    });

    const map = new Map<number, { productId: number; qty: number }>();
    for (const o of orders) {
      for (const it of o.items) {
        const existing = map.get(it.productId) ?? {
          productId: it.productId,
          qty: 0,
        };
        existing.qty += it.quantity;
        map.set(it.productId, existing);
      }
    }

    const arr = Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, limit);

    // fetch product names
    const products = await this.prisma.product.findMany({
      where: { id: { in: arr.map((r) => r.productId) } },
    });

    return arr.map((r) => ({
      productId: r.productId,
      name: products.find((p) => p.id === r.productId)?.name ?? 'Unknown',
      quantity: r.qty,
    }));
  }

  // returns summary
  async returnsSummary(from?: string, to?: string) {
    const where: any = {};
    if (from || to) where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);

    const totalLoss = await this.prisma.return.aggregate({
      _sum: { totalLoss: true },
      where,
    });

    const count = await this.prisma.return.count({ where });

    return {
      totalLoss: totalLoss._sum.totalLoss ?? 0,
      returnsCount: count,
    };
  }

  // top returning customers (by totalLoss)
  async topReturningCustomers(from?: string, to?: string, limit = 10) {
    const where: any = {};
    if (from || to) where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);

    const rows = await this.prisma.return.groupBy({
      by: ['customerId'],
      where,
      _sum: { totalLoss: true },
      orderBy: { _sum: { totalLoss: 'desc' } },
      take: limit,
    });

    const customers = await this.prisma.customer.findMany({
      where: { id: { in: rows.map((r) => r.customerId) } },
    });

    return rows.map((r) => ({
      customerId: r.customerId,
      name: customers.find((c) => c.id === r.customerId)?.name ?? 'Unknown',
      totalLoss: r._sum.totalLoss ?? 0,
    }));
  }
}
