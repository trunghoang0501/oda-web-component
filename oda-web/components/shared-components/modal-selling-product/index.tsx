// ** MUI Components
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { equals, isEmpty } from 'rambda';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckboxButtonGroup,
  FormContainer,
  TextFieldElement,
  UseFormReturn,
  useForm,
} from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useGetListSellingProductQuery } from '@/apis';
import { Business } from '@/types';
import { SELLING_PRODUCT_OTHER_ID } from '@/utils/constants';
import { customRuleString } from '@/utils/form';

interface IOptionRadio {
  id?: string;
  label?: string;
}

interface ISellingProduct {
  onCloseModalSellingProduct: () => void;
  formContext: UseFormReturn<any, any>;
}

// Config Business Type
enum SellingProductFormEnum {
  groupBusiness = 'groupBusiness',
  other = 'other',
}
export type SellingProductForm = Record<
  SellingProductFormEnum,
  string[] | string
> & { [SellingProductFormEnum.groupBusiness]: any };

const WrapperBusinessStyled = styled('div')(({ theme }) => ({
  display: 'block',
  width: '100%',
  marginTop: `-${theme.spacing(3)}`,
  '& .MuiFormControl-root': {
    display: 'block',
    width: '100%',
  },
  '& .MuiFormGroup-root': {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
  },
  '& .MuiFormLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.text.primary,
    },
  },
  '& .MuiFormControlLabel-root': {
    flex: '0 0 100%',
    maxWidth: '100%',
    marginBottom: theme.spacing(4),
    marginLeft: 0,
    marginRight: 0,
    '& .MuiCheckbox-root': {
      padding: 0,
    },
    '& .MuiFormControlLabel-label': {
      paddingLeft: theme.spacing(2.75),
    },
  },
  '& .MuiFormHelperText-root.Mui-error': {
    margin: 0,
  },
  '&.flex-colunm-2': {
    '& .MuiFormControlLabel-root': {
      flex: '0 0 50%',
      maxWidth: '50%',
      marginBottom: 0,
    },
  },
  '& .MuiChip-root': {
    height: 'auto',
    '& .MuiChip-label': {
      lineHeight: theme.spacing(6),
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
      paddingTop: theme.spacing(0.75),
      paddingBottom: theme.spacing(0.75),
      fontWeight: '500',
      fontSize: theme.spacing(4),
    },
  },
}));

