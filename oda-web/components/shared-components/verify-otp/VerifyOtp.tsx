import { Box, BoxProps, Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useResendOTPMutation, useVerifyOTPMutation } from '@/apis';
import MessageAlert from '@/components/shared-components/message-style-alert';
import Time from '@/components/shared-components/verify-otp/Time';
import { AppDispatch } from '@/store';
import {
  otpSlice,
  selectExpireTime,
  selectIsRunning,
  selectOtp,
  selectPhone,
  selectUuid,
  sendPhoneOtp,
  startCountDown,
  startCountExpire,
} from '@/store/slices/otp';
import { formatStringToPhoneNumber } from '@/utils';
import { SNACK_BAR_DURATION, mediaMobileMax } from '@/utils/constants';
import { formatPhoneNumber } from '@/utils/phone';
import Loading from '../loading';
import OtpInput from './OtpInput';

const InputGroup = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& >div': {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  '.verifyStep': {
    input: {
      borderWidth: `2px`,
      borderStyle: `solid`,
      width: `${theme.spacing(14)}`,
      height: `${theme.spacing(14)}`,
      [mediaMobileMax]: {
        width: `${theme.spacing(10)} !important`,
        height: `${theme.spacing(10)} !important`,
        borderRadius: theme.spacing(1),
      },
      borderRadius: theme.spacing(2),
      fontSize: theme.spacing(8),
      fontWeight: 500,
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.customColors.tableBorder}`,
      '&:focus-visible': {
        borderColor: `${theme.palette.primary.main}`,
        outlineWidth: theme.spacing(0.5),
        outlineColor: `${theme.palette.primary.main}`,
      },
    },
    '&.borderOtp': {
      input: {
        borderColor: `${theme.palette.primary.main}`,
        borderStyle: 'solid',
        outlineWidth: theme.spacing(0.5),
        '&:focus-visible': {
          outlineWidth: theme.spacing(0.5),
          borderColor: `${theme.palette.primary.main}`,
          outlineColor: `${theme.palette.primary.main}`,
          outlineStyle: 'solid',
          color: theme.palette.primary.main,
        },
      },
    },
    '&.borderOtpErr': {
      input: {
        borderColor: `${theme.palette.error.main}`,
        borderStyle: 'solid',
        outlineWidth: theme.spacing(0.5),
        '&:focus-visible': {
          borderColor: `${theme.palette.error.main}`,
          outlineColor: `${theme.palette.error.main}`,
          outlineStyle: 'solid',
          outlineWidth: theme.spacing(0.5),
          color: theme.palette.error.main,
        },
      },
    },
  },
}));

export interface IVerifyOtp {
  onValidateSuccess?: () => void;
  onCloseModalVerify?: () => void;
  mobileCountryCode?: string;
}

export enum VerifyOtpEnum {
  expireTime = 'expireTime',
  incorrectOtp = 'incorrectOtp',
  wrongOtpLength = 'wrongOptLength',
}

export interface VerifyOtpErr {
  err: Boolean;
  message: string;
}

const RESEND_COLOR = '#2196F3';

const VerifyOtp = (props: IVerifyOtp) => {
  const { onValidateSuccess, onCloseModalVerify, mobileCountryCode } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const initialErr = {
    [VerifyOtpEnum.expireTime]: {
      err: false,
      message: '',
    },
    [VerifyOtpEnum.incorrectOtp]: {
      err: false,
      message: '',
    },
    [VerifyOtpEnum.wrongOtpLength]: {
      err: false,
      message: '',
    },
  };
  const otpValue = useSelector(selectOtp);
  const expireTime = useSelector(selectExpireTime);
  const phone = useSelector(selectPhone);
  const isRunning = useSelector(selectIsRunning);
  const uuid = useSelector(selectUuid);

  const { enqueueSnackbar } = useSnackbar();
  const [err, setErr] = useState(initialErr);
  const [isLoadingSubmitCaptcha, setIsLoadingSubmitCaptcha] = useState(false);
  const [isChange, setIsChange] = useState(false);
  //  use this state to check focus otp input when reset otp input by otpKey
  const [firstFocusOtpInput, setFirstFocusOtpInput] = useState(true);

  const [verifyOTP] = useVerifyOTPMutation();
  const [resendOTP] = useResendOTPMutation();

  useEffect(() => {
    //  reset all value by the time inside component
    dispatch(otpSlice.actions.setValue(''));
    setErr({ ...initialErr });
    setIsChange(false);
    setFirstFocusOtpInput(true);
  }, []);

  useEffect(() => {
    if (!expireTime) {
      setErr({
        ...err,
        [VerifyOtpEnum.expireTime]: {
          err: true,
          message: t('dialog:verification_code_has_been_expired'),
        },
      });
    } else {
      setErr({
        ...err,
        [VerifyOtpEnum.expireTime]: {
          err: false,
          message: '',
        },
      });
    }
  }, [expireTime]);

  useEffect(() => {
    if (err[VerifyOtpEnum.wrongOtpLength].err) {
      const element = document.getElementsByClassName('verifyStep');
      for (let i = otpValue.length; i < 6; i += 1) {
        element[i]?.classList?.add('borderOtpErr');
      }
      for (let i = 0; i < otpValue.length; i += 1) {
        element[i]?.classList?.remove('borderOtpErr');
      }
    } else {
      removeClass('borderOtpErr');
    }
  }, [err]);

  const removeClass = (nameClass: string) => {
    const elements = document.querySelectorAll(`.${nameClass}`);
    if (elements?.length) {
      elements.forEach((element, index) => {
        elements[index].classList.remove(nameClass);
      });
    }
  };

  const borderInputProceed = (classInput: string, classBorder: string) => {
    const element = document.getElementsByClassName(classInput);
    if (otpValue?.length) {
      element[otpValue.length - 1].classList.add(classBorder);
    }
  };

  useEffect(() => {
    const autoSubmit = () => {
      if (otpValue?.length) {
        borderInputProceed('verifyStep', 'borderOtp');
      }
      if (otpValue?.length === 6) {
        setErr({
          ...err,
          [VerifyOtpEnum.wrongOtpLength]: {
            err: false,
            message: '',
          },
        });
        setFirstFocusOtpInput(true);
        validateOtp();
      }
    };
    autoSubmit();
  }, [otpValue]);

  const handleChange = async (_otp: string) => {
    dispatch(otpSlice.actions.setValue(_otp));
    setErr({
      ...err,
      [VerifyOtpEnum.incorrectOtp]: {
        err: false,
        message: '',
      },
    });
    setIsChange(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 50);
    });
    setIsChange(false);
  };

  const showAlert = (e: any) => {
    enqueueSnackbar(e?.toString() ?? 'Error', {
      variant: 'error',
      autoHideDuration: SNACK_BAR_DURATION,
    });
  };

  const validateOtp = async () => {
    setIsLoadingSubmitCaptcha(true);
    try {
      const verifyOTPResp = await verifyOTP({
        otp: otpValue,
        uuid,
      }).unwrap();

      if (verifyOTPResp?.success) {
        dispatch(otpSlice.actions.setValue(''));
        setTimeout(() => {
          setErr({
            ...err,
            [VerifyOtpEnum.incorrectOtp]: {
              err: false,
              message: '',
            },
          });
        }, 50);
        setIsLoadingSubmitCaptcha(false);
        if (typeof onValidateSuccess === 'function') {
          onValidateSuccess();
        }
      } else {
        dispatch(otpSlice.actions.setValue(''));
        setTimeout(() => {
          setErr({
            ...err,
            [VerifyOtpEnum.incorrectOtp]: {
              err: true,
              message: verifyOTPResp?.message ?? '',
            },
          });
        }, 50);
        setIsLoadingSubmitCaptcha(false);
        removeClass('borderOtp');
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(otpSlice.actions.setValue(''));
        setTimeout(() => {
          setErr({
            ...err,
            [VerifyOtpEnum.incorrectOtp]: {
              err: true,
              message: t('the_verification_code_was_incorect'),
            },
          });
        }, 50);
      }
      setIsLoadingSubmitCaptcha(false);
      removeClass('borderOtp');
    }
  };
  const handleResendOtp = async () => {
    setErr({
      ...err,
      [VerifyOtpEnum.wrongOtpLength]: {
        err: false,
        message: '',
      },
      [VerifyOtpEnum.incorrectOtp]: {
        err: false,
        message: '',
      },
    });
    setFirstFocusOtpInput(true);
    dispatch(otpSlice.actions.setValue(''));
    try {
      // TODO: I need to refactor the code here.
      const data = await dispatch(
        sendPhoneOtp({
          inputPhone: '',
          action: 'signup',
        })
      ).unwrap();

      if (data) {
        const resendOtpResponse = await resendOTP({
          uuid,
        }).unwrap();

        if (resendOtpResponse.success) {
          dispatch(startCountDown());
          dispatch(startCountExpire());

          dispatch(otpSlice.actions.setUuid(resendOtpResponse.data.uuid));
        }
      }
    } catch (e) {
      showAlert(e);
    }
  };

  const renderErrLocal = () => {
    let messageErr = '';
    if (err?.[VerifyOtpEnum.wrongOtpLength].err) {
      messageErr = err?.[VerifyOtpEnum.wrongOtpLength].message;
    }
    if (err?.[VerifyOtpEnum.expireTime].err) {
      messageErr = err?.[VerifyOtpEnum.expireTime].message;
    }

    return messageErr?.length ? (
      <Typography
        variant="body1"
        color="error"
        sx={{
          fontSize: theme.spacing(3),
          mt: theme.spacing(4.5),
          textAlign: 'center',
        }}
      >
        {messageErr}
      </Typography>
    ) : null;
  };

  const onBlurInput = () => {
    if (firstFocusOtpInput) {
      setFirstFocusOtpInput(false);
      setErr({
        ...err,
        [VerifyOtpEnum.wrongOtpLength]: {
          err: false,
          message: '',
        },
      });
      return;
    }
    if (!isChange) {
      if ((otpValue?.length ?? 0) < 6 && !firstFocusOtpInput) {
        setErr({
          ...err,
          [VerifyOtpEnum.wrongOtpLength]: {
            err: true,
            message: t('dialog:verification_code_must_contain_6_digit'),
          },
        });
      }
    }
  };

  return (
    <Box className="otpBox">
      {isLoadingSubmitCaptcha && <Loading />}
      <Box
        sx={{
          mb: 9,
          [mediaMobileMax]: {
            mb: 6,
          },
        }}
      >
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
          {t('verification_code_has_been_sent_to')}:
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            fontSize: theme.spacing(8),
            [mediaMobileMax]: {
              fontSize: theme.spacing(4),
              fontWeight: 600,
            },
          }}
        >
          {phone ? formatPhoneNumber(phone, mobileCountryCode) : '-'}
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontSize: theme.spacing(4.5),
          fontWeight: 600,
          [mediaMobileMax]: {
            fontSize: `${theme.spacing(4)} !important`,
          },
        }}
      >
        {t('enter_a_verification_code')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: theme.spacing(4.5),
          mb: 8,
          [mediaMobileMax]: {
            mb: 4,
          },
        }}
      >
        {t('get_a_verification_code_from_your_mobile_phone')}.
      </Typography>
      {err[VerifyOtpEnum.incorrectOtp].err && (
        <MessageAlert
          severity="error"
          title={t('dialog:error')}
          content={err[VerifyOtpEnum.incorrectOtp].message}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: theme.spacing(8),
          [mediaMobileMax]: {
            mb: 4,
          },
        }}
      >
        <Typography sx={{ fontWeight: 600, m: 0 }} variant="body1" gutterBottom>
          {t('didnt_receive_code')}
        </Typography>

        <Button
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: theme.spacing(4),
            textDecoration: 'underline',
            color: isRunning ? theme.palette.text.secondary : RESEND_COLOR,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
          disabled={isRunning}
          onClick={handleResendOtp}
        >
          {t('resend_code')}
        </Button>
      </Box>
      <InputGroup onBlurCapture={onBlurInput}>
        {
          //  Because I can’t find a solution to use patch package with file has been trasplier with webpack.
          //  So I decided to add a new file that has been copy from the source code in this lib:
          //  https://www.npmjs.com/package/react-otp-input
        }
        <OtpInput
          className="verifyStep"
          separator={<Typography variant="body1" sx={{ pl: 4 }} />}
          // inputStyle={otpInputStyle}
          // focusStyle={{
          //   outlineColor: `${theme.palette.primary.main}`,
          //   outlineStyle: 'solid',
          //   color: theme.palette.primary.main,
          // }}
          value={otpValue}
          onChange={handleChange}
          numInputs={6}
          isInputNum
          shouldAutoFocus
          changeCodeAtFocus={false}
        />
        {renderErrLocal()}
      </InputGroup>

      <Time />

      {onCloseModalVerify && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size="large"
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{
              textTransform: 'capitalize',
              fontSize: theme.spacing(4.5),
              m: 0,
              mr: theme.spacing(4),
            }}
            type="button"
            onClick={onCloseModalVerify}
          >
            {t('cancel')}
          </Button>
        </Box>
      )}

      <div id="recaptcha-container-resend" />
    </Box>
  );
};

export default VerifyOtp;
