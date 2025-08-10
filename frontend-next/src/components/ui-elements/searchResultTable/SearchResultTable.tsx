import React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';

interface SearchResultTableProps {
  searchResult: GridRowsProp;
  columns: GridColDef<GridValidRowModel>[];
  hasCheck?: boolean;
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export const SearchResultTable = ({ searchResult, columns, hasCheck, setCheckedIdList }: SearchResultTableProps) => {
  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setCheckedIdList && setCheckedIdList(selectionModel as number[]);
  };

  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={searchResult}
        columns={columns}
        pageSizeOptions={[15]}
        checkboxSelection={hasCheck}
        disableRowSelectionOnClick
        onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
      />
    </div>
  );
};
