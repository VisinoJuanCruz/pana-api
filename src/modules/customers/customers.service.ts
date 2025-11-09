import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async findAll(page = 1, perPage = 10, search?: string) {
    if (page < 1) page = 1;
    if (perPage < 1) perPage = 10;

    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: Prisma.CustomerWhereInput | undefined = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : undefined;

    const [total, items] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
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
