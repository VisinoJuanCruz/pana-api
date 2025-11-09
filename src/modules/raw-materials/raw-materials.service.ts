import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RawMaterial } from '@prisma/client';

@Injectable()
export class RawMaterialsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.RawMaterialCreateInput): Promise<RawMaterial> {
    return this.prisma.rawMaterial.create({ data });
  }
  async findAll(page = 1, perPage = 10, search?: string) {
    if (page < 1) page = 1;
    if (perPage < 1) perPage = 10;

    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: Prisma.RawMaterialWhereInput | undefined = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : undefined;

    const [total, items] = await Promise.all([
      this.prisma.rawMaterial.count({ where }),
      this.prisma.rawMaterial.findMany({
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

  async findOne(id: number): Promise<RawMaterial> {
    const material = await this.prisma.rawMaterial.findUnique({
      where: { id },
    });
    if (!material)
      throw new NotFoundException(`Materia prima con id ${id} no encontrada`);
    return material;
  }

  async update(
    id: number,
    data: Prisma.RawMaterialUpdateInput,
  ): Promise<RawMaterial> {
    try {
      return await this.prisma.rawMaterial.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Materia prima con id ${id} no encontrada`);
      }
      throw error;
    }
  }

  async updateStock(id: number, delta: number): Promise<RawMaterial> {
    const material = await this.findOne(id);
    const newStock = (material.stock ?? 0) + delta;
    if (newStock < 0)
      throw new Error(`Stock insuficiente. Actual: ${material.stock}`);
    return this.prisma.rawMaterial.update({
      where: { id },
      data: { stock: newStock },
    });
  }

  remove(id: number): Promise<RawMaterial> {
    return this.prisma.rawMaterial.delete({ where: { id } });
  }
}
