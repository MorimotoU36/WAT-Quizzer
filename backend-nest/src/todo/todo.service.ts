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

  // Todo日記を追加（日付とcompleted=trueを登録）
  async addTodoDiaryService(date: string) {
    try {
      // 日付形式のバリデーション（YYYY-MM-DD形式）
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new HttpException(
          '日付はYYYY-MM-DD形式で入力してください',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 有効な日付かどうかを確認
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new HttpException(
          '有効な日付を入力してください',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 日付文字列が実際の日付と一致するか確認（例: 2024-13-01のような無効な日付を防ぐ）
      const [year, month, day] = date.split('-').map(Number);
      const actualDate = new Date(year, month - 1, day);
      if (
        actualDate.getFullYear() !== year ||
        actualDate.getMonth() !== month - 1 ||
        actualDate.getDate() !== day
      ) {
        throw new HttpException(
          '有効な日付を入力してください',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await prisma.todo_diary.create({
        data: {
          date,
          completed: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
