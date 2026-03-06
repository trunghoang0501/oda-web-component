import { Check, CheckCircle, OpenInNew } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  useConfirmConvertAddressMutation,
  useGetMigrationAddressStatusQuery,
} from '@/apis';
import { useAppSelector } from '@/hooks/useStore';
import { companySelectors } from '@/store/slices/company';
import { IMigrationAddressStatus } from '@/types';
import { mediaMobileMax } from '@/utils/constants';
import Loading from './loading';

export interface VietnamAddressMigrationConfirmModalProps {
  openCompany: () => void;
  openPartner: () => void;
}

export interface VietnamAddressMigrationConfirmModalRef {
  open: () => void;
  hide: () => void;
  openCompany: () => void;
  openPartner: () => void;
}

const DialogStyled = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '90vw !important',
    maxWidth: '800px !important',
    borderRadius: theme.spacing(3),
    maxHeight: '90vh',
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(4, 4, 3, 4),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3, 4, 4, 4),
    borderTop: `1px solid ${theme.palette.divider}`,
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },
  [mediaMobileMax]: {
    '& .MuiPaper-root': {
      width: '95vw',
      margin: theme.spacing(2),
    },
    '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root':
      {
        padding: theme.spacing(3),
      },
  },
}));

const SectionBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '&:last-child': { marginBottom: 0 },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const SectionNumber = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '15px',
  fontWeight: 600,
  flexShrink: 0,
}));

const StatusCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.5), // softer rounding
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}));

const ActionLink = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '14px',
  fontWeight: 500,
  '&:hover': { textDecoration: 'underline' },
}));

const ChangesBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFF8E1',
  border: `1px solid #FFB300`,
  borderRadius: theme.spacing(2),
  '& ul': {
    margin: 0,
    paddingLeft: theme.spacing(3),
    listStyle: 'disc',
  },
  '& li': {
    marginBottom: theme.spacing(1),
    fontSize: '14px',
    lineHeight: 1.6,
    '&:last-child': { marginBottom: 0 },
  },
}));

const VietnamAddressMigrationConfirmModal = forwardRef<
  VietnamAddressMigrationConfirmModalRef,
  VietnamAddressMigrationConfirmModalProps
