import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import { addDays, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 12 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleDailyOrderCloning() {
    this.logger.log(
      '🕛 Ejecutando tarea automática de clonación de órdenes...',
    );
    const result = await this.cloneTodayOrdersForTomorrow();

    if (result.clonedOrders && result.clonedOrders.length > 0) {
      this.logger.log(
        `✅ ${result.clonedOrders.length} órdenes clonadas automáticamente`,
      );
    } else {
      this.logger.warn('⚠️ No se clonaron órdenes hoy.');
    }
  }

  // Crear un pedido con validación de stock
  async create(dto: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    let totalOrder = 0;

    // Validar stock y calcular precios
    const itemsData = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product)
          throw new NotFoundException(
            `Producto ${item.productId} no encontrado`,
          );
        if (product.stock < item.quantity)
          throw new BadRequestException(
            `Stock insuficiente para producto ${product.name}`,
          );

        const unitPrice = product.basePrice;
        totalOrder += unitPrice * item.quantity;

        return {
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice,
          total: unitPrice * item.quantity,
        };
      }),
    );

    const orderData: Prisma.OrderCreateInput = {
      customer: { connect: { id: dto.customerId } },
      total: totalOrder,
      items: { create: itemsData },
    };

    // Si viene deliveryPersonId
    if (dto.deliveryPersonId) {
      const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
        where: { id: dto.deliveryPersonId },
      });
      if (!deliveryPerson)
        throw new NotFoundException('Repartidor no encontrado');

      orderData.delivery = {
        create: { deliveryPersonId: dto.deliveryPersonId },
      };
    }

    return this.prisma.order.create({
      data: orderData,
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
    });
  }

  // Obtener todos los pedidos con paginación, búsqueda y filtrado
  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    status?: OrderStatus,
  ) {
    const skip = (page - 1) * perPage;

    const where: Prisma.OrderWhereInput = {
      ...(search
        ? {
            customer: {
              name: { contains: search, mode: 'insensitive' },
            },
          }
        : {}),
      ...(status ? { status } : {}),
    };

    const total = await this.prisma.order.count({ where });

    const items = await this.prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    });

    return { total, page, perPage, items };
  }

  // Obtener un pedido por id
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }

  // Actualizar estado del pedido
  async updateStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: { include: { product: true } },
        delivery: { include: { deliveryPerson: true } },
      },
    });
  }

  /**
   * Clona las órdenes del día actual para el día siguiente
   */
  async cloneTodayOrdersForTomorrow() {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const tomorrowDate = addDays(todayStart, 1);

    // Buscar todas las órdenes creadas hoy
    const todayOrders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        items: true,
        delivery: true,
      },
    });

    if (todayOrders.length === 0) {
      this.logger.warn('⚠️ No se encontraron órdenes para hoy');
      return { message: 'No hay órdenes para clonar.' };
    }

    const clonedOrders: any[] = [];

    for (const order of todayOrders) {
      const newOrder = await this.prisma.order.create({
        data: {
          customerId: order.customerId,
          status: 'PENDING',
          total: order.total,
          createdAt: tomorrowDate,
          items: {
            create: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
          delivery: order.delivery
            ? {
                create: {
                  date: tomorrowDate,
                  status: 'PENDING',
                  deliveryPersonId: order.delivery.deliveryPersonId,
                },
              }
            : undefined,
        },
      });

      clonedOrders.push(newOrder);
    }

    // ✅ Solo logueamos si hay órdenes clonadas
    if (clonedOrders.length > 0) {
      this.logger.log(`✅ ${clonedOrders.length} órdenes clonadas para mañana`);
    }

    return {
      message: `✅ ${clonedOrders.length} órdenes clonadas correctamente.`,
      clonedOrders,
    };
  }

  // Eliminar un pedido
  async delete(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }

  // Asignar o cambiar repartidor
  async assignDeliveryPerson(orderId: number, deliveryPersonId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id: deliveryPersonId },
    });
    if (!deliveryPerson)
      throw new NotFoundException('Repartidor no encontrado');

    return this.prisma.delivery.upsert({
      where: { orderId },
      create: { orderId, deliveryPersonId },
      update: { deliveryPersonId },
      include: {
        deliveryPerson: true,
        order: {
          include: { customer: true, items: { include: { product: true } } },
        },
      },
    });
  }
}
