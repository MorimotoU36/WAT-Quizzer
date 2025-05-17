import { IconButton } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

export const columns = [
  {
    field: 'quiz_num',
    headerName: '番号',
    sortable: true,
    type: 'number',
    width: 75
  },
  {
    field: 'edit',
    headerName: '編集',
    sortable: false,
    width: 50,
    // TODO anyではないd型
    renderCell: (params: GridRenderCellParams<any>) => {
      const router = useRouter();
      return (
        <IconButton
          aria-label={params.value}
          onClick={() => {
            router.push({
              pathname: '/quizzer/editQuiz',
              query: { file_num: params.row.file_num, quiz_num: params.row.quiz_num }
            });
          }}
        >
          <EditIcon />
        </IconButton>
      );
    }
  },
  {
    field: 'checked',
    headerName: '✅',
    sortable: false,
    width: 50,
    type: 'boolean'
  },
  {
    field: 'format_name',
    headerName: '種別',
    sortable: false,
    width: 75,
    type: 'string'
  },
  {
    field: 'quiz_sentense',
    headerName: '問題',
    sortable: false,
    type: 'string',
    width: 300
  },
  {
    field: 'answer',
    headerName: '答え',
    sortable: false,
    type: 'string',
    width: 300
  },
  {
    field: 'category',
    headerName: 'カテゴリ',
    sortable: false,
    type: 'string',
    width: 250
  }
];
