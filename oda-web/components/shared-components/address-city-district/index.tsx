import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { isEmpty } from 'rambda';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AutocompleteElement,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import {
  useGetListCitiesQuery,
  useGetListCountriesQuery,
  useGetListDistrictsQuery,
} from '@/apis';
import TextMask from '@/components/shared-components/TextMask';
import { TOP_CITIES } from '@/constants/city';
import { CompanyInformationEnum } from '@/pages/register/components/CompanyInformation';
import { useRegister } from '@/state/RegisterContext';
import { ICity, IDistrict, IOption } from '@/types';
import { IAddressAreaGeneral } from '@/types/delivery-address';

const WrapperCountry = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(8),
}));

const WrapperCity = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(8),
}));

const WrapperDistrict = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(8),
  '& .MuiInputLabel-root': {
    '&.Mui-disabled': {
      color: '#EBE9F1',
    },
  },
  '& .Mui-disabled': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#EBE9F1',
    },
  },
}));

interface ISelectCityProps {
  onBlurPhoneNumber: (e: any) => void;
}

const SelectCity = ({ onBlurPhoneNumber }: ISelectCityProps) => {
  const { t } = useTranslation();

  const { information } = useRegister();

  const { reset, getValues } = useFormContext();

  const [selectedCountry, setSelectedCountry] = useState<IOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<IOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<IOption | null>(
    null
  );

  const { data: countriesResponse, isLoading: isLoadingCountry } =
    useGetListCountriesQuery();

  const { data: citiesResponse, isLoading: isLoadingCity } =
    useGetListCitiesQuery(selectedCountry?.value ?? '', {
      skip: !selectedCountry,
    });

  useEffect(() => {
    if (information?.company?.district) {
      setSelectedDistrict(information?.company?.district as IOption);
    }
    if (information?.company?.city?.value) {
      setSelectedCity(information?.company?.city as IOption);
    }
    if (information?.company?.country?.value) {
      setSelectedCountry(information?.company?.country as IOption);
    }
  }, []);

  const isVietnam = selectedCountry?.label === 'Vietnam';

  const renderCity = useCallback(() => {
    const dataCity: IAddressAreaGeneral[] = citiesResponse?.data || [];

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

    const handleCities = (event: any, option: IOption | null) => {
      reset({
        ...getValues,
        companyName: getValues(CompanyInformationEnum.companyName),
        companyPhone: getValues(CompanyInformationEnum.companyPhone),
        country: getValues(CompanyInformationEnum.country),
        district: '',
        city: option || '',
      });
      setSelectedCity(option);
      setSelectedDistrict(null);
    };

    const isEmptyCity = !getValues(CompanyInformationEnum.city);
    const isShowErrorMsg = getValues(CompanyInformationEnum.city) !== undefined;

    const errorMessageCity = useMemo(() => {
      let error = null;
      if (isEmptyCity && isShowErrorMsg) {
        error = t('dialog:$field_cannot_be_empty', {
          field: t('city'),
        });
      }
      return error;
    }, [isEmptyCity]);

    const renderTextField = (params: AutocompleteRenderInputParams) => {
      return (
        <TextField
          {...params}
          label={t('city')}
          placeholder={t('select_city')}
          InputLabelProps={{
            shrink: true,
          }}
          // error={isEmptyCity && isShowErrorMsg}
          helperText={errorMessageCity}
          variant="outlined"
          required
        />
      );
    };

    return (
      <WrapperCity>
        <Autocomplete
          options={sortedCities}
          loading={isLoadingCity}
          onChange={handleCities}
          value={selectedCity}
          disabled={!selectedCountry}
          renderInput={renderTextField}
        />
        <Box sx={{ display: 'none' }}>
          <AutocompleteElement
            options={sortedCities}
            name={CompanyInformationEnum.city}
            label={t('city')}
            loading={isLoadingCity}
            textFieldProps={{
              placeholder: t('select_city'),
            }}
            required
          />
        </Box>
      </WrapperCity>
    );
  }, [citiesResponse?.success, isLoadingCity, selectedCity, citiesResponse]);

  const renderDistrict = useCallback(() => {
    let districts: IOption[] = [];

    const { data: districtsResponse, isLoading: isLoadingDistricts } =
      useGetListDistrictsQuery(selectedCity?.value ?? '', {
        refetchOnMountOrArgChange: true,
        skip: !selectedCity,
      });

    if (!isEmpty(districtsResponse?.data || [])) {
      const dataDistricts: IDistrict[] = districtsResponse?.data;
      districts = dataDistricts.reduce<IOption[]>(
        (prev: IOption[], current: IDistrict) => {
          prev.push({ label: current?.name ?? '', value: `${current?.id}` });
          return prev;
        },
        []
      );
    }

    const handleDistrict = (event: any, option: IOption | null) => {
      reset({
        ...getValues,
        companyName: getValues(CompanyInformationEnum.companyName),
        companyPhone: getValues(CompanyInformationEnum.companyPhone),
        country: getValues(CompanyInformationEnum.country),
        district: option,
        city: getValues(CompanyInformationEnum.city),
      });
      setSelectedDistrict(option);
    };

    const isValidDistrict = useMemo(
      () => !selectedCity || isEmpty(districts),
      [districts, selectedCity]
    );

    const isEmptyDistrict = !getValues(CompanyInformationEnum.district);
    const isEmptyStringDistrict =
      getValues(CompanyInformationEnum.district) === '';
    const isShowErrorMsg =
      getValues(CompanyInformationEnum.district) !== undefined;

    const errorMessageDistrict = useMemo(() => {
      let error = null;
      if (isEmptyDistrict && !isEmptyStringDistrict && isShowErrorMsg) {
        error = t('dialog:$field_cannot_be_empty', {
          field: isVietnam ? t('district_vn') : t('district'),
        });
      }
      return error;
    }, [isEmptyDistrict, selectedCity]);

    const renderTextField = (params: AutocompleteRenderInputParams) => {
      return (
        <TextField
          {...params}
          label={isVietnam ? t('district_vn') : t('district')}
          placeholder={
            isVietnam ? t('select_district_vn') : t('select_district')
          }
          InputLabelProps={{
            shrink: true,
          }}
          error={isEmptyDistrict && isShowErrorMsg && !isEmptyStringDistrict}
          helperText={errorMessageDistrict}
          variant="outlined"
          required
        />
      );
    };

    return (
      <WrapperDistrict>
        <Autocomplete
          value={selectedDistrict}
          options={selectedCity ? districts : []}
          loading={isLoadingDistricts}
          disabled={isValidDistrict && isEmptyDistrict}
          onChange={handleDistrict}
          renderInput={renderTextField}
        />
        <Box sx={{ display: 'none' }}>
          <AutocompleteElement
            options={selectedCity ? districts : []}
            name={CompanyInformationEnum.district}
            label={isVietnam ? t('district_vn') : t('district')}
            textFieldProps={{
              InputLabelProps: {
                shrink: true,
              },
              placeholder: isVietnam
                ? t('select_district_vn')
                : t('select_district'),
            }}
            autocompleteProps={{
              disabled: !selectedCountry || isValidDistrict,
            }}
            loading={isLoadingDistricts}
            required
          />
        </Box>
      </WrapperDistrict>
    );
  }, [selectedCountry, selectedCity, selectedDistrict, citiesResponse]);

  const renderCountry = useCallback(() => {
    let countries: IOption[] = [];
    if (!isEmpty(countriesResponse?.data || [])) {
      const dataCountries: ICity[] = countriesResponse?.data;
      countries = dataCountries.reduce<IOption[]>(
        (acc: IOption[], s: ICity) => {
          acc.push({ label: s?.name ?? '', value: `${s?.id}` });
          return acc;
        },
        []
      );
    }

    const handleCountries = (event: any, option: IOption | null) => {
      reset({
        ...getValues,
        companyName: getValues(CompanyInformationEnum.companyName),
        companyPhone: getValues(CompanyInformationEnum.companyPhone),
        country: option || '',
        city: '',
        district: '',
      });
      setSelectedCity(null);
      setSelectedDistrict(null);
      setSelectedCountry(option);
    };

    const isEmptyCountry = !getValues(CompanyInformationEnum.country);
    const isShowErrorMsg =
      getValues(CompanyInformationEnum.country) !== undefined;

    const errorMessageCountry = useMemo(() => {
      let error = null;
      if (isEmptyCountry && isShowErrorMsg) {
        error = t('dialog:$field_cannot_be_empty', {
          field: t('country'),
        });
      }
      return error;
    }, [isEmptyCountry]);

    const renderTextField = (params: AutocompleteRenderInputParams) => {
      return (
        <TextField
          {...params}
          label={t('country')}
          placeholder={t('select_country')}
          InputLabelProps={{
            shrink: true,
          }}
          error={isEmptyCountry && isShowErrorMsg}
          helperText={errorMessageCountry}
          variant="outlined"
          required
        />
      );
    };

    return (
      <WrapperCountry>
        <Autocomplete
          options={countries}
          loading={isLoadingCountry}
          onChange={handleCountries}
          value={selectedCountry}
          renderInput={renderTextField}
        />
        <Box sx={{ display: 'flex', alignItems: 'top', mt: 1, gap: 1 }}>
          <InfoOutlinedIcon fontSize="small" sx={{ color: '#6E6B7B' }} />
          <Typography
            sx={{ color: '#6E6B7B', fontSize: '12px', marginLeft: '2px' }}
          >
            {t('pages:register:country_info_text')}
          </Typography>
        </Box>
        <Box sx={{ display: 'none' }}>
          <AutocompleteElement
            options={countries}
            name={CompanyInformationEnum.country}
            label={t('country')}
            loading={isLoadingCountry}
            textFieldProps={{
              placeholder: t('select_country'),
            }}
            required
          />
        </Box>
      </WrapperCountry>
    );
  }, [countriesResponse, selectedCountry]);

  const renderPhoneNumber = useCallback(() => {
    const mobileCountryCode = countriesResponse?.data?.find(
      (language: any) =>
        language.id === Number(getValues(CompanyInformationEnum.country)?.value)
    )?.country_code;

    return (
      <>
        <TextFieldElement
          fullWidth
          id="companyPhone"
          sx={{ mb: 8 }}
          name={CompanyInformationEnum.companyPhone}
          label={t('company_phone_number')}
          placeholder={t('enter_your_company_phone_number')}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: getValues(CompanyInformationEnum.country) ? (
              <InputAdornment position="start">
                +{mobileCountryCode}
              </InputAdornment>
            ) : null,
            inputComponent: TextMask as any,
            onBlur: onBlurPhoneNumber,
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            overwrite: false,
          }}
          disabled={!getValues(CompanyInformationEnum.country)}
        />
      </>
    );
  }, [countriesResponse?.success]);

  return (
    <>
      {renderCountry()}
      {renderPhoneNumber()}
      {renderCity()}
      {renderDistrict()}
    </>
  );
};

export default SelectCity;
