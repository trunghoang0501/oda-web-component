import { TablePagination } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface IPagination {
  rowsPerPageOptions: number[] | undefined;
  page: number;
  setRowsPerPage: (
    value:
      | ((prevState: number | undefined) => number | undefined)
      | number
      | undefined
  ) => void;
  params: any;
  count: any;
  rowsPerPage: number | undefined;
  setPage: (value: ((prevState: number) => number) | number) => void;
  setParams: (value: any) => void;
  autoChangePageWhenChangeLimit?: boolean;
}

const Pagination = ({
  rowsPerPageOptions,
  page,
  setPage,
  count,
  autoChangePageWhenChangeLimit = true,
  ...rest
}: IPagination) => {
  const { t } = useTranslation();

  const onPageChange = useCallback(
    (event: MouseEvent, _page: number) => setPage(_page + 1),
    []
  );

  const onRowsPerPageChange = useCallback((event: any) => {
    if (autoChangePageWhenChangeLimit) {
      setPage(1);
    }
    rest?.setRowsPerPage(event?.target?.value);
  }, []);

  if (!count) {
    return null;
  }
  return (
    <TablePagination
      {...(rest as any)}
      component="div"
      page={page - 1}
      count={count || 0}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage={t('items_per_page')}
      rowsPerPageOptions={rowsPerPageOptions}
      labelDisplayedRows={({ from, to, count: total }) =>
        `${from}-${to} ${t('of')} ${total}`
      }
    />
  );
};

export default Pagination;
