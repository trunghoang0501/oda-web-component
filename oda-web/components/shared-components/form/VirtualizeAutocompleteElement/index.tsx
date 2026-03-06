import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteProps as AutocompleteElementProps,
  AutocompleteRenderInputParams,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { ReactNode, SyntheticEvent, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Listbox from './components/Listbox';
import { VirtualizeAutocompleteElementContext } from './useVirtualizeAutocompleteElementContext';

type AutocompleteProps = AutocompleteElementProps<
  any,
  boolean,
  boolean,
  boolean
>;

interface IVirtualizeAutocompleteElementProps
  extends Omit<AutocompleteProps, 'ListboxComponent' | 'renderInput'> {
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
  textFieldProps?: TextFieldProps;
  name?: string;
  showCheckbox?: boolean;
  matchId?: boolean;
  label?: ReactNode;
  lazyLoadProps?: {
    isLoadingMore: boolean;
    isFetching: boolean;
    onFetchMore: () => void;
  };
}

export const VirtualizeAutocompleteElement = (
  props: IVirtualizeAutocompleteElementProps
) => {
  const {
    options,
    placeholder,
    textFieldProps,
    name = '',
    lazyLoadProps,
    showCheckbox = false,
    matchId = false,
    label,
    renderOption,
    onChange,
    getOptionLabel,
    multiple,
    ...restProps
  } = props;

  const { control } = useFormContext();

  const {
    field: { onChange: onChangeField, value: formValue },
  } = useController({
    name,
    control,
  });

  const handleChange = (
    _event: SyntheticEvent<Element, Event>,
    _value: any,
    _reason: AutocompleteChangeReason
  ) => {
    onChange?.(_event, _value, _reason);

    let newFormValue = _value;
    if (_value) {
      if (matchId) {
        newFormValue = multiple
          ? _value?.map((val: any) => val.id)
          : _value?.id;
      }
    } else {
      newFormValue = multiple ? [] : null;
    }

    onChangeField(newFormValue);
  };

  const renderInputElement = (params: AutocompleteRenderInputParams) => (
    <TextField
      placeholder={placeholder}
      label={label}
      {...params}
      {...textFieldProps}
      InputLabelProps={{
        shrink: true,
        ...params.InputLabelProps,
        ...textFieldProps?.InputLabelProps,
      }}
      InputProps={{
        ...params.InputProps,
        ...textFieldProps?.InputProps,
      }}
      inputProps={{
        ...params.inputProps,
        ...textFieldProps?.inputProps,
      }}
      error={textFieldProps?.error}
      helperText={textFieldProps?.helperText}
    />
  );

  const contextValues = useMemo(
    () => ({
      isLoadingMore: !!lazyLoadProps?.isLoadingMore,
      isFetching: !!lazyLoadProps?.isFetching,
      onFetchMore: lazyLoadProps?.onFetchMore,
    }),
    [lazyLoadProps]
  );

  const value = useMemo(() => {
    if (matchId) {
      return multiple
        ? formValue.map((val: number) =>
            options.find((option) => option.id === val)
          ) || []
        : options.find((option) => option.id === formValue) || null;
    }

    return formValue;
  }, [formValue]);

  return (
    <VirtualizeAutocompleteElementContext.Provider value={contextValues}>
      <Autocomplete
        options={options}
        ListboxComponent={Listbox}
        disableListWrap
        disabledItemsFocusable
        disablePortal
        renderOption={(optionProps, option, state) =>
          [
            optionProps,
            option,
            renderOption,
            showCheckbox,
            state,
            getOptionLabel,
          ] as React.ReactNode
        }
        renderInput={renderInputElement}
        onChange={handleChange}
        value={value}
        disableCloseOnSelect={multiple}
        getOptionLabel={getOptionLabel}
        multiple={multiple}
        {...restProps}
      />
    </VirtualizeAutocompleteElementContext.Provider>
  );
};
