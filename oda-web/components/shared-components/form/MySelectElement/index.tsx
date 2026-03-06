import {
  FormControl,
  FormControlProps,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';
import deepmerge from 'deepmerge';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { ISelectOption } from '@/types';
import { mediaMobileMax } from '@/utils/constants';
import { MenuItemStyled } from './styles';

interface IMySelectElementProps extends SelectProps<number> {
  options: ISelectOption[];
  variant?: FormControlProps['variant'];
  label?: React.ReactNode;
}

const MySelectElement = (props: IMySelectElementProps) => {
  const {
    name = '',
    options,
    variant = 'outlined',
    label = '',
    sx = {},
    ...restProps
  } = props;
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  return (
    <FormControl
      variant={variant}
      sx={{
        [mediaMobileMax]: {
          width: '100%',
        },
      }}
    >
      {label && <InputLabel shrink>{label}</InputLabel>}
      <Select
        fullWidth
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.5,
            },
          },
        }}
        label={label}
        sx={deepmerge<SelectProps['sx']>(
          { '& .MuiSelect-select': { py: 2 }, textAlign: 'start' },
          sx
        )}
        {...field}
        {...restProps}
      >
        {options.map((option) => (
          <MenuItemStyled
            key={option.id}
            value={option.id}
            disabled={option?.isDisabled}
          >
            {option.label}
          </MenuItemStyled>
        ))}
      </Select>
    </FormControl>
  );
};

export default MySelectElement;
