import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

  // 1件削除処理
  const handleDelete = useCallback(
    async (id: number) => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await deleteTodoAPI({ deleteTodoAPIRequestData: { id } });
      setMessage(result.message);
      if (result.message.messageColor === 'success.light') {
        await fetchTodoList();
      }
    },
    [fetchTodoList, setMessage]
  );

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
      },
      {
        field: 'actions',
        headerName: '',
        width: 60,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id as number)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )
      }
    ],
    [handleDelete]
  );

  return (
    <>
      <Card variant="outlined" subHeader="TODO削除" attr={['margin-vertical', 'padding']}>
        <CardContent className={styles.cardContent}>
          {isLoading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : (
            <SearchResultTable
              searchResult={todoList}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};
