import { SearchOutlined } from '@mui/icons-material';
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
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  useGetCompanyInfoQuery,
  useGetListCitiesQuery,
  useGetListDistrictsQuery,
} from '@/apis';
import TabPanel from '@/components/shared-components/tab/TabPanel';
import { NoResultTextStyled } from '@/components/styled-components/Text';
import { TOP_CITIES } from '@/constants/city';
import useMobileDetect from '@/hooks/useMobileDetect';
import { IOption } from '@/types';
import { IAddressAreaGeneral } from '@/types/delivery-address';
import { removeAccent } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';
import { getFirstFieldErrorMessage } from '@/utils/form';
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

export const AreaPickerElement = (props: IAreaPickerElementProps) => {
  const { name, boxWrapperProps, textFieldProps } = props;
  const [tabDelivery, setTabDelivery] = useState(AddressPickerTabEnum.City);
  const { t } = useTranslation();
  const theme = useTheme();
  const { field, fieldState } = useController({
    name,
    defaultValue: null as any,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'area-popper' : undefined;
  const [addressPickerValue, setAddressPickerValue] =
    useState<IAreaPickerElementValue>(initialValue);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);

  const isHasCity = !!addressPickerValue.city?.id;
  const isHasDistrict = !!addressPickerValue.district?.id;
  const { data: companyData } = useGetCompanyInfoQuery();
  const isVietnam = companyData?.country_id?.name === 'Vietnam' || true;

  const { data: citiesResponse, isFetching: isFetchingCity } =
    useGetListCitiesQuery();
  const { data: districtsResponse, isFetching: isFetchingDistricts } =
    useGetListDistrictsQuery(
      addressPickerValue.city?.id ? addressPickerValue.city.id.toString() : '',
      {
        skip: !isHasCity,
      }
    );

  const dataCity: IAddressAreaGeneral[] = citiesResponse?.data || [];
  const dataDistricts: IAddressAreaGeneral[] = districtsResponse?.data || [];

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

  useEffect(() => {
    if (isHasCity && isHasDistrict) {
      const addressNode = document.createElement('div');
      addressNode.className = 'address';
      addressNode.innerHTML = `${addressPickerValue.city?.name}, ${addressPickerValue.district?.name}`;

      const existAddressNode =
        inputRef.current?.getElementsByClassName('address')[0];
      if (existAddressNode) {
        inputRef.current?.removeChild(existAddressNode);
      }

      inputRef.current?.prepend(addressNode);
    }
  }, [addressPickerValue]);

  const sortedCities = useMemo(() => {
    const cities: IAddressAreaGeneral[] = [...dataCity].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const topCityIndexes: (number | string)[] = JSON.parse(
      JSON.stringify(TOP_CITIES)
    );

    if (cities.length) {
      // First pass: find which top cities exist in our data
      const existingTopCityIndexes: number[] = [];
      for (let i = 0; i < cities.length; i++) {
        for (let j = 0; j < topCityIndexes.length; j++) {
          if (cities[i].id === topCityIndexes[j]) {
            existingTopCityIndexes.push(i);
            break;
          }
        }
      }

      // Second pass: move existing top cities to the front
      for (let i = existingTopCityIndexes.length - 1; i >= 0; i--) {
        const cityIndex = existingTopCityIndexes[i];
        const topCity = cities[cityIndex];
        cities.splice(cityIndex, 1);
        cities.unshift(topCity);
      }
    }

    return cities.map((city) => ({
      label: city.name ?? '',
      value: `${city.id}`,
    }));
  }, [dataCity]);

  const cities: IOption[] = useMemo(() => {
    return sortedCities.filter((city) =>
      removeAccent(city.label?.toLowerCase()).includes(
        removeAccent(searchValue.toLowerCase())
      )
    );
  }, [searchValue, dataCity]);

  const sortedDistricts = useMemo(() => {
    return dataDistricts
      .map((district) => ({
        label: district.name ?? '',
        value: `${district.id}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [dataDistricts]);

  const districts: IOption[] = useMemo(
    () =>
      sortedDistricts.filter((district) =>
        removeAccent(district.label?.toLowerCase()).includes(
          removeAccent(searchValue.toLowerCase())
        )
      ),
    [searchValue, dataDistricts]
  );

  const openPopper = (event: SyntheticEvent<HTMLDivElement>) => {
    setAnchorEl(event?.currentTarget);

    if (!isHasCity && !isHasDistrict) {
      setTabDelivery(AddressPickerTabEnum.City);
    }

    if (isHasCity && !isHasDistrict) {
      setTabDelivery(AddressPickerTabEnum.District);
    }
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
    const addressNode = document.createElement('div');
    addressNode.className = 'address';

    const selectedCityNode = document.createElement('div');
    selectedCityNode.innerHTML = `${option.label}, `;
    selectedCityNode.className = 'city';

    const existAddressNode =
      inputRef.current?.getElementsByClassName('address')[0];
    if (existAddressNode) {
      inputRef.current?.removeChild(existAddressNode);
    }

    addressNode.appendChild(selectedCityNode);
    inputRef.current?.prepend(addressNode);

    setSearchValue('');
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
    const address = inputRef.current?.getElementsByClassName('address')[0];

    const selectedDistrict = document.createElement('div');
    selectedDistrict.innerHTML = option.label;
    selectedDistrict.className = 'district';

    const existDistrict =
      inputRef.current?.getElementsByClassName('district')[0];
    if (existDistrict) {
      address?.removeChild(existDistrict);
    }

    address?.appendChild(selectedDistrict);

    setSearchValue('');
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

  const onResetValue = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    inputRef.current?.querySelector('input')?.focus();

    setSearchValue('');

    setTabDelivery(AddressPickerTabEnum.City);

    const existAddress = inputRef.current?.getElementsByClassName('address')[0];
    if (existAddress) {
      inputRef.current?.removeChild(existAddress);
    }

    setAddressPickerValue({
      city: null,
      district: null,
    });

    field.onChange({
      district: null,
      city: null,
    });
    closePopper();
  };

  useEffect(() => {
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
  }, [field.value]);

  const renderContentCity = useCallback(() => {
    if (isFetchingCity) return <Loading />;

    return (
      <AreaPickerStyled>
        {cities.length ? (
          cities.map((item, index: number) => {
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
          })
        ) : (
          <NoResultTextStyled>{t('no_result_found')}</NoResultTextStyled>
        )}
      </AreaPickerStyled>
    );
  }, [addressPickerValue.city, cities, isFetchingCity]);

  const renderContentDistrict = useCallback(() => {
    if (isFetchingDistricts) return <Loading />;

    return (
      <AreaPickerStyled>
        {districts.length && isHasCity ? (
          districts.map((item, index: number) => {
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
          })
        ) : (
          <NoResultTextStyled>{t('no_result_found')}</NoResultTextStyled>
        )}
      </AreaPickerStyled>
    );
  }, [addressPickerValue, districts, isFetchingDistricts]);

  const areaPickerPopover = () => {
    return (
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1301 }}
      >
        <BoxPopperStyled
          sx={{
            [mediaMobileMax]: {
              width: '80vw',
            },
          }}
        >
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

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const placeholder = (() => {
    if (!isHasCity && !isHasDistrict) {
      return t('select_city');
    }

    if (isHasCity && !isHasDistrict) {
      if (isVietnam) {
        return t('select_district_vn');
      }
      return t('select_district');
    }
  })();

  const mobileDetect = useMobileDetect();

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={closePopper}
    >
      <BoxClickAwayListenerStyled {...boxWrapperProps}>
        <TextFieldStyled
          onClick={() => {
            if (mobileDetect.isMobileWithoutScreenSize()) {
              if (document) {
                (document.activeElement as HTMLInputElement)?.blur();
              }
            }
          }}
          placeholder={placeholder}
          variant="outlined"
          name={name}
          label={isVietnam ? t('city_district_vn') : t('city_district')}
          value={searchValue}
          InputLabelProps={{ shrink: true }}
          error={!!mappedErrorMessage()}
          helperText={mappedErrorMessage()}
          autoComplete="off"
          inputProps={{
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          InputProps={{
            ref: inputRef,
            readOnly: isHasCity && isHasDistrict,
            endAdornment: (
              <>
                {(isHasCity || isHasDistrict) && !textFieldProps?.disabled && (
                  <IconButton onClick={onResetValue}>
                    <ClearIcon />
                  </IconButton>
                )}
                {anchorEl && <SearchOutlined />}
                <InputAdornment position="end">
                  <ArrowDropDownIcon sx={{ pointerEvents: 'none' }} />
                </InputAdornment>
              </>
            ),
            onChange: handleChangeSearch,
            onClick: textFieldProps?.disabled ? undefined : openPopper,
            sx: {
              ...(isHasCity && {
                '.MuiInputBase-input': {
                  pl: 2,
                },
                [mediaMobileMax]: {
                  '& .address': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '& .MuiOutlinedInput-input': {
                    display: 'none',
                  },
                },
              }),
            },
          }}
          required
          {...textFieldProps}
        />
        {!!anchorEl && areaPickerPopover()}
      </BoxClickAwayListenerStyled>
    </ClickAwayListener>
  );
};
