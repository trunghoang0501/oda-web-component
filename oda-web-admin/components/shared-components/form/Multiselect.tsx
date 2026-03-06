import { equals } from 'rambda';
import React, { memo } from 'react';
import { AutocompleteRenderGetTagProps, Chip } from '@mui/material';
import { AutocompleteElement, FieldValues } from 'react-hook-form-mui';
import { Path } from 'react-hook-form';
import styled from '@mui/styles/styled';
import { IOption } from '../../../containers/company/company-list/components/CompanyListFilter';

const MultiselectStyled = styled('div')(({ theme }: any) => ({
  '& .MuiAutocomplete-input::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  '& .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-option': {
      padding: `${theme.spacing(0.75)} ${theme.spacing(1.75)}`,
    },
    '.MuiCheckbox-root': {
      marginRight: 0,
      paddingRight: theme.spacing(2.75),
    },
    '.MuiSvgIcon-root': {
      color: theme.palette.text.primary,
    },
  },
  '& .MuiAutocomplete-root': {
    '& .MuiInputBase-formControl': {
      minHeight: theme.spacing(10),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(3),

      '& .MuiInputBase-input': {
        height: theme.spacing(6),
        padding: 0,
      },
      '& .MuiChip-root': {
        height: theme.spacing(6),
        margin: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} 0`,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2.5),
        borderColor: theme.palette.text.secondary,
      },
      '& .MuiChip-avatar': {
        width: theme.spacing(4),
        height: theme.spacing(4),
        paddingRight: theme.spacing(1),
      },
      '& .MuiChip-label': {
        fontSize: theme.spacing(3),
        lineHeight: theme.spacing(4),
        paddingLeft: 0,
      },
      '& .MuiChip-deleteIcon': {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
      },
    },
  },
}));

const MultiselectComponent = ({
  name,
  options,
  placeholder,
}: {
  name: Path<FieldValues>;
  options: IOption[];
  placeholder: string;
}) => {
  const renderTags = (
    values: any[],
    getTagProps: AutocompleteRenderGetTagProps
  ) => {
    return values.map((option: any, index: any) => (
      <Chip
        {...getTagProps({ index })}
        key={`${option?.id} + ${option?.label}`}
        label={option?.label}
      />
    ));
  };

  return (
    <MultiselectStyled>
      <AutocompleteElement
        name={name}
        multiple
        options={options}
        textFieldProps={{
          InputLabelProps: {
            shrink: true,
          },
          placeholder,
        }}
        autocompleteProps={{
          noOptionsText: '',
          limitTags: 2,
          sx: {
            '.MuiOutlinedInput-root': { padding: 1 },
          },
          getOptionLabel: (option) => option?.label,
          disableListWrap: true,
          disabledItemsFocusable: true,
          disablePortal: true,
          isOptionEqualToValue: (option, value) => option?.id === value?.id,
          renderTags,
        }}
        showCheckbox
      />
    </MultiselectStyled>
  );
};

export const Multiselect = memo(MultiselectComponent, equals);
