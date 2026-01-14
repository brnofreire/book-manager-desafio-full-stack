import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  async findAll(userId: number, search?: string, page = 1, limit = 10) {
    const where: { userId: number; title?: { contains: string } } = { userId };

    if (search) {
      where.title = { contains: search };
    }

    const take = limit;
    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.book.count({ where }),
    ]);

    return { data, total, page, limit: take };
  }

  async findOne(id: number, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    if (book.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este livro');
    }

    return book;
  }

  async create(createBookDto: CreateBookDto, userId: number) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        userId,
      },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    await this.findOne(id, userId); // Verifica se existe e se pertence ao usuário

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId); // Verifica se existe e se pertence ao usuário

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
