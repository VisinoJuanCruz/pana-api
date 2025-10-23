import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateRawMaterialDto) {
    return this.prisma.rawMaterial.create({ data: dto });
  }

  findAll() {
    return this.prisma.rawMaterial.findMany();
  }

  findOne(id: number) {
    return this.prisma.rawMaterial.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateRawMaterialDto) {
    return this.prisma.rawMaterial.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.rawMaterial.delete({ where: { id } });
  }
}
