import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  findAll(skip?: number, take?: number, search?: string): Promise<Customer[]> {
    const where: Prisma.CustomerWhereInput | undefined = search
      ? { name: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : undefined;

    return this.prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.CustomerUpdateInput): Promise<Customer> {
    return this.prisma.customer.update({ where: { id }, data });
  }

  remove(id: number): Promise<Customer> {
    return this.prisma.customer.delete({ where: { id } });
  }
}
