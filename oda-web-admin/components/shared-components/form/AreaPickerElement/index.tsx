import {
  useGetCompanyCityListQuery,
  useGetCompanyDistrictListQuery,
} from '@/apis';
import TabPanel from '@/components/shared-components/tab/TabPanel';
import { IOption } from '@/types';
import { IAddressAreaGeneral } from '@/types/delivery-address';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  Popper,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import React, {
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getFirstFieldErrorMessage } from 'src/utils/form';
import Loading from '../../loading';
import {
  AddressPickerTabEnum,
  addressPickerTabs,
  initialValue,
} from './constants';
import {
  AreaPickerStyled,
  BoxClickAwayListenerStyled,
  BoxPopperStyled,
  TextFieldStyled,
} from './styles';
import { IAreaPickerElementProps, IAreaPickerElementValue } from './types';
import { CountryEnum } from '@/containers/customer/add-customer/types';

export const AreaPickerElement = (props: IAreaPickerElementProps) => {
  const {
    name,
    boxWrapperProps,
    textFieldProps,
    countryCode = CountryEnum.Vietnam,
  } = props;
  const [tabDelivery, setTabDelivery] = useState(AddressPickerTabEnum.City);
  const { t } = useTranslation();
  const theme = useTheme();
  const { field, fieldState } = useController({
    name,
    defaultValue: null as any,
  });
  const [anchorEl, setAnchorEl] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const open = Boolean(anchorEl);
  const id = open ? 'area-popper' : undefined;
  const [addressPickerValue, setAddressPickerValue] =
    useState<IAreaPickerElementValue>(initialValue);

  const { data: citiesResponse, isFetching: isFetchingCity } =
    useGetCompanyCityListQuery(
      countryCode ? { country_code: countryCode } : undefined,
      {
        skip: !countryCode,
      }
    );

  const { data: districtsResponse, isFetching: isFetchingDistricts } =
    useGetCompanyDistrictListQuery(
      addressPickerValue.city?.id
        ? {
            id: addressPickerValue.city.id.toString(),
            country_code: countryCode,
          }
        : undefined,
      {
        refetchOnMountOrArgChange: true,
        skip: !addressPickerValue.city?.id || !countryCode,
      }
    );

  const dataCity: any[] = citiesResponse?.data || [];
  const dataDistricts: any[] = districtsResponse?.data || [];
  const isVietnam = countryCode === CountryEnum.Vietnam;

  const errorMessage = getFirstFieldErrorMessage(fieldState.error);
  const mappedErrorMessage = () => {
    if (isVietnam) {
      if (
        errorMessage ===
        t('validate:$field_required', {
          field: t('city_district'),
        })
      ) {
        return t('validate:$field_required', {
          field: t('city_district_vn'),
        });
      }

      if (
        errorMessage ===
        t('dialog:$field_required', {
          field: t('city_district'),
        })
      ) {
        return t('dialog:$field_required', {
          field: t('city_district_vn'),
        });
      }

      if (
        errorMessage ===
        t('dialog:$field_required', {
          field: t('district'),
        })
      ) {
        return t('dialog:$field_required', {
          field: t('district_vn'),
        });
      }

      if (
        errorMessage ===
        t('validate:$field_required', {
          field: t('district'),
        })
      ) {
        return t('validate:$field_required', {
          field: t('district_vn'),
        });
      }
    }
    return errorMessage;
  };

  const cities: IOption[] = useMemo(() => {
    if (!dataCity.length) return [];

    return dataCity.reduce<IOption[]>(
      (prev: IOption[], current: IAddressAreaGeneral) => {
        prev.push({ label: current?.name ?? '', value: `${current?.id}` });
        return prev;
      },
      []
    );
  }, [dataCity]);

  const districts: IOption[] = useMemo(() => {
    if (!dataDistricts.length) return [];

    return dataDistricts.reduce<IOption[]>(
      (prev: IOption[], current: IAddressAreaGeneral) => {
        prev.push({ label: current?.name ?? '', value: `${current?.id}` });
        return prev;
      },
      []
    );
  }, [dataDistricts]);

  const openPopper = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    setAnchorEl(event?.currentTarget);
    setTabDelivery(AddressPickerTabEnum.City);
  };

  const closePopper = () => {
    setAnchorEl(null);
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    if (!addressPickerValue.city && newValue === AddressPickerTabEnum.District)
      return;
    setTabDelivery(newValue);
  };

  const onChangeCity = (option: IOption) => {
    setAddressPickerValue({
      city: {
        id: Number(option.value),
        name: option.label,
      },
      district: null,
    });
    setTabDelivery(AddressPickerTabEnum.District);
    field.onChange({
      city: {
        id: Number(option.value),
        name: option.label,
      },
      district: null,
    });
  };

  const onChangeDistrict = (option: IOption) => {
    setAddressPickerValue({
      ...addressPickerValue,
      district: {
        id: Number(option.value),
        name: option.label,
      },
    });
    field.onChange({
      district: {
        id: Number(option.value),
        name: option.label,
      },
      city: addressPickerValue.city,
    });
    closePopper();
  };

  const onResetValue = () => {
    setAddressPickerValue({
      city: null,
      district: null,
    });
    setTabDelivery(AddressPickerTabEnum.City);
    field.onChange({
      district: null,
      city: null,
    });
    closePopper();
  };

  useEffect(() => {
    if (field.value?.city?.id && field.value?.district?.id) {
      const validCity = dataCity.find(
        (item: any) => item.id === field.value?.city?.id
      );
      if (!validCity) {
        setAddressPickerValue({
          city: null,
          district: null,
        });
        return;
      }

      setAddressPickerValue({
        city: {
          id: field.value?.city?.id,
          name: field.value?.city?.name,
        },
        district: {
          id: field.value?.district?.id,
          name: field.value?.district?.name,
        },
      });
    }
  }, [field.value, dataCity, dataDistricts]);

  const renderContentCity = useCallback(() => {
    if (isFetchingCity) return <Loading />;

    return (
      <AreaPickerStyled>
        {cities.map((item, index: number) => {
          return (
            <ListItem
              key={index}
              className={
                addressPickerValue.city?.id === Number(item?.value)
                  ? 'active'
                  : ''
              }
              button
              onClick={() => onChangeCity(item)}
            >
              <ListItemText primary={item?.label} />
            </ListItem>
          );
        })}
      </AreaPickerStyled>
    );
  }, [addressPickerValue.city, citiesResponse, isFetchingCity]);

  const renderContentDistrict = useCallback(() => {
    if (isFetchingDistricts) return <Loading />;

    return (
      <AreaPickerStyled>
        {districts.map((item, index: number) => {
          return (
            <ListItem
              key={index}
              className={
                addressPickerValue.district?.id === Number(item?.value)
                  ? 'active'
                  : ''
              }
              button
              onClick={() => onChangeDistrict(item)}
            >
              <ListItemText primary={item?.label} />
            </ListItem>
          );
        })}
      </AreaPickerStyled>
    );
  }, [addressPickerValue, districtsResponse, isFetchingDistricts]);

  const areaPickerPopover = () => {
    return (
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1301 }}
      >
        <BoxPopperStyled>
          <Tabs
            value={tabDelivery}
            onChange={handleChangeTab}
            defaultValue={AddressPickerTabEnum.City}
          >
            {addressPickerTabs.map((tab) => {
              if (isVietnam && tab.value === AddressPickerTabEnum.District) {
                return <Tab key={tab.value} label={t('district_vn')} />;
              }
              return <Tab key={tab.value} label={tab.name} />;
            })}
          </Tabs>
          <TabPanel value={tabDelivery} index={AddressPickerTabEnum.City}>
            <Box sx={{ height: theme.spacing(50) }}>{renderContentCity()}</Box>
          </TabPanel>
          <TabPanel value={tabDelivery} index={AddressPickerTabEnum.District}>
            <Box sx={{ height: theme.spacing(50) }}>
              {renderContentDistrict()}
            </Box>
          </TabPanel>
        </BoxPopperStyled>
      </Popper>
    );
  };

  const deliveryAddressValue = (() => {
    if (!addressPickerValue.city?.id && !addressPickerValue.district?.id)
      return '';

    return `${addressPickerValue.city?.name}${
      addressPickerValue.district?.id !== undefined
        ? `, ${addressPickerValue.district?.name}`
        : ''
    }`;
  })();

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={closePopper}
    >
      <BoxClickAwayListenerStyled {...boxWrapperProps}>
        <TextFieldStyled
          placeholder={
            isVietnam ? t('select_city_district_vn') : t('select_city_district')
          }
          variant="outlined"
          name={name}
          label={isVietnam ? t('city_district_vn') : t('city_district')}
          value={deliveryAddressValue}
          InputLabelProps={{ shrink: true }}
          error={!!mappedErrorMessage()}
          helperText={mappedErrorMessage()}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <>
                {deliveryAddressValue && !textFieldProps?.disabled && (
                  <IconButton onClick={() => onResetValue()}>
                    <ClearIcon />
                  </IconButton>
                )}
                <InputAdornment position="end">
                  <ArrowDropDownIcon sx={{ pointerEvents: 'none' }} />
                </InputAdornment>
              </>
            ),
          }}
          required
          onFocus={openPopper}
          {...textFieldProps}
        />
        {!!anchorEl && areaPickerPopover()}
      </BoxClickAwayListenerStyled>
    </ClickAwayListener>
  );
};
