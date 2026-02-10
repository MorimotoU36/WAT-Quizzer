import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { prisma } from 'quizzer-lib';

@Injectable()
export class TodoService {
  // Todoを新規追加
  async addTodoService(todo: string) {
    try {
      return await prisma.todo.create({
        data: {
          todo,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Todoを削除（deleted_atを設定）
  async deleteTodoService(id: number) {
    try {
      return await prisma.todo.update({
        data: {
          deleted_at: new Date(),
        },
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 有効なTodo全てを取得（deleted_atがnullのもの）
  async getAllTodosService() {
    try {
      return await prisma.todo.findMany({
        select: {
          id: true,
          todo: true,
        },
        where: {
          deleted_at: null,
        },
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
