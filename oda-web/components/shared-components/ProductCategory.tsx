import {
  Chip,
  Popover,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { isEmpty } from 'rambda';
import { memo, useState } from 'react';
import { IProductCategory } from '@/types';

const CategoryStyled = styled(Stack)(() => ({
  position: 'relative',
  boxShadow:
    '0px 2px 2px -3px rgba(58, 53, 65, 0.1),0px 2px 3px 1px rgba(58, 53, 65, 0.1),0px 3px 2px 2px rgba(58, 53, 65, 0.1)',
  borderRadius: 1,
}));

const categoryToString = (category: IProductCategory): string => {
  if (!category?.child) {
    return category.name;
  }
  if (!category.name) {
    return '';
  }
  return `${category.name} > ${categoryToString(category?.child)}`;
};

interface IProductCategoryProps {
  categories: IProductCategory[];
}
const ProductCategory = (props: IProductCategoryProps) => {
  const { categories } = props;

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const mappedCategories = categories.map(categoryToString);
  const open = !!anchorEl;
  const [firstCate, ...restCate] = mappedCategories;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      spacing={4}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      width="100%"
    >
      <Typography
        noWrap
        fontWeight={600}
        color={theme.palette.customColors.tableText}
        sx={{
          textOverflow: 'unset',
          overflow: 'auto',
          whiteSpace: 'normal',
        }}
      >
        {firstCate}
      </Typography>
      {!isEmpty(restCate) && (
        <Chip
          label={`+${restCate?.length}`}
          variant="outlined"
          size="small"
          color="secondary"
          sx={{
            color: theme.palette.customColors.tableText,
            borderColor: theme.palette.customColors.tableText,
            fontSize: theme.spacing(4),
            fontweight: 600,
          }}
        />
      )}
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        PaperProps={{
          sx: { bgcolor: 'transparent', boxShadow: 'none' },
        }}
      >
        <CategoryStyled
          direction="row"
          bgcolor={theme.palette.common.white}
          p={2}
          gap={1}
        >
          {mappedCategories?.map((cate, inx) => {
            return (
              <Chip
                key={inx}
                label={cate}
                variant="outlined"
                size="small"
                color="secondary"
              />
            );
          })}
        </CategoryStyled>
      </Popover>
    </Stack>
  );
};

export default memo(ProductCategory);
