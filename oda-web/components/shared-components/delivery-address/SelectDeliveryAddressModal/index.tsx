import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogProps,
  Radio,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useStore';
import { companySelectors } from '@/store/slices/company';
import {
  IDeliveryAddress,
  IPartnerDeliveryAddress,
} from '@/types/delivery-address';
import { hexToRGBA } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';
import { formatAddressText } from '@/utils/delivery-address';
import { formatPhoneNumber } from '@/utils/phone';

export interface ISelectDeliveryAddressModalProps extends DialogProps {
  addressId?: number;
  addressList: IDeliveryAddress[] | IPartnerDeliveryAddress[];
  onCancel: () => void;
  onConfirm: (address: IDeliveryAddress | IPartnerDeliveryAddress) => void;
  showAddDeliveryAddress?: boolean;
  onClickAddDeliveryAddress?: () => void;
  colorTheme?: string;
}

export const SelectDeliveryAddressModal = (
  props: ISelectDeliveryAddressModalProps
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const currentCompany = useAppSelector(companySelectors.getCompany)!;
  const { colorTheme = theme.palette.primary.main } = props;

  const {
    addressId: propAddressId = null,
    addressList,
    onCancel,
    onConfirm,
    showAddDeliveryAddress = true,
    onClickAddDeliveryAddress,
    ...restProps
  } = props;

  const [addressIdSelected, setAddressIdSelected] = useState<number | null>(
    () => {
      if (propAddressId) {
        return propAddressId;
      }

      if (addressList.length <= 0) {
        return null;
      }

      const addressDefault = addressList.find((item) => {
        return item.is_default;
      });

      return addressDefault?.id ?? null;
    }
  );

  const addressSelected = useMemo(() => {
    return addressList.find((item) => {
      return item.id === addressIdSelected;
    });
  }, [addressIdSelected, addressList]);

  useEffect(() => {
    (() => {
      if (propAddressId) {
        setAddressIdSelected(propAddressId);
      } else {
        if (addressIdSelected) {
          return;
        }

        if (addressList.length <= 0) {
          return null;
        }

        const addressDefault = addressList.find((item) => {
          return item.is_default;
        });

        setAddressIdSelected(addressDefault?.id ?? null);
      }
    })();
  }, [propAddressId, addressList]);

  const handleClickAddDeliveryAddress = () => {
    onClickAddDeliveryAddress?.();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    if (addressSelected) {
      onConfirm(addressSelected);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: theme.spacing(4),
          boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
        },
      }}
      {...restProps}
    >
      <Box>
        <Box
          sx={{
            p: 6,
            borderBottom: `1px solid ${theme.palette.customColors.tableBorder}`,
            fontSize: theme.spacing(8.5),
            lineHeight: theme.spacing(11.5),
            textAlign: 'center',
            fontWeight: 500,
            [mediaMobileMax]: {
              fontSize: theme.spacing(5),
              p: 3,
            },
          }}
        >
          {t('delivery_address')}
        </Box>

        <Box
          sx={{
            p: theme.spacing(4, 8),
            maxHeight: 488,
            overflow: 'auto',
            [mediaMobileMax]: {
              maxHeight: `calc(85vh - ${theme.spacing(56)})`,
              '& div, & p': {
                fontSize: theme.spacing(3.5),
              },
            },
          }}
        >
          <Box
            sx={{
              fontWeight: 600,
              fontSize: theme.spacing(4.5),
              lineHeight: theme.spacing(6),
              mb: 4,
            }}
          >
            {t('select_delivery_address')}
          </Box>

          {addressList.length > 0 ? (
            <Box>
              {addressList.map((item) => {
                const isActive = item.id === addressIdSelected;

                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      py: 4,
                      borderBottom: `1px solid ${theme.palette.customColors.tableBorder}`,
                      cursor: isActive ? undefined : 'pointer',
                    }}
                    onClick={
                      isActive
                        ? undefined
                        : () => {
                            setAddressIdSelected(item.id);
                          }
                    }
                  >
                    <Box width={24} mr={2}>
                      <Radio
                        checked={isActive}
                        sx={{
                          width: 24,
                          height: 24,
                          position: 'relative',
                          mt: -1,
                          '&.MuiRadio-root.Mui-checked': {
                            color: colorTheme,
                          },
                          '&.MuiRadio-root:hover': {
                            backgroundColor: hexToRGBA(colorTheme, 0.04),
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1', minWidth: `1px` }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            [mediaMobileMax]: {
                              wordBreak: 'break-all',
                              whiteSpace: 'break-spaces',
                            },
                          }}
                        >
                          {item.name}
                        </Box>

                        {item.is_default && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              ml: 2,
                              fontSize: theme.spacing(3.5),
                              lineHeight: theme.spacing(5),
                              px: 2,
                              borderRadius: 50,
                              color: theme.palette.common.white,
                              background: theme.palette.text.secondary,
                            }}
                          >
                            {t('default')}
                          </Box>
                        )}
                      </Box>
                      <Box mt={2}>
                        {formatPhoneNumber(
                          item.mobile,
                          item?.mobile_country_code ||
                            currentCompany?.mobile_country_code
                        )}
                      </Box>
                      <Box mt={2}>
                        {formatAddressText({
                          address: item.address,
                          cityName: item.city?.name,
                          districtName: item.district?.name,
                        })}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box my={8}>No delivery address, please add delivery address</Box>
          )}

          {showAddDeliveryAddress && (
            <Box mt={4}>
              <Box
                sx={{
                  py: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: colorTheme,
                }}
                onClick={handleClickAddDeliveryAddress}
              >
                <AddIcon />
                <Box ml={2}>{t('add_delivery_address')}</Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: theme.spacing(4, 4, 8, 4),
            mx: theme.spacing(2),
            borderTop: `1px solid ${theme.palette.customColors.tableBorder}`,
            [mediaMobileMax]: {
              '& button': {
                width: '100%',
              },
            },
          }}
        >
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            {t('cancel')}
          </Button>

          <Button
            variant="contained"
            sx={{
              ml: 4,
              backgroundColor: colorTheme,
              '&:hover, &:focus': {
                backgroundColor: colorTheme,
              },
            }}
            onClick={handleConfirm}
            disabled={!addressSelected}
          >
            {t('confirm')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
