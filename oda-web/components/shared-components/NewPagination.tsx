import { TablePagination, TablePaginationProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROW_PER_PAGE } from '@/hooks';

interface INewPaginationProps extends Omit<TablePaginationProps, 'component'> {}

const NewPagination = (props: INewPaginationProps) => {
  const { count, page, rowsPerPageOptions = ROW_PER_PAGE } = props;

  const { t } = useTranslation();

  const muiPage = page - 1;

  return (
    <TablePagination
      component="div"
      labelRowsPerPage={t('items_per_page')}
      rowsPerPageOptions={rowsPerPageOptions}
      labelDisplayedRows={({ from, to, count: total }) =>
        `${from}-${to} ${t('of')} ${total}`
      }
      {...props}
      page={muiPage}
      count={count || 0}
    />
  );
};

export default NewPagination;