>((props, ref) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openCompany, openPartner } = props;
  const handleOpenCompany = () => {
    openCompany();
    setOpen(false);
  };
  const handleOpenPartner = () => {
    openPartner();
    setOpen(false);
  };
  const currentCompany = useAppSelector(companySelectors.getCompany);
  const { data: migrationStatus, refetch } = useGetMigrationAddressStatusQuery(
    undefined,
    {
      skip: !open,
    }
  );
  const [confirmConvertAddress, { isLoading }] =
    useConfirmConvertAddressMutation();

  const migrationData: IMigrationAddressStatus | null =
    migrationStatus?.data || null;

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch, currentCompany?.name]);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    hide: () => setOpen(false),
    openCompany: () => openCompany(),
    openPartner: () => openPartner(),
  }));

  const handleClose = () => {
    setOpen(false);
    setCompanyName('');
    setIsSubmitting(false);
  };

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyName(event.target.value);
  };

  const isCompanyNameValid = companyName.trim() === currentCompany?.name;
  const canConfirm =
    migrationData &&
    migrationData.is_migrate_company &&
    migrationData.is_migrate_partner &&
    isCompanyNameValid;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setIsSubmitting(true);
    try {
      await confirmConvertAddress({
        company_name: companyName.trim(),
      }).unwrap();
      enqueueSnackbar(t('migration_confirmed_successfully'), {
        variant: 'success',
      });
      refetch();
      handleClose();
    } catch (error) {
      enqueueSnackbar(t('failed_to_confirm_migration'), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (isValidated: boolean) => {
    return isValidated ? t('validated') : t('not_validated');
  };

  return (
    <DialogStyled open={open} onClose={handleClose} maxWidth={false} fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight={600} sx={{ fontSize: '20px' }}>
          {t('confirm_new_vietnam_address_format')}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ my: 4, lineHeight: 1.5 }}>
          {t(
            'you_are_about_to_switch_your_company_s_address_data_to_the_new_two_level_format'
          )}
        </Typography>

        {/* Section 1 */}
        <SectionBox>
          <SectionHeader>
            <SectionNumber
              sx={{
                backgroundColor: '#E3F2FD',
                color: '#1565C0',
              }}
            >
              1
            </SectionNumber>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
              {t('company_and_partner_address_validation_status')}
            </Typography>
          </SectionHeader>

          <Typography sx={{ mb: 3, lineHeight: 1.5, pl: 9 }}>
            {t(
              'company_and_partner_address_lists_must_be_validated_before_confirming_the_switch_to_the_new_format'
            )}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 9 }}>
            <StatusCard>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>
                  {t('validate_company_address')}
                </Typography>
                <Box
                  sx={{
                    height: '1px',
                    backgroundColor: '#e0e0e0',
                    margin: '12px 0',
                    width: '100%',
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: migrationData?.is_migrate_company
                          ? '#4caf50'
                          : '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '16px' }}>
                        {getStatusText(
                          migrationData?.is_migrate_company || false
                        )}
                      </Typography>
                      {migrationData?.is_migrate_company ? (
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#666',
                            marginTop: '2px',
                          }}
                        >
                          {migrationData?.company_validated_at} {t('by')}{' '}
                          <strong>{migrationData?.company_validated_by}</strong>
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                  {!migrationData?.is_migrate_company && (
                    <ActionLink onClick={handleOpenCompany}>
                      <OpenInNew sx={{ fontSize: 24, color: '#1976d2' }} />
                    </ActionLink>
                  )}
                </Box>
              </Box>
            </StatusCard>

            <StatusCard>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>
                  {t('validate_partner_address')}
                </Typography>
                <Box
                  sx={{
                    height: '1px',
                    backgroundColor: '#e0e0e0',
                    margin: '12px 0',
                    width: '100%',
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: migrationData?.is_migrate_partner
                          ? '#4caf50'
                          : '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '16px' }}>
                        {getStatusText(
                          migrationData?.is_migrate_partner || false
                        )}
                      </Typography>
                      {migrationData?.is_migrate_partner ? (
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#666',
                            marginTop: '2px',
                          }}
                        >
                          {migrationData?.partner_validated_at} {t('by')}{' '}
                          <strong>{migrationData?.partner_validated_by}</strong>
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                  {!migrationData?.is_migrate_partner && (
                    <ActionLink onClick={handleOpenPartner}>
                      <OpenInNew sx={{ fontSize: 24, color: '#1976d2' }} />
                    </ActionLink>
                  )}
                </Box>
              </Box>
            </StatusCard>
          </Box>
        </SectionBox>

        {/* Section 2 */}
        <SectionBox>
          <SectionHeader>
            <SectionNumber
              sx={{
                backgroundColor: '#fdf4ed',
                color: '#E65100',
              }}
            >
              2
            </SectionNumber>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
              {t('what_to_expect_after_confirmation')}
            </Typography>
          </SectionHeader>

          <Typography sx={{ mb: 3, color: '#666', lineHeight: 1.5, pl: 9 }}>
            {t(
              'understand_the_changes_that_will_take_effect_once_you_confirm_this_update'
            )}
          </Typography>

          <ChangesBox
            sx={{
              backgroundColor: '#fdf4ed',
              border: '1px solid #f8dec9',
              borderRadius: '8px',
              ml: 9,
            }}
          >
            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
              {t('changes_after_confirmation')}
            </Typography>
            <ul style={{ paddingLeft: '32px' }}>
              <li style={{ fontSize: '16px' }}>
                {t('the_old_district_level_format_will_no_longer_be_available')}
              </li>
              <li style={{ fontSize: '16px' }}>
                {t(
                  'all_address_fields_will_use_the_new_format_across_the_system'
                )}
              </li>
              <li style={{ fontSize: '16px' }}>
                {t(
                  'you_can_still_edit_addresses_later_using_the_new_structure'
                )}
              </li>
              <li style={{ fontSize: '16px', color: '#D32F2F' }}>
                {t('this_action_is_final_and_cannot_be_reversed')}
              </li>
            </ul>
          </ChangesBox>
        </SectionBox>

        {/* Section 3 */}
        <SectionBox>
          <SectionHeader>
            <SectionNumber
              sx={{
                backgroundColor: '#E8F5E8',
                color: '#2E7D32',
              }}
            >
              3
            </SectionNumber>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
              {t('final_confirmation')}
            </Typography>
          </SectionHeader>

          <Typography sx={{ mb: 3, lineHeight: 1.5, pl: 9 }}>
            {t(
              'enter_your_company_name_to_confirm_you_understand_the_consequences_and_want_to_proceed'
            )}
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={4} pl={9}>
            <Typography sx={{ lineHeight: 1.5 }}>
              {t('company_name')} :
            </Typography>
            <Typography sx={{ lineHeight: 1.5, fontWeight: 600 }}>
              {currentCompany?.name}
            </Typography>
          </Box>

          <Box sx={{ ml: 9 }}>
            <TextField
              fullWidth
              label={t('company_name')}
              placeholder={t('enter_company_name_to_confirm')}
              required
              onChange={handleCompanyNameChange}
              value={companyName}
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true, // keeps placeholder visible
                sx: {
                  fontSize: '14px',
                  mb: 0.5,
                  '& .MuiFormLabel-asterisk': { color: '#D32F2F' }, // red asterisk
                },
              }}
              sx={{
                '& .MuiInputBase-input': { fontSize: '14px' },
                '& .MuiInputBase-root': {
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    borderRadius: '8px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bdbdbd',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': { fontSize: '14px' },
              }}
              error={companyName.trim() !== '' && !isCompanyNameValid}
              helperText={
                companyName.trim() !== '' && !isCompanyNameValid
                  ? t('please_enter_the_exact_company_name_to_confirm')
                  : ''
              }
            />
          </Box>
        </SectionBox>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center !important',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '14px',
            minWidth: '80px',
            mt: 4,
          }}
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!canConfirm || isSubmitting}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '14px',
            minWidth: '80px',
            mt: 4,
            backgroundColor: canConfirm
              ? theme.palette.primary.main
              : theme.palette.action.disabledBackground,
            color: canConfirm
              ? theme.palette.primary.contrastText
              : theme.palette.action.disabled,
          }}
        >
          {isSubmitting ? t('confirming') : t('confirm')}
        </Button>
        {isSubmitting && <Loading />}
      </DialogActions>
    </DialogStyled>
  );
});

VietnamAddressMigrationConfirmModal.displayName =
  'VietnamAddressMigrationConfirmModal';

export default VietnamAddressMigrationConfirmModal;
