import React, { memo, useMemo } from 'react';
import { equals, isEmpty } from 'rambda';
import { Box, Chip, Popover, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/system';
import { ICategoryByInventory } from 'src/types';
import { Image } from 'src/components/shared-components/Image';

const ProductImageStyled = styled(Image)(() => ({
  borderRadius: '6px',
}));

const TypographyStyled = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.customColors.tableText,
  fontSize: theme.spacing(4),
  fontWeight: '600',
  noWrap: true,
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
    width: 12,
    height: 12,
    bottom: -6,
    transform: 'rotate(45deg)',
    left: 'calc(50% - 6px)',
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

const ProductRowComponent = ({
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
    category?.forEach((cate: any) => {
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
        sx={{ width: '100%' }}
      >
        <TypographyStyled
          sx={{
            fontWeight: '400',
            display: 'block',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
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
      <Box sx={{ ml: 2, width: '100%', minWidth: 0 }}>
        <TypographyStyled noWrap className="productRow-name">
          {name}
        </TypographyStyled>
        {renderCategories()}
      </Box>
    </Stack>
  );
};

export const ProductRow = memo(ProductRowComponent, equals);
