import { TodoService } from './todo.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    todo: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe('TodoService', () => {
  let todoService: TodoService;

  beforeEach(() => {
    todoService = new TodoService();
  });

  // Todoを新規追加 正常系
  it('addTodoService - OK', async () => {
    // テストデータ
    const todo = '朝の運動をする';
    // テストデータ 正常時の返り値
    const testResult = {
      id: 1,
      todo: '朝の運動をする',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    (prisma.todo.create as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await todoService.addTodoService(todo)).toEqual(testResult);
  });

  // Todoを新規追加 異常系
  it('addTodoService - NG', async () => {
    // テストデータ
    const todo = '朝の運動をする';
    (prisma.todo.create as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(todoService.addTodoService(todo)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // Todoを削除 正常系
  it('deleteTodoService - OK', async () => {
    // テストデータ
    const id = 1;
    // テストデータ 正常時の返り値
    const testResult = {
      id: 1,
      todo: '朝の運動をする',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
    };
    (prisma.todo.update as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await todoService.deleteTodoService(id)).toEqual(testResult);
  });

  // Todoを削除 異常系
  it('deleteTodoService - NG', async () => {
    // テストデータ
    const id = 1;
    (prisma.todo.update as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(todoService.deleteTodoService(id)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 有効なTodo全てを取得 正常系
  it('getAllTodosService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 1,
        todo: '朝の運動をする',
      },
      {
        id: 2,
        todo: 'プロジェクトの進捗を確認する',
      },
    ];
    (prisma.todo.findMany as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await todoService.getAllTodosService()).toEqual(testResult);
  });

  // 有効なTodo全てを取得 異常系
  it('getAllTodosService - NG', async () => {
    (prisma.todo.findMany as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(todoService.getAllTodosService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
