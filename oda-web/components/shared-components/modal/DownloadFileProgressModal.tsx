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
import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetInventoryWarehouseJobBatchQuery } from '@/apis';
import { useGetJobBatchFinalEventByBatchIdQuery } from '@/apis/job-batch';
import {
  PERCENTAGE_PROGRESS_COMPLETED,
  TIME_TO_UPDATE_API_IN_MS,
} from '@/layouts/components/ProgressFloating/constants';
import { IExportProductResponseData } from '@/types';
import { hexToRGBA } from '@/utils';
import { APP_RUNNING_PROCESS_TYPE } from '@/utils/appRunningProcess';

export interface IDownloadFileProgressModalProps extends DialogProps {
  modalTitle?: ReactNode;
  data: IExportProductResponseData;
  type?: string;
  onFinished: () => void;
  onClickConfirmButton: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
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
 * Design: https://www.figma.com/file/7GsMH0QjrqC0zBvyarWLfY/Oda-Desktop-05?type=design&node-id=17937-1248923&mode=dev
 */
const DownloadFileProgressModal = (props: IDownloadFileProgressModalProps) => {
  const { t } = useTranslation();
  const {
    modalTitle,
    data,
    type,
    onClickConfirmButton,
    onFinished,
    ...restProps
  } = props;
  const theme = useTheme();

  const [downloadFileProgress, setDownloadFileProgress] = useState<number>(0);

  const [progressFailedJobs, setProgressFailedJobs] = useState<number>(0);

  const { data: jobBatchProgressResp } =
    type === APP_RUNNING_PROCESS_TYPE.DOWNLOAD_INVENTORY_TEMPLATE
      ? useGetInventoryWarehouseJobBatchQuery(
          {
            batchId: data.batch_id,
          },
          {
            pollingInterval: TIME_TO_UPDATE_API_IN_MS,
            skip:
              !data.batch_id ||
              downloadFileProgress === PERCENTAGE_PROGRESS_COMPLETED ||
              progressFailedJobs !== 0,
          }
        )
      : useGetJobBatchFinalEventByBatchIdQuery(
          {
            batchId: data.batch_id,
          },
          {
            pollingInterval: TIME_TO_UPDATE_API_IN_MS,
            skip:
              !data.batch_id ||
              downloadFileProgress === PERCENTAGE_PROGRESS_COMPLETED ||
              progressFailedJobs !== 0,
          }
        );

  useEffect(() => {
    if (jobBatchProgressResp?.success) {
      if (jobBatchProgressResp?.data?.progress) {
        setDownloadFileProgress(jobBatchProgressResp.data.progress);
      }
      if (jobBatchProgressResp?.data?.failedJobs) {
        setProgressFailedJobs(jobBatchProgressResp.data.failedJobs);
      }
    }
  }, [jobBatchProgressResp]);

  const handleClickConfirmButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    onClickConfirmButton(e);
  };

  useEffect(() => {
    if (downloadFileProgress === PERCENTAGE_PROGRESS_COMPLETED) {
      const a = document.createElement('a');
      a.href = data.file_url;
      a.download = data.batch_name;
      a.click();

      onFinished();
    }
  }, [downloadFileProgress]);

  return (
    <DialogStyled {...restProps}>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <Box pb={4}>
          <Stack gap={8}>
            <Stack direction="row" gap={3} alignItems="end">
              <Box flex={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mb={2}
                  alignItems="center"
                >
                  <Typography fontSize={theme.spacing(4.5)} fontWeight={600}>
                    {data.batch_name}
                  </Typography>
                  <Typography
                    fontWeight={progressFailedJobs > 0 ? 400 : 600}
                    color={progressFailedJobs > 0 ? 'error' : ''}
                    fontSize={theme.spacing(progressFailedJobs > 0 ? 3 : 4)}
                  >
                    {progressFailedJobs > 0
                      ? t('error_while_processing')
                      : `${downloadFileProgress}%`}
                  </Typography>
                </Stack>

                <BorderLinearProgress
                  variant="determinate"
                  value={downloadFileProgress}
                  color={progressFailedJobs > 0 ? 'error' : 'success'}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 4 }}>
        <Button
          variant="contained"
          color={progressFailedJobs > 0 ? 'error' : 'primary'}
          onClick={handleClickConfirmButton}
          sx={{ width: theme.spacing(25) }}
        >
          {t('ok')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default DownloadFileProgressModal;
