import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  useConfirmValidateCompanyAddressMutation,
  useGetCompanyAddressListQuery,
  useGetDistrictsListQuery,
  useUpdateMigrationAddressItemMutation,
} from '@/apis';
import { ICityDistrict, ICompanyAddress } from '@/types';
import { mediaMobileMax } from '@/utils/constants';

export interface AddressValidationModalRef {
  open: () => void;
  hide: () => void;
}

const DialogStyled = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '80vw !important',
    maxWidth: `100% !important`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(6),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(6),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(6),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiTableCell-head': {
    fontSize: `${theme.spacing(4)} !important`,
    lineHeight: `${theme.spacing(5.5)} !important`,
    fontWeight: 600,
    py: 3,
  },
  '& .MuiTableCell-body': {
    fontSize: theme.spacing(4),
    lineHeight: theme.spacing(5.5),
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    color: `${theme.palette.text.primary} !important`,
    fontWeight: 500,
    py: 3,
  },
  [mediaMobileMax]: {
    '& .MuiPaper-root': {
      width: '95vw',
      margin: theme.spacing(2),
    },
    '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root':
      {
        padding: theme.spacing(4),
      },
  },
}));

const CompanyAddressValidationModal = forwardRef<AddressValidationModalRef>(
  (_, ref) => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { data: companyAddressList, refetch } = useGetCompanyAddressListQuery(
      {}
    );
    const { data: districtsList, refetch: refetchDistrictsList } =
      useGetDistrictsListQuery({});
    const [confirmValidateCompanyAddress] =
      useConfirmValidateCompanyAddressMutation();
    const [updateMigrationAddressItem] =
      useUpdateMigrationAddressItemMutation();
    const [addresses, setAddresses] = useState<ICompanyAddress[]>([]);
    const [districts, setDistricts] = useState<ICityDistrict[]>([]);
    const [touchedAddressIds, setTouchedAddressIds] = useState<
      Record<number, boolean>
    >({});

    const hasErrors = addresses.some(
      (address) =>
        touchedAddressIds[address.id] &&
        address?.after_migration?.is_required_address &&
        !address?.after_migration?.address?.trim()
    );

    useEffect(() => {
      if (companyAddressList?.data) {
        setAddresses(companyAddressList?.data);
      }
    }, [companyAddressList]);

    useEffect(() => {
      if (districtsList?.data) {
        setDistricts(districtsList?.data);
      }
    }, [districtsList]);

    useEffect(() => {
      refetch();
      refetchDistrictsList();
    }, [open]);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      hide: () => setOpen(false),
    }));

    const handleClose = () => setOpen(false);

    const handleAddressChange = (
      id: number,
      field: keyof ICompanyAddress['after_migration'],
      value: string | { id: number; name: string },
      updateApi = true
    ) => {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === id
            ? {
                ...addr,
                after_migration: {
                  ...addr.after_migration,
                  [field]: value,
                },
              }
            : addr
        )
      );
      const currentAddress = addresses.find((addr) => addr.id === id);
      const newAddress = addresses
        .map((addr) =>
          addr.id === id
            ? {
                ...addr,
                after_migration: {
                  ...addr.after_migration,
                  [field]: value,
                },
              }
            : addr
        )
        .find((addr) => addr.id === id)?.after_migration;

      if (updateApi) {
        updateMigrationAddressItem({
          id,
          new_city_id:
            newAddress?.city?.id ||
            currentAddress?.after_migration?.city?.id ||
            0,
          new_district_id:
            newAddress?.district?.id ||
            currentAddress?.after_migration?.district?.id ||
            0,
          new_address:
            newAddress?.address ||
            currentAddress?.after_migration?.address ||
            '',
        });
      }
    };

    const handleValidate = async () => {
      try {
        await confirmValidateCompanyAddress().unwrap();
        enqueueSnackbar(
          t('company_address_validation_completed_successfully'),
          {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          }
        );
        handleClose();
      } catch (error) {
        enqueueSnackbar(t('failed_to_validate_company_address'), {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    };

    return (
      <DialogStyled open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography
            variant="h4"
            fontWeight={600}
            fontSize={theme.spacing(6)}
            lineHeight={theme.spacing(7)}
          >
            {t('validate_company_address')}
          </Typography>
          <Typography
            sx={{
              mt: 3,
              fontSize: theme.spacing(4),
              lineHeight: theme.spacing(5.5),
              fontWeight: 400,
              textAlign: 'left',
            }}
          >
            {t('company_address_validation_modal_description')}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 3, maxHeight: '70vh' }}>
            <Table sx={{ tableLayout: 'fixed' }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="60px">{t('no')}</TableCell>
                  <TableCell width="120px">{t('feature')}</TableCell>
                  <TableCell width="120px">{t('name')}</TableCell>
                  <TableCell width="300px">{t('before_migration')}</TableCell>
                  <TableCell width="300px">{t('after_migration')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.map((address, index) => (
                  <TableRow
                    key={address.id}
                    sx={{
                      verticalAlign: 'top',
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{address.feature}</TableCell>
                    <TableCell>{address.name}</TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: theme.spacing(4),
                            lineHeight: theme.spacing(5.5),
                            fontWeight: 500,
                            minHeight: '60px',
                          }}
                        >
                          {address.before_migration.full_address}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 1.5,
                              minHeight: '25px',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 400,
                                width: theme.spacing(30),
                              }}
                            >
                              {t('city')}:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 500,
                              }}
                            >
                              {address?.before_migration?.city?.name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 1.5,
                              minHeight: '50px',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 400,
                                width: theme.spacing(30),
                              }}
                            >
                              {t('district')}:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 500,
                              }}
                            >
                              {address?.before_migration?.district?.name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 400,
                                width: theme.spacing(30),
                              }}
                            >
                              {t('street_address')}:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 500,
                              }}
                            >
                              {address.before_migration.address}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: theme.spacing(4),
                            lineHeight: theme.spacing(5.5),
                            fontWeight: 500,
                            minHeight: '60px',
                          }}
                        >
                          {`${address.after_migration.address || ''}, ${
                            address.after_migration.district?.name || ''
                          }, ${address.after_migration.city?.name || ''}`}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 1.5,
                              minHeight: '25px',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 400,
                                width: theme.spacing(35),
                              }}
                            >
                              {t('city')}:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 500,
                              }}
                            >
                              {address?.after_migration?.city?.name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 1.5,
                              minHeight: '50px',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 400,
                                width: theme.spacing(40),
                              }}
                            >
                              {t('commune_ward')}
                              <Box
                                component="span"
                                sx={{
                                  color: theme.palette.error.main,
                                  ml: 0.5,
                                }}
                              >
                                *
                              </Box>
                              :
                            </Typography>
                            <FormControl
                              size="small"
                              sx={{ mb: 2, width: theme.spacing(70) }}
                            >
                              <Select
                                value={address?.after_migration?.district?.id}
                                onChange={(e) =>
                                  handleAddressChange(address.id, 'district', {
                                    id: Number(e.target.value),
                                    name:
                                      districts
                                        ?.find(
                                          (city) =>
                                            city.id ===
                                            address?.after_migration?.city?.id
                                        )
                                        ?.districts?.find(
                                          (district) =>
                                            district.id ===
                                            Number(e.target.value)
                                        )?.name || '',
                                  })
                                }
                                sx={{
                                  fontSize: theme.spacing(3.5),
                                  fontWeight: 500,
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                    },
                                  },
                                }}
                              >
                                {districts
                                  ?.find(
                                    (district) =>
                                      district.id ===
                                      address?.after_migration?.city?.id
                                  )
                                  ?.districts?.map((option) => (
                                    <MenuItem
                                      key={option.id}
                                      value={option.id}
                                      sx={{
                                        fontSize: theme.spacing(3.5),
                                        fontWeight: 500,
                                      }}
                                    >
                                      {option.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 1.5,
                              mb: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: theme.spacing(4),
                                lineHeight: theme.spacing(5.5),
                                fontWeight: 400,
                                width: theme.spacing(40),
                              }}
                            >
                              {t('street_address')}
                              {address?.after_migration
                                ?.is_required_address && (
                                <Box
                                  component="span"
                                  sx={{
                                    color: theme.palette.error.main,
                                    ml: 0.5,
                                  }}
                                >
                                  *
                                </Box>
                              )}
                              :
                            </Typography>
                            <TextField
                              size="small"
                              value={address.after_migration.address}
                              placeholder={t('enter_street_address')}
                              onChange={(e) => {
                                setTouchedAddressIds((prev) => ({
                                  ...prev,
                                  [address.id]: true,
                                }));
                                handleAddressChange(
                                  address.id,
                                  'address',
                                  e.target.value,
                                  false
                                );
                              }}
                              onBlur={(e) =>
                                handleAddressChange(
                                  address.id,
                                  'address',
                                  e.target.value
                                )
                              }
                              required={
                                !!address?.after_migration?.is_required_address
                              }
                              error={
                                !!touchedAddressIds[address.id] &&
                                !!address?.after_migration
                                  ?.is_required_address &&
                                !address?.after_migration?.address?.trim()
                              }
                              helperText={
                                touchedAddressIds[address.id] &&
                                address?.after_migration?.is_required_address &&
                                !address?.after_migration?.address?.trim()
                                  ? t('street_address_is_required')
                                  : ' '
                              }
                              sx={{
                                width: theme.spacing(70),
                                '& .MuiInputLabel-root': {
                                  fontSize: theme.spacing(3.5),
                                  fontWeight: 500,
                                },
                                '& .MuiInputBase-input': {
                                  fontSize: theme.spacing(3.5),
                                  fontWeight: 500,
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleValidate}
            disabled={hasErrors}
            sx={{
              minWidth: theme.spacing(20),
              fontSize: theme.spacing(4),
              fontWeight: 600,
              py: 2,
              px: 6,
              mt: 4,
            }}
          >
            {t('validate')}
          </Button>
        </DialogActions>
      </DialogStyled>
    );
  }
);

CompanyAddressValidationModal.displayName = 'CompanyAddressValidationModal';

export default CompanyAddressValidationModal;
