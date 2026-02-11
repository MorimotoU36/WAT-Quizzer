import React, { useState, useEffect, useCallback } from 'react';
import { CardContent, Typography, Box } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { getTodayKey, getTodoListAPI, GetTodoListApiResponseDto } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos?: Todo[];
}

// localStorageから今日のチェック状態を読み込む
const loadTodayTodos = (baseTodos: Todo[]): Todo[] => {
  if (typeof window === 'undefined') return baseTodos;

  const todayKey = getTodayKey();
  const storageKey = `todos-${todayKey}`;
  const saved = localStorage.getItem(storageKey);

  if (saved) {
    try {
      const savedCompletedIds = JSON.parse(saved) as number[];
      return baseTodos.map((todo) => ({
        ...todo,
        completed: savedCompletedIds.includes(todo.id)
      }));
    } catch (e) {
      console.error('Failed to parse saved todos:', e);
      return baseTodos;
    }
  }

  return baseTodos;
};

// localStorageに今日のチェック状態を保存
const saveTodayTodos = (todos: Todo[]) => {
  if (typeof window === 'undefined') return;

  const todayKey = getTodayKey();
  const storageKey = `todos-${todayKey}`;
  const completedIds = todos.filter((todo) => todo.completed).map((todo) => todo.id);
  localStorage.setItem(storageKey, JSON.stringify(completedIds));
};

// APIから取得したTODOをTodo形式に変換
const convertApiTodosToTodos = (apiTodos: GetTodoListApiResponseDto[]): Todo[] => {
  return apiTodos.map((apiTodo) => ({
    id: apiTodo.id,
    title: apiTodo.todo,
    completed: false
  }));
};

// 前日以前のlocalStorageデータを削除
const cleanupOldTodos = () => {
  if (typeof window === 'undefined') return;

  const todayKey = getTodayKey();
  const keysToRemove: string[] = [];

  // localStorage内の全てのキーをチェック
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('todos-')) {
      const dateKey = key.replace('todos-', '');
      // 今日の日付より前のデータを削除対象にする
      if (dateKey < todayKey) {
        keysToRemove.push(key);
      }
    }
  }

  // 古いデータを削除
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

export const TodoList = ({ todos: initialTodosProp }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(getTodayKey());
  const [isLoading, setIsLoading] = useState(false);
  const setMessage = useSetRecoilState(messageState);

  // APIからTodoリストを取得
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    const result = await getTodoListAPI({ getTodoListRequestData: {} });
    if (result.result && Array.isArray(result.result)) {
      const apiTodos = result.result as GetTodoListApiResponseDto[];
      const convertedTodos = convertApiTodosToTodos(apiTodos);
      // localStorageから今日のチェック状態を読み込んで適用
      const todosWithCompleted = loadTodayTodos(convertedTodos);
      setTodos(todosWithCompleted);
    }
    setIsLoading(false);
  }, []);

  // 初回マウント時にTodoリストを取得
  useEffect(() => {
    cleanupOldTodos();
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 日付が変わったらリセット
  useEffect(() => {
    const checkDateChange = () => {
      const todayKey = getTodayKey();
      if (todayKey !== currentDate) {
        // 日付が変わった時に古いデータをクリーンアップ
        cleanupOldTodos();
        setCurrentDate(todayKey);
        // APIから再取得して、チェック状態をリセット
        fetchTodos();
      }
    };

    // 初回マウント時と日付変更時のチェック
    checkDateChange();

    // 1分ごとに日付の変更をチェック（0:00を検知するため）
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, [currentDate, fetchTodos]);

  // チェック状態が変わったらlocalStorageに保存
  useEffect(() => {
    saveTodayTodos(todos);
  }, [todos]);

  const handleToggle = (id: number) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const allCompleted = todos.length > 0 && todos.every((todo) => todo.completed);

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <Box
        sx={{
          backgroundColor: allCompleted ? '#c8e6c9' : 'transparent',
          transition: 'background-color 0.3s ease',
          borderRadius: '4px',
          minHeight: '100%'
        }}
      >
        <CardContent>
          <Typography variant="h6" component="h6" color="grey.700" sx={{ mb: 2 }}>
            今日のTodo
          </Typography>
          {allCompleted && (
            <Box
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              今日のTodoを全て完了しました！
            </Box>
          )}
          {isLoading ? (
            <Typography variant="body2" color="grey.500" sx={{ fontStyle: 'italic' }}>
              読み込み中...
            </Typography>
          ) : todos.length === 0 ? (
            <Typography variant="body2" color="grey.500" sx={{ fontStyle: 'italic' }}>
              Todoがありません
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {todos.map((todo) => (
                <Box
                  key={todo.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: todo.completed ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Checkbox
                    value={String(todo.id)}
                    label={todo.title}
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};
