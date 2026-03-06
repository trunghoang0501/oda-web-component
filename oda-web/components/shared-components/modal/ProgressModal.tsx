import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  LinearProgress,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetBranchBatchByBatchIdQuery } from '@/apis/branch';
import {
  PERCENTAGE_PROGRESS_COMPLETED,
  TIME_TO_UPDATE_API_IN_MS,
} from '@/layouts/components/ProgressFloating/constants';
import { hexToRGBA } from '@/utils';

export interface IProgressModalProps extends DialogProps {
  modalTitle?: ReactNode;
  data: {
    batch_product_id: string;
    batch_vendor_id: string;
    branch_id: number;
  };
  onClickConfirmButton?: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  onSuccess?: () => void;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  backgroundColor: hexToRGBA(theme.palette.text.secondary, 0.4),
}));

const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogContent-title': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(4)} !important`,
  },
}));

/**
 * Design: https://www.figma.com/file/auOrjtXed3LT7ZsD83as5F/Oda-Admin-01?node-id=1192%3A49471&t=TBxTmKoJcPYnsUBP-4
 */
const ProgressModal = (props: IProgressModalProps) => {
  const { t } = useTranslation();
  const { modalTitle, data, onClickConfirmButton, onSuccess, ...restProps } =
    props;
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [partnersProgress, setPartnerProgress] = useState<number>(0);
  const [productsProgress, setProductsProgress] = useState<number>(0);

  const [partnersProgressFailedJobs, setPartnerProgressFailedJobs] =
    useState<number>(0);
  const [productsProgressFailedJobs, setProductsProgressFailedJobs] =
    useState<number>(0);

  const { data: partnersProgressResp } = useGetBranchBatchByBatchIdQuery(
    {
      batchId: data.batch_vendor_id,
    },
    {
      pollingInterval: TIME_TO_UPDATE_API_IN_MS,
      skip:
        !data.batch_vendor_id ||
        partnersProgress === PERCENTAGE_PROGRESS_COMPLETED ||
        partnersProgressFailedJobs !== 0,
    }
  );

  useEffect(() => {
    if (partnersProgressResp?.success) {
      if (partnersProgressResp?.data?.progress) {
        setPartnerProgress(partnersProgressResp.data.progress);
      }
      if (partnersProgressResp?.data?.failedJobs) {
        setPartnerProgressFailedJobs(partnersProgressResp.data.failedJobs);
        enqueueSnackbar(t('error:500'), {
          variant: 'error',
        });
      }
    }
  }, [partnersProgressResp]);

  const { data: productsProgressResp } = useGetBranchBatchByBatchIdQuery(
    {
      batchId: data.batch_product_id,
    },
    {
      pollingInterval: TIME_TO_UPDATE_API_IN_MS,
      skip:
        !data.batch_product_id ||
        productsProgress === PERCENTAGE_PROGRESS_COMPLETED ||
        productsProgressFailedJobs !== 0,
    }
  );

  useEffect(() => {
    if (productsProgressResp?.success) {
      if (productsProgressResp?.data?.progress) {
        setProductsProgress(productsProgressResp.data.progress);
      }
      if (partnersProgressResp?.data?.failedJobs) {
        setProductsProgressFailedJobs(partnersProgressResp.data.failedJobs);
        enqueueSnackbar(t('error:500'), {
          variant: 'error',
        });
      }
    }
  }, [productsProgressResp]);

  useEffect(() => {
    if (
      (!data.batch_vendor_id ||
        partnersProgress === PERCENTAGE_PROGRESS_COMPLETED ||
        partnersProgressFailedJobs) &&
      (!data.batch_product_id ||
        productsProgress === PERCENTAGE_PROGRESS_COMPLETED ||
        productsProgressFailedJobs) &&
      typeof onSuccess === 'function'
    )
      onSuccess();
  }, [
    data,
    partnersProgress,
    productsProgress,
    partnersProgressFailedJobs,
    productsProgressFailedJobs,
  ]);

  const handleClickConfirmButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (typeof onClickConfirmButton === 'function') {
      onClickConfirmButton(e);
    }
  };

  return (
    <DialogStyled {...restProps}>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <Typography fontSize={theme.spacing(3.5)}>
          {t('description')}
        </Typography>
        {data.batch_vendor_id && (
          <Box py={4}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography
                fontSize={theme.spacing(4.5)}
                fontWeight={600}
                lineHeight={theme.spacing(6)}
              >
                {t('partners')}
              </Typography>
              <Typography fontWeight={600}>{partnersProgress}%</Typography>
            </Stack>
            <BorderLinearProgress
              variant="determinate"
              value={partnersProgress}
            />
          </Box>
        )}
        {data.batch_product_id && (
          <Box py={4}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography
                fontSize={theme.spacing(4.5)}
                fontWeight={600}
                lineHeight={theme.spacing(6)}
              >
                {t('products')}
              </Typography>
              <Typography fontWeight={600}>{productsProgress}%</Typography>
            </Stack>
            <BorderLinearProgress
              variant="determinate"
              value={productsProgress}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickConfirmButton}
          sx={{ width: theme.spacing(25) }}
        >
          {t('ok')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default ProgressModal;
