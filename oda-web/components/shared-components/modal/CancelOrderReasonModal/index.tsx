import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { equals, isEmpty } from 'rambda';
import { memo, useMemo } from 'react';
import {
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import MainTitle from '@/components/common/Title.styled';
import { customRuleNormalString } from '@/utils/form';
import {
  CANCEL_ORDER_REASON,
  CancelOrderReasonsFormEnum,
  ICancelOrderReasonModalProps,
  ICancelOrderReasonsFormEnumForm,
} from './types';

const CHARACTER_OTHER_LIMIT = 200;

const CancelOrderReasonComponent = (props: ICancelOrderReasonModalProps) => {
  const { onCancel, onConfirm, reasons, ...restProps } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  // Form Context Delete Reasons
  const formContext = useForm<ICancelOrderReasonsFormEnumForm>({
    resolver: (data, context, options) => {
      return yupResolver(
        yup.object().shape({
          [CancelOrderReasonsFormEnum.CancelReasonType]: yup
            .string()
            .required(),
          [CancelOrderReasonsFormEnum.Note]: yup
            .string()
            .nullable()
            .when([CancelOrderReasonsFormEnum.CancelReasonType], {
              is: (cancelReasonType: string) =>
                cancelReasonType === CANCEL_ORDER_REASON.OTHER.toString(),
              then: customRuleNormalString({
                name: t('other'),
                maxLength: CHARACTER_OTHER_LIMIT,
                minLength: 1,
                isRequired: true,
                emptyText: t('validate:$field_cannot_be_empty', {
                  field: t('reason'),
                }),
              }),
            }),
        })
      )(data, context, options);
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const formValue = formContext.watch();

  const renderFooterButton = () => {
    return (
      <>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={
            !formContext.formState.isDirty ||
            !isEmpty(formContext.formState.errors)
          }
        >
          {t('confirm')}
        </Button>
      </>
    );
  };

  const lengthOtherNote = useMemo(() => {
    return `${
      formValue[CancelOrderReasonsFormEnum.Note]?.length ?? '0'
    }/${CHARACTER_OTHER_LIMIT}`;
  }, [formValue[CancelOrderReasonsFormEnum.Note]]);

  const isDisableOtherNote = useMemo(
    () =>
      formValue[CancelOrderReasonsFormEnum.CancelReasonType] !==
      CANCEL_ORDER_REASON.OTHER.toString(),
    [formValue[CancelOrderReasonsFormEnum.CancelReasonType]]
  );

  const onSuccess = (value: ICancelOrderReasonsFormEnumForm) => {
    if (
      value[CancelOrderReasonsFormEnum.CancelReasonType] ===
      CANCEL_ORDER_REASON.OTHER.toString()
    ) {
      onConfirm(value);
    } else {
      onConfirm({
        [CancelOrderReasonsFormEnum.CancelReasonType]:
          value[CancelOrderReasonsFormEnum.CancelReasonType],
        [CancelOrderReasonsFormEnum.Note]: reasons.find(
          (option) =>
            option.id.toString() ===
            value[CancelOrderReasonsFormEnum.CancelReasonType]
        )!.label, // BE don't support, that is a bad story :(
      });
    }
  };

  return (
    <Dialog {...restProps}>
      <MainTitle
        sx={{
          p: 4,
          mb: 0,
          textAlign: 'center',
          fontSize: theme.spacing(7),
        }}
      >
        {t('cancel_order')}
      </MainTitle>
      <FormContainer formContext={formContext} onSuccess={onSuccess}>
        <DialogContent>
          <DialogContentText>
            <Typography
              sx={{
                fontSize: theme.spacing(4.5),
                fontWeight: 600,
                fontHeight: theme.spacing(6),
                mb: 4,
              }}
            >
              {t('reason_for_order_cancellation')}
            </Typography>
            <RadioButtonGroup
              name={CancelOrderReasonsFormEnum.CancelReasonType}
              options={reasons}
              parseError={() => ''}
              onChange={() => formContext.trigger()}
            />
            <TextFieldElement
              fullWidth
              autoFocus
              id="other"
              sx={{
                mb: 0,
                height: theme.spacing(19),
                mt: 4.5,
                '& .MuiFormLabel-root': {
                  px: 4,
                  background: 'white',
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': {
                    textAlign: 'left',
                  },
                },
              }}
              name={CancelOrderReasonsFormEnum.Note}
              label={t('other')}
              placeholder={t('type_your_reason_here')}
              InputLabelProps={{
                disabled: isDisableOtherNote,
                shrink: true,
              }}
              InputProps={{
                disabled: isDisableOtherNote,
              }}
              multiline
              maxRows={4}
              helperText={lengthOtherNote}
              required
            />
          </DialogContentText>
        </DialogContent>

        <DialogActions>{renderFooterButton()}</DialogActions>
      </FormContainer>
    </Dialog>
  );
};

export const CancelOrderReasonModal = memo(CancelOrderReasonComponent, equals);
