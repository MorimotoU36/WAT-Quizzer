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
    <div className="w-full border border-gray-200 rounded-lg overflow-x-auto">
      <DataGrid
        rows={searchResult}
        columns={columns}
        pageSizeOptions={[15]}
        checkboxSelection={hasCheck}
        disableRowSelectionOnClick
        onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
        className="border-0 min-w-[640px]"
        autoHeight
        density="compact"
      />
    </div>
  );
};
