import { DataGridProProps, GridRowParams } from '@mui/x-data-grid-pro';
import deepmerge from 'deepmerge';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { DataGridProStyled } from '@/components/common/DataGrid.styled';
import { ContextMenu, MenuOpenInNewTab } from '../menu/MenuOpenInNewTab';

interface IDataGridLinkedRowsProps extends DataGridProProps {
  getRowLink: (row: any) => string;
}

const ROW_PARENT_CLASS_NAME = 'MuiDataGrid-virtualScrollerRenderZone';

export const DataGridLinkedRows = (props: IDataGridLinkedRowsProps) => {
  const { getRowLink, componentsProps, rows, ...restProps } = props;
  const [contextMenu, setContextMenu] = useState<ContextMenu>(null);
  const [selectedRowId, setSelectedRowId] = useState<number>();
  const router = useRouter();

  const selectedRow = useMemo(
    () => rows.find((item) => item.id === selectedRowId),
    [selectedRowId, rows]
  );

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    if (
      !(
        event.target as unknown as {
          offsetParent: { className: string } | null;
        }
      ).offsetParent?.className?.includes(ROW_PARENT_CLASS_NAME)
    ) {
      return;
    }

    const rowId = Number(event.currentTarget.getAttribute('data-id'));
    setSelectedRowId(rowId);

    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleRowClick = (params: GridRowParams<any>) => {
    const url = getRowLink(params.row);

    if (url) {
      router.push(url);
    }
  };

  return (
    <>
      <DataGridProStyled
        rows={rows}
        onRowClick={handleRowClick}
        {...restProps}
        componentsProps={deepmerge(componentsProps ?? {}, {
          row: {
            onContextMenu: handleContextMenu,
          },
        })}
      />
      <MenuOpenInNewTab
        contextMenu={contextMenu}
        newTabLink={selectedRow ? getRowLink(selectedRow) : ''}
        onClose={handleClose}
      />
    </>
  );
};
