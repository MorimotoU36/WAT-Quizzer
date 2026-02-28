import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CardContent } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { GetTodoListApiResponseDto } from 'quizzer-lib';
import { getTodoListAPI, deleteTodoAPI } from '@/utils/api-wrapper';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

interface DeleteTodoFormProps {}

export const DeleteTodoForm = ({}: DeleteTodoFormProps) => {
  const [todoList, setTodoList] = useState<GetTodoListApiResponseDto[]>([]);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setMessage = useSetRecoilState(messageState);

  // Todoリストを取得
  const fetchTodoList = useCallback(async () => {
    setIsLoading(true);
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    const result = await getTodoListAPI({ getTodoListRequestData: {} });
    setMessage(result.message);
    if (result.result && Array.isArray(result.result)) {
      setTodoList(result.result as GetTodoListApiResponseDto[]);
    }
    setIsLoading(false);
  }, [setMessage]);

  // 初回マウント時にTodoリストを取得
  useEffect(() => {
    fetchTodoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // カラム定義
  const columns: GridColDef<GridValidRowModel>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 100
      },
      {
        field: 'todo',
        headerName: 'TODO',
        flex: 1,
        minWidth: 200
      }
    ],
    []
  );

  // 選択されたTodoを取得
  const selectedTodos = useMemo(() => {
    return todoList.filter((todo) => selectedTodoIds.includes(todo.id));
  }, [todoList, selectedTodoIds]);

  // 削除処理
  const handleDelete = async () => {
    if (selectedTodos.length === 0) {
      setMessage({
        message: '削除するTODOを選択してください',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });

    // 選択されたTodoを順番に削除
    let successCount = 0;
    let errorCount = 0;

    for (const todo of selectedTodos) {
      const result = await deleteTodoAPI({
        deleteTodoAPIRequestData: { id: todo.id }
      });
      if (result.message.messageColor === 'success.light') {
        successCount++;
      } else {
        errorCount++;
      }
    }

    // 結果メッセージを表示
    if (errorCount === 0) {
      setMessage({
        message: `${successCount}件のTODOを削除しました`,
        messageColor: 'success.light',
        isDisplay: true
      });
      // リストを再取得
      await fetchTodoList();
      // 選択をクリア
      setSelectedTodoIds([]);
    } else {
      setMessage({
        message: `${successCount}件成功、${errorCount}件失敗しました`,
        messageColor: 'error',
        isDisplay: true
      });
      // リストを再取得（一部成功している可能性があるため）
      await fetchTodoList();
    }
  };

  return (
    <>
      <Card variant="outlined" subHeader="TODO削除" attr={['margin-vertical', 'padding']}>
        <CardContent className={styles.cardContent}>
          {isLoading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : (
            <>
              <SearchResultTable
                searchResult={todoList}
                columns={columns}
                hasCheck={true}
                setCheckedIdList={setSelectedTodoIds}
              />
              <div className="mt-4">
                <Button
                  label={`選択したTODOを削除 (${selectedTodos.length}件)`}
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={selectedTodos.length === 0}
                  attr={'after-inline'}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
