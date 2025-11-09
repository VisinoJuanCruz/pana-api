import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerBalanceDto } from './dto/create-customer-balance.dto';
import { UpdateCustomerBalanceDto } from './dto/update-customer-balance.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class CustomerBalancesService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyAccessToCustomer(customerId: number, user: any) {
    // ADMIN tiene acceso completo
    if (user.role === UserRole.ADMIN) return true;

    // DELIVERY: verificamos si el cliente pertenece a su ruta
    const route = await this.prisma.deliveryRoute.findFirst({
      where: {
        customerId,
        deliveryPerson: {
          // Aquí se asume que el id de usuario coincide con deliveryPerson.id
          id: user.id,
        },
      },
    });

    if (!route) {
      throw new UnauthorizedException(
        'El cliente no pertenece a la ruta de este repartidor',
      );
    }
  }

  async create(dto: CreateCustomerBalanceDto, user: any) {
    await this.verifyAccessToCustomer(dto.customerId, user);

    return this.prisma.customerBalance.create({
      data: {
        date: dto.date ? new Date(dto.date) : new Date(),
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        customer: { connect: { id: dto.customerId } },
        payment: dto.paymentId ? { connect: { id: dto.paymentId } } : undefined,
      },
    });
  }

  async findAll(filters: any, user: any) {
    const { customerId, from, to, type } = filters;

    const where: any = {};
    if (type) where.type = type;
    if (customerId) where.customerId = +customerId;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    // Si el usuario es DELIVERY, filtrar solo sus clientes
    if (user.role === UserRole.EMPLOYEE) {
      const routes = await this.prisma.deliveryRoute.findMany({
        where: { deliveryPersonId: user.id },
        select: { customerId: true },
      });
      const customerIds = routes.map((r) => r.customerId);
      where.customerId = { in: customerIds };
    }

    return this.prisma.customerBalance.findMany({
      where,
      include: { customer: true, payment: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number, user: any) {
    const balance = await this.prisma.customerBalance.findUnique({
      where: { id },
      include: { customer: true, payment: true },
    });

    if (!balance) throw new NotFoundException('Balance no encontrado');
    await this.verifyAccessToCustomer(balance.customerId, user);

    return balance;
  }

  async update(id: number, dto: UpdateCustomerBalanceDto, user: any) {
    const existing = await this.prisma.customerBalance.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!existing) throw new NotFoundException('Balance no encontrado');
    await this.verifyAccessToCustomer(existing.customerId, user);

    return this.prisma.customerBalance.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : existing.date,
        type: dto.type ?? existing.type,
        amount: dto.amount ?? existing.amount,
        description: dto.description ?? existing.description,
        paymentId: dto.paymentId ?? existing.paymentId,
      },
    });
  }

  async delete(id: number, user: any) {
    const existing = await this.prisma.customerBalance.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!existing) throw new NotFoundException('Balance no encontrado');
    await this.verifyAccessToCustomer(existing.customerId, user);

    return this.prisma.customerBalance.delete({ where: { id } });
  }
}
