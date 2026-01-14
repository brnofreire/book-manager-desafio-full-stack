import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  findAll(
    @Request() req: { user: { userId: number } },
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) || 1 : 1;
    const limitNum = limit ? parseInt(limit, 10) || 10 : 10;

    return this.booksService.findAll(req.user.userId, search, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Request() req: { user: { userId: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id, req.user.userId);
  }

  @Post('create')
  create(@Request() req: { user: { userId: number } }, @Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { userId: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req: { user: { userId: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id, req.user.userId);
  }
}
