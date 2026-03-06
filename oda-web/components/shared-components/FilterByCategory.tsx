import { Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ICategory } from '@/types';
import { mediaMobileMax } from '@/utils/constants';

interface IProductCategoryProps {
  categories: Record<number, ICategory[]>;
  setCategories: (categories: Record<number, ICategory[]>) => void;
  filterByCategories: ICategory[];
  setFilterByCategories: (filterByCategories: ICategory[]) => void;
  refresh: () => void;
}

const FilterByCategory = (props: IProductCategoryProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    categories,
    filterByCategories,
    setCategories,
    setFilterByCategories,
    refresh,
  } = props;
  const keyCategories = Object.keys(categories ?? {});
  const LENGTH_CATEGORIES_BY_FILTER = 5;

  const handleDelete = (id: number) => {
    if (categories) {
      delete categories[id];
    }

    // list category new when delete 'id'
    const listsNewCat = filterByCategories?.filter((cat) => {
      return cat.id !== id;
    });

    setCategories?.({ ...categories });
    setFilterByCategories?.([...(listsNewCat ?? [])]);
    refresh();
  };

  return (
    <>
      {keyCategories.length > 0 && (
        <Stack
          className="filterByCategory"
          direction="row"
          alignItems="center"
          spacing={0}
          sx={{
            flexWrap: 'wrap',
            [mediaMobileMax]: {
              '& *, & .MuiChip-label': {
                fontSize: `${theme.spacing(3.5)} !important`,
              },
            },
          }}
        >
          <Typography
            sx={{
              mr: 4,
              minWidth: theme.spacing(34.5),
            }}
          >
            {t('filter_by_category')}:
          </Typography>

          <Box className="boxListChip">
            {keyCategories.map((key) => {
              const category = categories?.[Number(key)];
              let name = '';
              category?.forEach((item: ICategory, index: number) => {
                name = index === 0 ? `${item.name}` : `${name} > ${item.name}`;
              });
              if (!category?.length) return <div />;
              return (
                <Chip
                  key={key}
                  label={name}
                  variant="outlined"
                  onDelete={() => handleDelete(Number(key))}
                />
              );
            })}

            {filterByCategories &&
              filterByCategories.length >= LENGTH_CATEGORIES_BY_FILTER && (
                <Typography
                  variant="body1"
                  sx={{
                    display: 'inline-block',
                  }}
                >
                  {t('can_only_select_up_to_5_categories')}
                </Typography>
              )}
          </Box>
        </Stack>
      )}
    </>
  );
};

export default memo(FilterByCategory);
