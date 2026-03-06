import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { isEmpty } from 'rambda';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetProductCategoryListQuery } from '@/apis';
import { ICategory } from '@/types';
import { mediaMobileMax } from '@/utils/constants';
import Loading from '../loading';

interface IFormSelectCategory {
  onCloseModalAddCategory: () => void;
  onOkModalAddCategory: (itemCategory: ICategory[]) => void;
  selectedCategories: ICategory[];
  isMaxLevel: boolean;
  isAllDefaultInLevel3?: boolean;
}

enum SelectLevelEnum {
  level = 1,
  level_2 = 2,
  level_3 = 3,
}

const ListCategoryStyled = styled(Grid)<GridProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.text.secondary}`,
  borderRadius: theme.spacing(1.5),
  marginTop: 0,
  '& .MuiGrid-root.MuiGrid-item': {
    position: 'relative',
    '& >.MuiTypography-root': {
      position: 'absolute',
      content: '""',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      textAlign: 'center',
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
    },
    '&:last-child': {
      borderRight: `0 !important`,
    },
  },
  '& .MuiList-root': {
    '& .MuiListItem-root': {
      '&.active': {
        background: 'rgba(243, 242, 247, 0.8)',
        '& .MuiTypography-root': {
          fontWeight: '500',
          color: '#10C237',
        },
      },
    },
  },
}));

const FormSelectCategory = (props: IFormSelectCategory) => {
  const {
    onCloseModalAddCategory,
    onOkModalAddCategory,
    selectedCategories,
    isMaxLevel = false,
    isAllDefaultInLevel3 = true,
  } = props;
  const prevSelect = useRef<SelectLevelEnum>(SelectLevelEnum.level);
  const { t } = useTranslation();
  const theme = useTheme();
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [maxLevel, setMaxLevel] = useState<boolean>(false);
  const [selectCategoryLevel, setSelectCategoryLevel] = useState<ICategory>({
    id: 0,
    level: 0,
  });
  const [selectCategoryLevel2, setSelectCategoryLevel2] = useState<ICategory>({
    id: 0,
    level: 0,
  });
  const [selectCategoryLevel3, setSelectCategoryLevel3] = useState<ICategory>({
    id: 0,
    level: 0,
  });

  const [isClearCategoryLevel3, setIsClearCategoryLevel3] =
    useState<boolean>(false);

  const { data: categoryLevel1, isLoading: isLoadingCategoryLevel1 } =
    useGetProductCategoryListQuery(0);
  const { data: categoryLevel2, isLoading: isLoadingCategoryLevel2 } =
    useGetProductCategoryListQuery(selectCategoryLevel.id ?? 0, {
      skip: selectCategoryLevel.id === 0,
    });
  const { data: categoryLevel3, isLoading: isLoadingCategoryLevel3 } =
    useGetProductCategoryListQuery(selectCategoryLevel2.id ?? 0, {
      skip: selectCategoryLevel2.id === 0,
    });

  const handleSelectCategory = (item: ICategory) => {
    prevSelect.current = SelectLevelEnum.level;
    setIsMessageError(false);
    setSelectCategoryLevel(item);
    setIsClearCategoryLevel3(true);
    setSelectCategoryLevel2({ id: 0, level: 0 });
    setSelectCategoryLevel3({ id: 0, level: 0 });

    if (item?.children_count === 0) {
      setMaxLevel(true);
    } else {
      setMaxLevel(false);
    }
  };

  const handleSelectCategory2 = (item: ICategory) => {
    prevSelect.current = SelectLevelEnum.level_2;
    setIsMessageError(false);
    setSelectCategoryLevel2(item);
    setIsClearCategoryLevel3(false);
    setSelectCategoryLevel3({ id: 0, level: 0 });

    setMaxLevel(item?.children_count === 0);
  };

  const handleSelectCategory3 = (item: ICategory) => {
    prevSelect.current = SelectLevelEnum.level_2;
    setIsMessageError(false);
    setSelectCategoryLevel3(item);

    if (item?.children_count === 0) {
      setMaxLevel(true);
    } else {
      setMaxLevel(false);
    }
  };

  const listCategoriesLevel1 = useMemo(() => {
    if (categoryLevel1?.success) {
      const categoriesProcess: ICategory[] = categoryLevel1?.data;
      if (!isEmpty(categoriesProcess)) {
        return categoriesProcess;
      }
      return [];
    }
  }, [categoryLevel1]);

  const listCategoriesLevel2 = useMemo(() => {
    if (categoryLevel2?.success) {
      const categoriesProcess: ICategory[] = categoryLevel2?.data;
      if (!isEmpty(categoriesProcess)) {
        return categoriesProcess;
      }
      return [];
    }
  }, [categoryLevel2]);

  const listCategoriesLevel3 = useMemo(() => {
    if (isClearCategoryLevel3) return [];
    if (categoryLevel3?.success) {
      const categoriesProcess: ICategory[] = categoryLevel3?.data;
      if (!isEmpty(categoriesProcess)) {
        if (isAllDefaultInLevel3) {
          setSelectCategoryLevel3(categoriesProcess[0]);
        }
        setMaxLevel(true);

        return categoriesProcess;
      }
      setSelectCategoryLevel3({ id: 0, level: 0 });
      return [];
    }
  }, [categoryLevel3, isClearCategoryLevel3]);

  const renderContentCategory = (
    selectCategoryId: ICategory,
    listCategory: ICategory[],
    onSelectCategory: (item: ICategory) => void,
    isLoading: boolean,
    hasChild: boolean,
    selectLevel: SelectLevelEnum
  ) => {
    if (listCategory?.length) {
      return (
        <List
          sx={{
            width: '100%',
            maxWidth: theme.spacing(90),
            bgcolor: 'background.paper',
            position: 'relative',
            padding: 0,
            '& ul': { padding: 0 },
          }}
          component="nav"
        >
          {listCategory.map((item) => {
            return (
              <ListItem
                key={item?.id}
                className={selectCategoryId?.id === item?.id ? 'active' : ''}
                secondaryAction={
                  item?.children_count !== 0 && (
                    <IconButton edge="end" aria-label="delete">
                      <KeyboardArrowRightIcon color="secondary" />
                    </IconButton>
                  )
                }
                button
                onClick={() => onSelectCategory(item)}
              >
                <ListItemText primary={item?.name} />
              </ListItem>
            );
          })}
        </List>
      );
    }

    if (isLoading) {
      return <Loading />;
    }
    if (
      (hasChild &&
        prevSelect.current === SelectLevelEnum.level &&
        selectLevel === SelectLevelEnum.level_2) ||
      (prevSelect.current === SelectLevelEnum.level &&
        selectLevel === SelectLevelEnum.level_3)
    ) {
      return (
        <Typography variant="body2">{t('select_a_parent_category')}</Typography>
      );
    }

    return <Typography variant="body2">{t('no_sub_categories')}</Typography>;
  };

  const renderCategory = useCallback(
    (
      selectCategoryId: ICategory,
      listCategory: ICategory[],
      onSelectCategory: (item: ICategory) => void,
      isLoading: boolean,
      hasChild: boolean,
      selectLevel: SelectLevelEnum
    ) => {
      return (
        <Grid
          item
          xs={4}
          sx={{
            padding: 0,
            borderRight: `1px solid ${theme.palette.customColors.tableBorder}`,
            minHeight: theme.spacing(100),
            maxHeight: theme.spacing(100),
            overflow: 'auto',
            '& .MuiBackdrop-root': {
              position: `absolute !important`,
              '& .MuiBox-root': {
                padding: theme.spacing(2),
              },
              '& .MuiCircularProgress-root': {
                width: `${theme.spacing(5)} !important`,
                height: `${theme.spacing(5)} !important`,
              },
            },
          }}
        >
          {renderContentCategory(
            selectCategoryId,
            listCategory,
            onSelectCategory,
            isLoading,
            hasChild,
            selectLevel
          )}
        </Grid>
      );
    },
    [listCategoriesLevel2, listCategoriesLevel3]
  );

  const handleCancelModal = () => {
    onCloseModalAddCategory();
  };

  const handleSubmit = () => {
    const itemCategory: ICategory[] = [];
    if (selectCategoryLevel.id !== 0) {
      itemCategory.push({ ...selectCategoryLevel, level: 1 });
    }
    if (selectCategoryLevel2.id !== 0) {
      itemCategory.push({ ...selectCategoryLevel2, level: 2 });
    }
    if (selectCategoryLevel3.id !== 0) {
      itemCategory.push({ ...selectCategoryLevel3, level: 3 });
    }

    const idCategoryLast: number = itemCategory[itemCategory.length - 1].id;
    if (selectedCategories) {
      const result = selectedCategories.findIndex(
        (cat: any) => Number(cat.id) === idCategoryLast
      );

      if (result === -1) {
        setIsMessageError(false);
        onOkModalAddCategory(itemCategory);
        onCloseModalAddCategory();
      } else {
        setIsMessageError(true);
      }
    }
  };

  const isDisableButtonApply = useMemo(() => {
    if (isMaxLevel && maxLevel) {
      return true;
    }
    if (!isMaxLevel && selectCategoryLevel?.id !== 0) {
      return true;
    }

    return false;
  }, [maxLevel, selectCategoryLevel]);

  const renderFooterButton = () => {
    return (
      <>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancelModal}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          type="button"
          onClick={handleSubmit}
          disabled={!isDisableButtonApply}
        >
          {t('apply')}
        </Button>
      </>
    );
  };

  return (
    <>
      <DialogContent
        sx={{
          marginTop: `-${theme.spacing(11)}`,
          [mediaMobileMax]: {
            '& *:not(button, .MuiDialogTitle-root *)': {
              fontSize: theme.spacing(3.5),
              wordBreak: 'break-word',
              whiteSpace: 'break-spaces',
            },
            '& .MuiListItem-root': {
              p: 0,
            },
            '& .MuiListItemText-root': {
              maxWidth: `calc(100% - ${theme.spacing(7.5)})`,
            },
          },
        }}
      >
        <ListCategoryStyled container spacing={2}>
          {renderCategory(
            selectCategoryLevel,
            listCategoriesLevel1 ?? [],
            handleSelectCategory,
            isLoadingCategoryLevel1,
            false,
            SelectLevelEnum.level
          )}
          {renderCategory(
            selectCategoryLevel2,
            listCategoriesLevel2 ?? [],
            handleSelectCategory2,
            isLoadingCategoryLevel2,
            selectCategoryLevel?.children_count !== 0,
            SelectLevelEnum.level_2
          )}
          {renderCategory(
            selectCategoryLevel3,
            listCategoriesLevel3 ?? [],
            handleSelectCategory3,
            isLoadingCategoryLevel3,
            selectCategoryLevel2?.children_count !== 0,
            SelectLevelEnum.level_3
          )}
        </ListCategoryStyled>
        {isMessageError && (
          <Typography
            textAlign="center"
            color="error"
            sx={{
              marginBottom: theme.spacing(8),
              marginTop: theme.spacing(6),
            }}
          >
            {t('this_category_has_been_chosen')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>{renderFooterButton()}</DialogActions>
    </>
  );
};

export default FormSelectCategory;
