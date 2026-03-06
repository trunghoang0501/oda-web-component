// ** MUI Components
import { useGetListCompanySellingProductQuery } from '@/apis';
import {
  SellingInformationEnum,
  SellingProductFormEnum,
} from '@/constants/selling';
import { Business, IOptionRadio } from '@/types';
import { SELLING_PRODUCT_OTHER_ID } from '@/utils/constants';
import { customRuleString } from '@/utils/form';
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

export type SellingInformationForm = Record<
  SellingInformationEnum,
  string[] | string
>;

interface ISellingProduct {
  onCloseModalSellingProduct: () => void;
  formContext: UseFormReturn<any, any>;
}

const MAX_LENGTH = 64;

// Config Business Type
export type SellingProductForm = Record<
  SellingProductFormEnum,
  string[] | string
> & { [SellingProductFormEnum.GROUP_BUSINESS]: any };

const WrapperBusinessStyled = styled('div')(({ theme }) => ({
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
      padding: theme.spacing(0.75, 2.5),
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

  const { data: sellingProduct } = useGetListCompanySellingProductQuery();

  // Props
  const { onCloseModalSellingProduct, formContext } = props;

  const validate = useMemo<yup.SchemaOf<SellingProductForm>>(
    () =>
      yup.object().shape({
        [SellingProductFormEnum.GROUP_BUSINESS]: yup.array(),
        [SellingProductFormEnum.OTHER]: customRuleString({
          name: t('other'),
          maxLength: MAX_LENGTH,
          isRequired: false,
        }),
      }),
    []
  );

  const resolverSellingProduct = yupResolver(validate);
  // Form Context Modal Business Type
  const formContextSelling = useForm<SellingProductForm>({
    defaultValues: {
      [SellingProductFormEnum.GROUP_BUSINESS]: [],
      [SellingProductFormEnum.OTHER]: '',
    },
    resolver: resolverSellingProduct,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Get list Selling Product
  useEffect(() => {
    if (sellingProduct?.success) {
      const sellingProductProcess: Business[] = sellingProduct.data as any;
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
    const selectedSellingProduct = formContext.getValues(
      SellingInformationEnum.SELLING
    ) as IOptionRadio[];

    if (selectedSellingProduct?.length) {
      const indexOther = selectedSellingProduct.findIndex(
        (item) => item.id === `${SELLING_PRODUCT_OTHER_ID}`
      );
      formContextSelling.setValue(
        SellingProductFormEnum.GROUP_BUSINESS,
        selectedSellingProduct.filter(
          (item) => item.id !== `${SELLING_PRODUCT_OTHER_ID}`
        )
      );
      if (indexOther !== -1) {
        const other: IOptionRadio = selectedSellingProduct?.[indexOther];
        formContextSelling.setValue(
          SellingProductFormEnum.OTHER,
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
            name={SellingProductFormEnum.GROUP_BUSINESS}
            returnObject
            options={listSellingProduct}
            required
            checkboxColor="success"
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
          name={SellingProductFormEnum.OTHER}
          label={t('other')}
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
    const sellingProductProcess: IOptionRadio[] =
      !isEmpty(data?.other) && data?.other?.length
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

    formContext.setValue(
      SellingInformationEnum.SELLING,
      sellingProductProcess as never
    );
    onCloseModalSellingProduct();
  };

  const isDisableButtonSave = useMemo(() => {
    let isDisable = false;
    const selectedBusinessType = formContext.getValues(
      SellingInformationEnum.SELLING
    ) as IOptionRadio[];
    if (selectedBusinessType?.length) {
      const indexOther = selectedBusinessType.findIndex(
        (item) => item.id === `${SELLING_PRODUCT_OTHER_ID}`
      );
      const isSameGroupBusiness = equals(
        formContextSelling.watch(SellingProductFormEnum.GROUP_BUSINESS),
        selectedBusinessType.filter(
          (item) => item.id !== `${SELLING_PRODUCT_OTHER_ID}`
        )
      );

      if (isSameGroupBusiness) {
        if (indexOther !== -1) {
          const otherPre = selectedBusinessType?.[indexOther]?.label;
          const otherForm = formContextSelling.watch(
            SellingProductFormEnum.OTHER
          ) as any;
          const isSameOther = equals(otherPre, otherForm);
          if (isSameOther) {
            isDisable = true;
          }
        } else {
          isDisable = !(
            formContextSelling.watch(SellingProductFormEnum.OTHER)?.length > 0
          );
        }
      }
    }
    if (
      formContextSelling.watch(SellingProductFormEnum.OTHER)?.length >
      MAX_LENGTH
    ) {
      isDisable = true;
    }
    return isDisable;
  }, [
    formContextSelling.watch(SellingProductFormEnum.OTHER),
    formContextSelling.getValues(SellingProductFormEnum.GROUP_BUSINESS),
  ]);

  return (
    <FormContainer formContext={formContextSelling}>
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
              formContextSelling.watch(SellingProductFormEnum.GROUP_BUSINESS)
            ) ||
              !formContextSelling.watch(
                SellingProductFormEnum.GROUP_BUSINESS
              )) &&
              !formContextSelling.watch(SellingProductFormEnum.OTHER)) ||
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
