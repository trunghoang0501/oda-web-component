import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FilterOptionsState,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { HTMLAttributes, SyntheticEvent, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AUTOCOMPLETE_OPTION_CUSTOMIZE_FAKE_ID } from '@/constants';
import { formatPhoneNumberToString } from '@/utils';
import { getFirstFieldErrorMessage } from '@/utils/form';
import { convertToPhone } from '@/utils/phone';
import {
  IShipperContactForm,
  IShipperItem,
  ShipperContactFieldsEnum,
} from '../types';

const filter = createFilterOptions<IShipperItem>();

export interface IShipperNameSelectProps {
  shipperList: IShipperItem[];
}

export const ShipperNameSelect = (props: IShipperNameSelectProps) => {
  const { t } = useTranslation();
  const { shipperList } = props;
  const formContext = useFormContext<IShipperContactForm>();
  const { field, fieldState } = useController({
    control: formContext.control,
    name: ShipperContactFieldsEnum.Shipper,
  });
  const errorMessage = getFirstFieldErrorMessage(fieldState.error);

  const renderOption = (
    optionProps: HTMLAttributes<HTMLLIElement>,
    option: IShipperItem
  ) => {
    return (
      <li key={option.id} {...optionProps}>
        {option.id === AUTOCOMPLETE_OPTION_CUSTOMIZE_FAKE_ID
          ? `${t('add')} "${option.name}"`
          : option.name}
      </li>
    );
  };

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => {
      return (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            maxLength: 255,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errorMessage}
          helperText={errorMessage}
          placeholder={t('select_shipper_name')}
          label={t('shipper_name')}
        />
      );
    },
    [errorMessage]
  );

  const filterOptions = (
    options: IShipperItem[],
    params: FilterOptionsState<IShipperItem>
  ) => {
    let filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some((option) => inputValue === option.name);
    if (inputValue !== '' && !isExisting) {
      filtered = [
        {
          // NOTE: this is fake item for customize option
          id: AUTOCOMPLETE_OPTION_CUSTOMIZE_FAKE_ID,
          name: inputValue,
          phone: '',
        },
        ...filtered,
      ];
    }
    return filtered;
  };

  const handleChange = (
    e: SyntheticEvent<Element, Event>,
    value: IShipperItem | null
  ) => {
    field.onChange(value);

    if (value?.id === AUTOCOMPLETE_OPTION_CUSTOMIZE_FAKE_ID || !value?.phone) {
      return;
    }

    formContext.setValue(
      ShipperContactFieldsEnum.Phone,
      convertToPhone(formatPhoneNumberToString(value.phone))
    );
  };

  return (
    <Autocomplete
      options={shipperList}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }

        return option.name;
      }}
      isOptionEqualToValue={(option, value) => {
        return option.id === value.id;
      }}
      onBlur={() => {
        field.onBlur();
      }}
      onChange={handleChange}
      value={field.value}
      filterOptions={filterOptions}
      renderInput={renderInput}
      renderOption={renderOption}
    />
  );
};
