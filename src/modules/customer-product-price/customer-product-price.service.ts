import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CustomerProductPrice, UserRole, User } from '@prisma/client';
import { CreateCustomerProductPriceDto } from './dto/create-customer-product-price.dto';
import { UpdateCustomerProductPriceDto } from './dto/update-customer-product-price.dto';

@Injectable()
export class CustomerProductPriceService {
  constructor(private prisma: PrismaService) {}

  private checkPermissions(user: User) {
    if (![UserRole.ADMIN, UserRole.EMPLOYEE].includes(user.role)) {
      throw new ForbiddenException('No tienes permisos para modificar precios');
    }
  }

  async findAll(
    page = 1,
    perPage = 20,
    filters?: {
      customerId?: number;
      productId?: number;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
    },
  ) {
    const skip = (page - 1) * perPage;
    const where: Prisma.CustomerProductPriceWhereInput = {};

    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.productId) where.productId = filters.productId;
    if (
      typeof filters?.minPrice === 'number' ||
      typeof filters?.maxPrice === 'number'
    ) {
      where.customPrice = {};
      if (typeof filters.minPrice === 'number')
        where.customPrice.gte = filters.minPrice;
      if (typeof filters.maxPrice === 'number')
        where.customPrice.lte = filters.maxPrice;
    }

    if (filters?.search) {
      where.OR = [
        {
          customer: {
            is: { name: { contains: filters.search, mode: 'insensitive' } },
          },
        },
        {
          product: {
            is: { name: { contains: filters.search, mode: 'insensitive' } },
          },
        },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.customerProductPrice.count({ where }),
      this.prisma.customerProductPrice.findMany({
        where,
        include: { customer: true, product: true },
        skip,
        take: perPage,
        orderBy: { id: 'desc' },
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
    const item = await this.prisma.customerProductPrice.findUnique({
      where: { id },
      include: { customer: true, product: true },
    });
    if (!item)
      throw new NotFoundException(`CustomerProductPrice ${id} no encontrado`);
    return item;
  }

  async findByCustomer(customerId: number) {
    return this.prisma.customerProductPrice.findMany({
      where: { customerId },
      include: { product: true },
      orderBy: { customPrice: 'asc' },
    });
  }

  async findByProduct(productId: number) {
    return this.prisma.customerProductPrice.findMany({
      where: { productId },
      include: { customer: true },
      orderBy: { customPrice: 'asc' },
    });
  }

  async create(
    dto: CreateCustomerProductPriceDto,
    user: User,
  ): Promise<CustomerProductPrice> {
    this.checkPermissions(user);

    const [cust, prod] = await Promise.all([
      this.prisma.customer.findUnique({ where: { id: dto.customerId } }),
      this.prisma.product.findUnique({ where: { id: dto.productId } }),
    ]);
    if (!cust)
      throw new NotFoundException(`Customer ${dto.customerId} no encontrado`);
    if (!prod)
      throw new NotFoundException(`Product ${dto.productId} no encontrado`);

    return this.prisma.customerProductPrice.create({
      data: {
        customerId: dto.customerId,
        productId: dto.productId,
        customPrice: dto.customPrice,
      },
      include: { customer: true, product: true },
    });
  }

  async upsertSingle(dto: CreateCustomerProductPriceDto, user: User) {
    this.checkPermissions(user);

    const [cust, prod] = await Promise.all([
      this.prisma.customer.findUnique({ where: { id: dto.customerId } }),
      this.prisma.product.findUnique({ where: { id: dto.productId } }),
    ]);
    if (!cust)
      throw new NotFoundException(`Customer ${dto.customerId} no encontrado`);
    if (!prod)
      throw new NotFoundException(`Product ${dto.productId} no encontrado`);

    return this.prisma.customerProductPrice.upsert({
      where: {
        customerId_productId: {
          customerId: dto.customerId,
          productId: dto.productId,
        },
      },
      create: {
        customerId: dto.customerId,
        productId: dto.productId,
        customPrice: dto.customPrice,
      },
      update: { customPrice: dto.customPrice },
      include: { customer: true, product: true },
    });
  }

  async bulkUpsert(
    dtos: CreateCustomerProductPriceDto[],
    user: User,
  ): Promise<CustomerProductPrice[]> {
    this.checkPermissions(user);

    if (!Array.isArray(dtos) || dtos.length === 0) {
      throw new BadRequestException('Payload debe ser un array no vacío');
    }

    const customerIds = Array.from(new Set(dtos.map((d) => d.customerId)));
    const productIds = Array.from(new Set(dtos.map((d) => d.productId)));

    const [customers, products] = await Promise.all([
      this.prisma.customer.findMany({ where: { id: { in: customerIds } } }),
      this.prisma.product.findMany({ where: { id: { in: productIds } } }),
    ]);

    const missingCustomers = customerIds.filter(
      (id) => !customers.some((c) => c.id === id),
    );
    const missingProducts = productIds.filter(
      (id) => !products.some((p) => p.id === id),
    );

    if (missingCustomers.length || missingProducts.length) {
      throw new NotFoundException(
        `Faltan referencias: customers [${missingCustomers.join(', ')}], products [${missingProducts.join(', ')}]`,
      );
    }

    const ops = dtos.map((d) =>
      this.prisma.customerProductPrice.upsert({
        where: {
          customerId_productId: {
            customerId: d.customerId,
            productId: d.productId,
          },
        },
        create: {
          customerId: d.customerId,
          productId: d.productId,
          customPrice: d.customPrice,
        },
        update: { customPrice: d.customPrice },
      }),
    );

    return this.prisma.$transaction(ops);
  }

  async update(id: number, dto: UpdateCustomerProductPriceDto, user: User) {
    this.checkPermissions(user);

    const existing = await this.prisma.customerProductPrice.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`CustomerProductPrice ${id} no encontrado`);

    const data: Prisma.CustomerProductPriceUpdateInput = {};

    if (dto.customPrice !== undefined) data.customPrice = dto.customPrice;
    if (dto.customerId !== undefined) {
      const c = await this.prisma.customer.findUnique({
        where: { id: dto.customerId },
      });
      if (!c)
        throw new NotFoundException(`Customer ${dto.customerId} no encontrado`);
      data.customer = { connect: { id: dto.customerId } };
    }
    if (dto.productId !== undefined) {
      const p = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!p)
        throw new NotFoundException(`Product ${dto.productId} no encontrado`);
      data.product = { connect: { id: dto.productId } };
    }

    return this.prisma.customerProductPrice.update({
      where: { id },
      data,
      include: { customer: true, product: true },
    });
  }

  async delete(id: number, user: User) {
    this.checkPermissions(user);
    return this.prisma.customerProductPrice.delete({ where: { id } });
  }

  async deleteByPair(customerId: number, productId: number, user: User) {
    this.checkPermissions(user);

    const existing = await this.prisma.customerProductPrice.findUnique({
      where: { customerId_productId: { customerId, productId } },
    });
    if (!existing)
      throw new NotFoundException(
        'No existe customer-product-price para ese par',
      );
    return this.prisma.customerProductPrice.delete({
      where: { id: existing.id },
    });
  }

  async deleteByCustomer(customerId: number, user: User) {
    this.checkPermissions(user);
    return this.prisma.customerProductPrice.deleteMany({
      where: { customerId },
    });
  }

  async deleteByProduct(productId: number, user: User) {
    this.checkPermissions(user);
    return this.prisma.customerProductPrice.deleteMany({
      where: { productId },
    });
  }

  async resetAll(user: User) {
    this.checkPermissions(user);
    return this.prisma.customerProductPrice.deleteMany({});
  }
}
