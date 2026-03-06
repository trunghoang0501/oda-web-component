import React, { memo, useMemo } from 'react';
import { equals, isEmpty } from 'rambda';
import { Box, Chip, Popover, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/system';
import { ICategoryByInventory } from '@/types';
import { Image } from '@/components/shared-components/Image';

const ProductImageStyled = styled(Image)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.customColors.tableText,
  fontSize: theme.spacing(4),
  fontWeight: '600',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}));

const CategoryStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  boxShadow:
    '0px 2px 2px -3px rgba(58, 53, 65, 0.1),0px 2px 3px 1px rgba(58, 53, 65, 0.1),0px 3px 2px 2px rgba(58, 53, 65, 0.1)',
  borderRadius: 1,
  '&::before': {
    backgroundColor: theme.palette.background.paper,
    content: '""',
    display: 'block',
    position: 'absolute',
    width: theme.spacing(3),
    height: theme.spacing(3),
    bottom: -theme.spacing(1.5),
    transform: 'rotate(45deg)',
    left: `calc(50% - ${theme.spacing(1.5)})`,
  },
}));

interface ProductRowProps {
  /**
   * product name
   */
  name?: string;
  /**
   * product image
   */
  image?: string;
  /**
   * `defaultImage`
   */
  defaultImage?: string;
  /**
   * category include this product
   */
  category?: ICategoryByInventory[];
  /**
   * `hiddenCategory` === false => hidden Category
   */
  hiddenCategory?: boolean;
}

/**
 * process category array => Category 1 > Category 2 string
 */
const categoryToString = (category: ICategoryByInventory): string => {
  if (!category?.child) {
    return category?.name;
  }
  if (!category?.name) {
    return '';
  }
  return `${category?.name ?? ''} > ${categoryToString(category?.child)}`;
};

const ProductCellComponent = ({
  name,
  image,
  category,
  hiddenCategory,
  defaultImage,
}: ProductRowProps) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const categories = useMemo(() => {
    let res: string[] = [];
    category?.forEach((cate) => {
      res = [...res, categoryToString(cate)];
    });
    return res;
  }, [category]);

  const renderCategories = () => {
    if (hiddenCategory || isEmpty(categories)) {
      return <div />;
    }

    const [firstCate, ...restCate] = categories;

    const open = Boolean(anchorEl);

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
      >
        <TypographyStyled
          sx={{
            fontWeight: '400',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: theme.palette.text.secondary,
          }}
        >
          {firstCate}
        </TypographyStyled>
        {!isEmpty(restCate) && (
          <Chip
            label={`+${restCate?.length}`}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
              fontSize: theme.spacing(3),
              height: theme.spacing(5),
            }}
          />
        )}
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',

            '& .MuiBox-root::before': {
              display: 'none',
            },
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
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          <CategoryStyled
            sx={{
              m: 2.5,
              direction: 'row',
            }}
          >
            {categories?.map((cate, inx) => {
              return (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.common.white,
                    borderRadius: '0.3rem',
                    overflow: 'hidden',
                  }}
                  key={inx?.toString()}
                >
                  <Chip
                    label={cate}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  />
                </Box>
              );
            })}
          </CategoryStyled>
        </Popover>
      </Stack>
    );
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
      {!!image && (
        <ProductImageStyled
          src={image}
          alt={name}
          height={40}
          width={40}
          sx={{ objectFit: 'cover' }}
          defaultSrc={defaultImage}
        />
      )}
      <Box sx={{ ml: 2, flex: '1 1', minWidth: '1px' }}>
        <TypographyStyled>{name}</TypographyStyled>
        {renderCategories()}
      </Box>
    </Stack>
  );
};

export const ProductCell = memo(ProductCellComponent, equals);