const FormSellingProduct = (props: ISellingProduct) => {
  // Translation
  const { t } = useTranslation();
  // Hooks
  const theme = useTheme();

  const [listSellingProduct, setListSellingProduct] = useState<IOptionRadio[]>(
    []
  );

  const { data: sellingProduct } = useGetListSellingProductQuery();

  // Props
  const { onCloseModalSellingProduct, formContext } = props;

  const validate = useMemo<yup.SchemaOf<SellingProductForm>>(
    () =>
      yup.object().shape({
        [SellingProductFormEnum.groupBusiness]: yup.array(),
        [SellingProductFormEnum.other]: customRuleString({
          name: t('other'),
          maxLength: 64,
          isRequired: false,
        }),
      }),
    []
  );

  const resolverSellingProduct = yupResolver(validate);
  // Form Context Modal Business Type
  const formContextSelling = useForm<SellingProductForm>({
    defaultValues: {
      [SellingProductFormEnum.groupBusiness]: [],
      [SellingProductFormEnum.other]: '',
    },
    resolver: resolverSellingProduct,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Get list Selling Product
  useEffect(() => {
    if (sellingProduct?.success) {
      const sellingProductProcess: Business[] = sellingProduct.data;
      if (sellingProductProcess?.length) {
        const sellingProductProcessed: IOptionRadio[] =
          sellingProductProcess.reduce<IOptionRadio[]>(
            (prev: IOptionRadio[], current: Business) => {
              if (current?.id !== SELLING_PRODUCT_OTHER_ID) {
                prev.push({ label: current?.name, id: `${current?.id}` });
              }
              return prev;
            },
            []
          );
        setListSellingProduct(sellingProductProcessed);
      }
    }
  }, [sellingProduct?.success]);

  useEffect(() => {
    const selectedSellingProduct: IOptionRadio[] =
      formContext.getValues('selling');
    if (selectedSellingProduct?.length) {
      const indexOther = selectedSellingProduct.findIndex(
        (item) => item.id === `${SELLING_PRODUCT_OTHER_ID}`
      );
      formContextSelling.setValue(
        SellingProductFormEnum.groupBusiness,
        selectedSellingProduct.filter(
          (item) => item.id !== `${SELLING_PRODUCT_OTHER_ID}`
        )
      );
      if (indexOther !== -1) {
        const other: IOptionRadio = selectedSellingProduct?.[indexOther];
        formContextSelling.setValue(
          SellingProductFormEnum.other,
          other?.label ?? ''
        );
      }
    }
  }, []);

  // Render Business Type
  const renderSellingProduct = useCallback(() => {
    return (
      <>
        <WrapperBusinessStyled>
          <CheckboxButtonGroup
            name={SellingProductFormEnum.groupBusiness}
            returnObject
            options={listSellingProduct}
            required
          />
        </WrapperBusinessStyled>

        <TextFieldElement
          fullWidth
          id="other"
          sx={{
            mb: 8,
            mt: theme.spacing(4.5),
            '& .MuiFormLabel-root': {
              px: theme.spacing(4),
              background: 'white',
            },
          }}
          name={SellingProductFormEnum.other}
          label={t('other_business_type')}
          placeholder={t('please_specify_if_your_product_is_unavailable')}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </>
    );
  }, [listSellingProduct]);

  // Submit Form Selling Product
  const onSubmit = async (data: SellingProductForm) => {
    const sellingProductProcess: IOptionRadio[] = !isEmpty(data?.other)
      ? [
          ...(data?.groupBusiness ?? []),
          ...[
            {
              id: `${SELLING_PRODUCT_OTHER_ID}`,
              label: data?.other,
            },
          ],
        ]
      : data?.groupBusiness ?? [];
    // setSelectedSellingProduct(sellingProductProcess);
    formContext.setValue('selling', sellingProductProcess as never);
    onCloseModalSellingProduct();
  };

  const isDisableButtonSave = useMemo(() => {
    let isDisable = false;
    const selectedBusinessType: IOptionRadio[] =
      formContext.getValues('selling');
    if (selectedBusinessType?.length) {
      const indexOther = selectedBusinessType.findIndex(
        (item) => item.id === `${SELLING_PRODUCT_OTHER_ID}`
      );
      const isSameGroupBusiness = equals(
        formContextSelling.watch(SellingProductFormEnum.groupBusiness),
        selectedBusinessType.filter(
          (item) => item.id !== `${SELLING_PRODUCT_OTHER_ID}`
        )
      );

      if (isSameGroupBusiness) {
        if (indexOther !== -1) {
          const isSameOther = equals(
            selectedBusinessType?.[indexOther]?.label,
            formContextSelling.watch(SellingProductFormEnum.other)
          );
          if (isSameOther) {
            isDisable = true;
          }
        } else {
          if (formContextSelling.watch(SellingProductFormEnum.other)) {
            return false;
          }
          return true;
        }
      }
    }
    return isDisable;
  }, [
    formContextSelling.watch(SellingProductFormEnum.other),
    formContextSelling.getValues(SellingProductFormEnum.groupBusiness),
  ]);

  return (
    <FormContainer formContext={formContextSelling} onSuccess={onSubmit}>
      <DialogContent>
        <DialogContentText>{renderSellingProduct()}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCloseModalSellingProduct}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          type="button"
          onClick={formContextSelling.handleSubmit(onSubmit)}
          disabled={
            ((isEmpty(
              formContextSelling.watch(SellingProductFormEnum.groupBusiness)
            ) ||
              !formContextSelling.watch(
                SellingProductFormEnum.groupBusiness
              )) &&
              !formContextSelling.watch(SellingProductFormEnum.other)) ||
            isDisableButtonSave
          }
        >
          {t('apply')}
        </Button>
      </DialogActions>
    </FormContainer>
  );
};

export default FormSellingProduct;
