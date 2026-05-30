import React from 'react';
import { DataGrid, GridColDef, GridRowClassNameParams, GridRowSelectionModel, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';

interface SearchResultTableProps {
  searchResult: GridRowsProp;
  columns: GridColDef<GridValidRowModel>[];
  hasCheck?: boolean;
  checkedIdList?: number[];
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
  getRowClassName?: (params: GridRowClassNameParams) => string;
}

export const SearchResultTable = ({
  searchResult,
  columns,
  hasCheck,
  checkedIdList,
  setCheckedIdList,
  getRowClassName
}: SearchResultTableProps) => {
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
        rowSelectionModel={checkedIdList ?? []}
        onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
        className="border-0 min-w-[640px]"
        autoHeight
        density="compact"
        getRowClassName={getRowClassName}
      />
    </div>
  );
};
