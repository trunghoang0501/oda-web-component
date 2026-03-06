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
import { useGetListBusinessTypesQuery } from '@/apis';
import { Business } from '@/types';
import { BUSINESS_TYPE_OTHER_ID } from '@/utils/constants';
import { customRuleString } from '@/utils/form';

interface IOptionRadio {
  id?: string;
  label?: string;
}

interface IBusinessType {
  onCloseModalBusinessType: () => void;
  formContext: UseFormReturn<any, any>;
}

// Config Business Type
enum BusinessTypeFormEnum {
  groupBusiness = 'groupBusiness',
  other = 'other',
}
export type BusinessTypeForm = Record<
  BusinessTypeFormEnum,
  string[] | string
> & { [BusinessTypeFormEnum.groupBusiness]: any };

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

const FormBusinessType = (props: IBusinessType) => {
  // Translation
  const { t } = useTranslation();
  // Hooks
  const theme = useTheme();

  const [listBusinessType, setListBusinessType] = useState<IOptionRadio[]>([]);

  const { data: businessType } = useGetListBusinessTypesQuery();

  // Props
  const { onCloseModalBusinessType, formContext } = props;

  const validate = useMemo<yup.SchemaOf<BusinessTypeForm>>(
    () =>
      yup.object().shape({
        [BusinessTypeFormEnum.groupBusiness]: yup.array(),
        [BusinessTypeFormEnum.other]: customRuleString({
          name: t('other'),
          maxLength: 64,
          isRequired: false,
        }),
      }),
    []
  );

  const resolverBusinessType = yupResolver(validate);
  // Form Context Modal Business Type
  const formContextBusinessType = useForm<BusinessTypeForm>({
    resolver: resolverBusinessType,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Get list Business Type
  useEffect(() => {
    if (businessType?.success) {
      const businessTypeProcess: Business[] = businessType.data;
      if (businessTypeProcess?.length) {
        const businessProcessed: IOptionRadio[] = businessTypeProcess.reduce<
          IOptionRadio[]
        >((prev: IOptionRadio[], current: Business) => {
          if (current?.id !== BUSINESS_TYPE_OTHER_ID) {
            prev.push({ label: current?.name, id: `${current?.id}` });
          }
          return prev;
        }, []);
        setListBusinessType(businessProcessed);
      }
    }
  }, [businessType?.success]);

  useEffect(() => {
    const selectedBusinessType: IOptionRadio[] =
      formContext.getValues('business');
    if (selectedBusinessType?.length) {
      const indexOther = selectedBusinessType.findIndex(
        (item) => item.id === `${BUSINESS_TYPE_OTHER_ID}`
      );
      formContextBusinessType.setValue(
        BusinessTypeFormEnum.groupBusiness,
        selectedBusinessType.filter(
          (item) => item.id !== `${BUSINESS_TYPE_OTHER_ID}`
        )
      );
      if (indexOther !== -1) {
        const other: IOptionRadio = selectedBusinessType?.[indexOther];
        formContextBusinessType.setValue(
          BusinessTypeFormEnum.other,
          other?.label ?? ''
        );
      }
    }
  }, []);
  // Render Business Type
  const renderBusinessType = useCallback(() => {
    return (
      <>
        <WrapperBusinessStyled>
          <CheckboxButtonGroup
            name={BusinessTypeFormEnum.groupBusiness}
            returnObject
            options={listBusinessType}
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
          name={BusinessTypeFormEnum.other}
          label={t('other_business_type')}
          placeholder={t(
            'please_specify_if_your_business_category_is_unavailable'
          )}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </>
    );
  }, [listBusinessType]);

  // Submit Form Business Type
  const onSubmitBusinessType = async (data: BusinessTypeForm) => {
    const businessTypeProcess: IOptionRadio[] =
      !isEmpty(data?.other) && data?.other
        ? [
            ...(data?.groupBusiness ?? []),
            ...[
              {
                id: `${BUSINESS_TYPE_OTHER_ID}`,
                label: data?.other,
              },
            ],
          ]
        : data?.groupBusiness ?? [];
    formContext.setValue('business', businessTypeProcess as never);
    // setSelectedBusinessType(businessTypeProcess);
    onCloseModalBusinessType();
  };

  const isDisableButtonSave = useMemo(() => {
    let isDisable = false;
    const selectedBusinessType: IOptionRadio[] =
      formContext.getValues('business');
    if (selectedBusinessType?.length) {
      const indexOther = selectedBusinessType.findIndex(
        (item) => item.id === `${BUSINESS_TYPE_OTHER_ID}`
      );
      const isSameGroupBusiness = equals(
        formContextBusinessType.watch(BusinessTypeFormEnum.groupBusiness),
        selectedBusinessType.filter(
          (item) => item.id !== `${BUSINESS_TYPE_OTHER_ID}`
        )
      );

      if (isSameGroupBusiness) {
        if (indexOther !== -1) {
          const isSameOther = equals(
            selectedBusinessType?.[indexOther]?.label,
            formContextBusinessType.watch(BusinessTypeFormEnum.other)
          );
          if (isSameOther) {
            isDisable = true;
          }
        } else {
          if (formContextBusinessType.watch(BusinessTypeFormEnum.other)) {
            return false;
          }
          return true;
        }
      }
    }
    return isDisable;
  }, [
    formContextBusinessType.watch(BusinessTypeFormEnum.other),
    formContextBusinessType.getValues(BusinessTypeFormEnum.groupBusiness),
  ]);

  return (
    <FormContainer
      formContext={formContextBusinessType}
      onSuccess={onSubmitBusinessType}
    >
      <DialogContent>
        <DialogContentText>{renderBusinessType()}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCloseModalBusinessType}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          type="button"
          onClick={formContextBusinessType.handleSubmit(onSubmitBusinessType)}
          disabled={
            ((isEmpty(
              formContextBusinessType.watch(BusinessTypeFormEnum.groupBusiness)
            ) ||
              !formContextBusinessType.watch(
                BusinessTypeFormEnum.groupBusiness
              )) &&
              !formContextBusinessType.watch(BusinessTypeFormEnum.other)) ||
            isDisableButtonSave
          }
        >
          {t('apply')}
        </Button>
      </DialogActions>
    </FormContainer>
  );
};

export default FormBusinessType;
