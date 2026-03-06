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
import { useGetJobBatchByBatchIdQuery } from '@/apis/job-batch';
import {
  PERCENTAGE_PROGRESS_COMPLETED,
  TIME_TO_UPDATE_API_IN_MS,
} from '@/layouts/components/ProgressFloating/constants';
import { IExportProductResponseData } from '@/types';
import { hexToRGBA } from '@/utils';
import { downloadFile, downloadFileFromBlob } from '@/utils/file';

export interface IExportExcelProgressModalProps extends DialogProps {
  modalTitle?: ReactNode;
  data: IExportProductResponseData;
  description?: string;
  onClickConfirmButton?: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
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
 * Design: https://www.figma.com/file/auOrjtXed3LT7ZsD83as5F/Oda-Admin-01?node-id=1192%3A49471&t=TBxTmKoJcPYnsUBP-4
 */
const ExportExcelProgressModal = (props: IExportExcelProgressModalProps) => {
  const { t } = useTranslation();
  const {
    modalTitle,
    data,
    onClickConfirmButton,
    description: customDescription,
    ...restProps
  } = props;
  const theme = useTheme();

  const [exportProductProgress, setExportProductProgress] = useState<number>(0);

  const [exportProductProgressFailedJobs, setExportProductProgressFailedJobs] =
    useState<number>(0);

  const { data: partnersProgressResp } = useGetJobBatchByBatchIdQuery(
    {
      batchId: data.batch_id,
    },
    {
      pollingInterval: TIME_TO_UPDATE_API_IN_MS,
      skip:
        !data.batch_id ||
        exportProductProgress === PERCENTAGE_PROGRESS_COMPLETED ||
        exportProductProgressFailedJobs !== 0,
    }
  );

  useEffect(() => {
    if (partnersProgressResp?.success) {
      if (partnersProgressResp?.data?.progress) {
        setExportProductProgress(partnersProgressResp.data.progress);
      }
      if (partnersProgressResp?.data?.failedJobs) {
        setExportProductProgressFailedJobs(
          partnersProgressResp.data.failedJobs
        );
      }
    }
  }, [partnersProgressResp]);

  const description =
    exportProductProgress === 100
      ? t('you_can_download_excel')
      : customDescription ?? t('the_system_is_preparing_product');

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
        <Typography fontSize={theme.spacing(3.5)}>{description}</Typography>
        <Box py={4}>
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
                    fontWeight={exportProductProgressFailedJobs > 0 ? 400 : 600}
                    color={exportProductProgressFailedJobs > 0 ? 'error' : ''}
                    fontSize={theme.spacing(
                      exportProductProgressFailedJobs > 0 ? 3 : 4
                    )}
                  >
                    {exportProductProgressFailedJobs > 0
                      ? t('error_while_processing')
                      : `${exportProductProgress}%`}
                  </Typography>
                </Stack>

                <BorderLinearProgress
                  variant="determinate"
                  value={exportProductProgress}
                  color={
                    exportProductProgressFailedJobs > 0 ? 'error' : 'success'
                  }
                />
              </Box>
              {exportProductProgress === 100 && (
                <Box>
                  <Typography
                    component="a"
                    fontSize={theme.spacing(3.5)}
                    color={theme.palette.customColors.colorCyan}
                    sx={{
                      cursor: 'pointer',
                    }}
                    // href={data.file_url}
                    // target="_blank"
                    // download={data.batch_name}
                    onClick={async () => {
                      try {
                        if (partnersProgressResp?.data?.blob) {
                          // Convert base64 to blob
                          const base64Response = await fetch(
                            `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${partnersProgressResp.data.blob}`
                          );
                          const blob = await base64Response.blob();
                          downloadFileFromBlob(blob, data.batch_name);
                        } else {
                          downloadFile(data.file_url, data.batch_name);
                        }
                      } catch (error) {
                        console.error('Error downloading file:', error);
                      }
                    }}
                  >
                    {t('download')}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 4 }}>
        <Button
          variant="contained"
          color={exportProductProgressFailedJobs > 0 ? 'error' : 'primary'}
          onClick={handleClickConfirmButton}
          sx={{ width: theme.spacing(25) }}
        >
          {t('close')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default ExportExcelProgressModal;
