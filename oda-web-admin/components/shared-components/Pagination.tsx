import { useCallback } from 'react';
import { TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface IPagination {
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
}

const Pagination = ({
  rowsPerPageOptions,
  page,
  setPage,
  count,
  ...rest
}: IPagination) => {
  const [t] = useTranslation();

  const onPageChange = useCallback(
    (event: MouseEvent, _page: number) => setPage(_page + 1),
    []
  );

  const onRowsPerPageChange = useCallback((event: any) => {
    setPage(1);
    rest?.setRowsPerPage(event?.target?.value);
  }, []);

  // Always show pagination even if count is 0
  const totalCount = count || 0;
  return (
    <TablePagination
      {...(rest as any)}
      component="div"
      page={page - 1}
      count={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage={`${t('items_per_page')}:`}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
};

export default Pagination;
