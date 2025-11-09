import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Inventory, Unit } from '@prisma/client';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crear un registro de inventario (producto o materia prima)
   */
  async create(dto: CreateInventoryDto): Promise<Inventory> {
    // Validación básica
    if (!dto.productId && !dto.rawMaterialId) {
      throw new BadRequestException(
        'Debe indicar productId o rawMaterialId (uno solo).',
      );
    }
    if (dto.productId && dto.rawMaterialId) {
      throw new BadRequestException(
        'No puede especificar productId y rawMaterialId al mismo tiempo.',
      );
    }

    // Validar existencia de producto o materia prima
    if (dto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!product) throw new NotFoundException('Producto no encontrado');
    }
    if (dto.rawMaterialId) {
      const rawMaterial = await this.prisma.rawMaterial.findUnique({
        where: { id: dto.rawMaterialId },
      });
      if (!rawMaterial)
        throw new NotFoundException('Materia prima no encontrada');
    }

    // Preparar data para Prisma
    const data: Prisma.InventoryCreateInput = {
      itemType: dto.itemType,
      quantity: dto.quantity ?? 0,
      unit: (dto.unit ?? 'UNIT') as Unit,
      note: dto.note ?? null,
      product: dto.productId ? { connect: { id: dto.productId } } : undefined,
      rawMaterial: dto.rawMaterialId
        ? { connect: { id: dto.rawMaterialId } }
        : undefined,
    };

    return this.prisma.inventory.create({ data });
  }

  /**
   * Crear múltiples registros en bulk
   */
  async bulkCreate(dtos: CreateInventoryDto[]): Promise<Inventory[]> {
    const ops = dtos.map((dto) => {
      if (!dto.productId && !dto.rawMaterialId)
        throw new BadRequestException(
          'Cada item debe tener productId o rawMaterialId (uno solo).',
        );
      if (dto.productId && dto.rawMaterialId)
        throw new BadRequestException(
          'Cada item no puede tener productId y rawMaterialId al mismo tiempo.',
        );

      return this.prisma.inventory.create({
        data: {
          itemType: dto.itemType,
          quantity: dto.quantity ?? 0,
          unit: (dto.unit ?? 'UNIT') as Unit,
          note: dto.note ?? null,
          product: dto.productId
            ? { connect: { id: dto.productId } }
            : undefined,
          rawMaterial: dto.rawMaterialId
            ? { connect: { id: dto.rawMaterialId } }
            : undefined,
        },
      });
    });

    return this.prisma.$transaction(ops);
  }

  /**
   * Obtener todos los inventarios con paginación y filtros
   */
  async findAll(
    page = 1,
    perPage = 20,
    filters?: {
      itemType?: string;
      productId?: number;
      rawMaterialId?: number;
      unit?: Unit | string;
      from?: string;
      to?: string;
      noteContains?: string;
    },
  ): Promise<{ data: Inventory[]; meta: any }> {
    const skip = (page - 1) * perPage;

    const where: Prisma.InventoryWhereInput = {};

    if (filters?.itemType) where.itemType = filters.itemType;
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.rawMaterialId) where.rawMaterialId = filters.rawMaterialId;
    if (filters?.unit) where.unit = filters.unit as Unit;
    if (filters?.noteContains)
      where.note = { contains: filters.noteContains, mode: 'insensitive' };
    if (filters?.from || filters?.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    const [total, items] = await Promise.all([
      this.prisma.inventory.count({ where }),
      this.prisma.inventory.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { product: true, rawMaterial: true },
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

  /**
   * Obtener un inventario por id
   */
  async findOne(id: number): Promise<Inventory> {
    const item = await this.prisma.inventory.findUnique({
      where: { id },
      include: { product: true, rawMaterial: true },
    });
    if (!item) throw new NotFoundException('Inventory no encontrado');
    return item;
  }

  /**
   * Actualizar parcialmente un registro de inventario
   */
  async update(id: number, dto: UpdateInventoryDto): Promise<Inventory> {
    const existing = await this.prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Inventory no encontrado');

    const data: Prisma.InventoryUpdateInput = {};

    if (dto.itemType !== undefined) data.itemType = dto.itemType;
    if (dto.unit !== undefined) data.unit = dto.unit as Unit;
    if (dto.note !== undefined) data.note = dto.note;
    if (dto.quantity !== undefined) data.quantity = dto.quantity;

    // Manejo de relaciones producto/materia prima
    if (dto.productId !== undefined) {
      if (dto.productId === null) {
        data.product = { disconnect: true };
      } else {
        const product = await this.prisma.product.findUnique({
          where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        data.product = { connect: { id: dto.productId } };
        data.rawMaterial = { disconnect: true };
      }
    }

    if (dto.rawMaterialId !== undefined) {
      if (dto.rawMaterialId === null) {
        data.rawMaterial = { disconnect: true };
      } else {
        const rm = await this.prisma.rawMaterial.findUnique({
          where: { id: dto.rawMaterialId },
        });
        if (!rm) throw new NotFoundException('Materia prima no encontrada');
        data.rawMaterial = { connect: { id: dto.rawMaterialId } };
        data.product = { disconnect: true };
      }
    }

    return this.prisma.inventory.update({
      where: { id },
      data,
      include: { product: true, rawMaterial: true },
    });
  }

  /**
   * Ajustar cantidad (incremento o decremento)
   */
  async adjust(id: number, delta: number): Promise<Inventory> {
    if (!Number.isFinite(delta))
      throw new BadRequestException('Delta debe ser numérico');

    const existing = await this.prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Inventory no encontrado');

    const newQty = (existing.quantity ?? 0) + delta;
    if (newQty < 0)
      throw new BadRequestException(
        `Stock insuficiente. Actual: ${existing.quantity}`,
      );

    return this.prisma.inventory.update({
      where: { id },
      data: { quantity: newQty },
      include: { product: true, rawMaterial: true },
    });
  }

  /**
   * Eliminar inventario
   */
  async delete(id: number): Promise<Inventory> {
    return this.prisma.inventory.delete({ where: { id } });
  }
}
