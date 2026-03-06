import {
  FormControl,
  FormControlProps,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';
import deepmerge from 'deepmerge';
import { ReactNode } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ISelectOption } from 'src/types';
import { MenuItemStyled } from './styles';

interface IMySelectElementProps extends SelectProps {
  options: ISelectOption[];
  variant?: FormControlProps['variant'];
  label?: string;
  firstOption?: ReactNode;
}

const MySelectElement = (props: IMySelectElementProps) => {
  const {
    name = '',
    options,
    variant = 'outlined',
    label = '',
    sx = {},
    firstOption,
    ...restProps
  } = props;

  const { t } = useTranslation();

  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  return (
    <FormControl variant={variant} fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
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
          {
            '& .MuiSelect-select': { py: 2 },
            textAlign: 'start',
          },
          sx
        )}
        {...field}
        {...restProps}
      >
        {firstOption}
        {options.map((option) => (
          <MenuItemStyled key={option.id} value={option.id}>
            {t(option.label)}
          </MenuItemStyled>
        ))}
      </Select>
    </FormControl>
  );
};

export default MySelectElement;
