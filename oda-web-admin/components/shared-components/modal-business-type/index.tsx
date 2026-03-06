// ** MUI Components
import { useGetListCompanyBusinessPlansQuery } from '@/apis';
import {
  BusinessInformationEnum,
  BusinessTypeFormEnum,
} from '@/constants/business';
import { Business, IOptionRadio } from '@/types';
import { BUSINESS_TYPE_OTHER_ID } from '@/utils/constants';
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
import { useEffect, useMemo, useState } from 'react';
import {
  CheckboxButtonGroup,
  FormContainer,
  TextFieldElement,
  UseFormReturn,
  useForm,
} from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface IBusinessType {
  onCloseModalBusinessType: () => void;
  formContext: UseFormReturn<any, any>;
}

export type BusinessInformationForm = Record<BusinessInformationEnum, any>;

// Config Business Type
export type BusinessTypeForm = Record<BusinessTypeFormEnum, any>;

const WrapperBusinessStyled = styled('div')(({ theme }) => ({
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
      padding: theme.spacing(0.75, 0.75, 0.75, 2.5),
      fontWeight: '500',
      fontSize: theme.spacing(4),
    },
  },
}));

const MAX_LENGTH = 64;

const FormBusinessType = (props: IBusinessType) => {
  // Translation
  const { t } = useTranslation();
  // Hooks
  const theme = useTheme();

  const [listBusinessType, setListBusinessType] = useState<IOptionRadio[]>([]);

  const { data: businessType } = useGetListCompanyBusinessPlansQuery();

  // Props
  const { onCloseModalBusinessType, formContext } = props;

  const validate = useMemo<yup.SchemaOf<BusinessTypeForm>>(
    () =>
      yup.object().shape({
        [BusinessTypeFormEnum.GROUP_BUSINESS]: yup.array(),
        [BusinessTypeFormEnum.OTHER]: customRuleString({
          name: t('other'),
          maxLength: MAX_LENGTH,
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
      const businessTypeProcess: Business[] = businessType.data as any;
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
        BusinessTypeFormEnum.GROUP_BUSINESS,
        selectedBusinessType.filter(
          (item) => item.id !== `${BUSINESS_TYPE_OTHER_ID}`
        )
      );

      if (indexOther !== -1) {
        const other: IOptionRadio = selectedBusinessType?.[indexOther];
        formContextBusinessType.setValue(
          BusinessTypeFormEnum.OTHER,
          other?.label ?? ''
        );
      }
    }
  }, []);

  // Render Business Type
  const renderBusinessType = useMemo(() => {
    return (
      <>
        <WrapperBusinessStyled>
          <CheckboxButtonGroup
            name={BusinessTypeFormEnum.GROUP_BUSINESS}
            returnObject
            options={listBusinessType}
            checkboxColor="success"
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
          name={BusinessTypeFormEnum.OTHER}
          label={t('other')}
          placeholder={t('please_specify_if_your_product_is_unavailable')}
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
      !isEmpty(data?.other) && data?.other?.length
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
    formContext.setValue(
      BusinessInformationEnum.BUSINESS,
      businessTypeProcess as never
    );
    // setSelectedBusinessType(businessTypeProcess);
    onCloseModalBusinessType();
  };

  const isDisableButtonSave = useMemo(() => {
    let isDisable = false;
    const selectedBusinessType = formContext.getValues(
      BusinessInformationEnum.BUSINESS
    ) as IOptionRadio[];

    if (selectedBusinessType?.length) {
      const indexOther = selectedBusinessType.findIndex(
        (item) => item.id === `${BUSINESS_TYPE_OTHER_ID}`
      );
      const isSameGroupBusiness = equals(
        formContextBusinessType.watch(BusinessTypeFormEnum.GROUP_BUSINESS),
        selectedBusinessType.filter(
          (item) => item.id !== `${BUSINESS_TYPE_OTHER_ID}`
        )
      );

      if (isSameGroupBusiness) {
        if (indexOther !== -1) {
          const otherPre = selectedBusinessType?.[indexOther]?.label;
          const otherForm = formContextBusinessType.watch(
            BusinessTypeFormEnum.OTHER
          ) as any;
          const isSameOther = equals(otherPre, otherForm);
          if (isSameOther) {
            isDisable = true;
          }
        } else {
          isDisable = !(
            formContextBusinessType.watch(BusinessTypeFormEnum.OTHER)?.length >
            0
          );
        }
      }
    }
    if (
      formContextBusinessType.watch(BusinessTypeFormEnum.OTHER)?.length >
      MAX_LENGTH
    ) {
      isDisable = true;
    }
    return isDisable;
  }, [
    formContextBusinessType.watch(BusinessTypeFormEnum.OTHER),
    formContextBusinessType.getValues(BusinessTypeFormEnum.GROUP_BUSINESS),
  ]);

  return (
    <FormContainer formContext={formContextBusinessType}>
      <DialogContent>
        <DialogContentText>{renderBusinessType}</DialogContentText>
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
              formContextBusinessType.watch(BusinessTypeFormEnum.GROUP_BUSINESS)
            ) ||
              !formContextBusinessType.watch(
                BusinessTypeFormEnum.GROUP_BUSINESS
              )) &&
              !formContextBusinessType.watch(BusinessTypeFormEnum.OTHER)) ||
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
