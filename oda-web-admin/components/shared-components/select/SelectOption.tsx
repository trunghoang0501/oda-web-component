import {
  AutocompleteRenderOptionState,
  Box,
  Checkbox,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { HTMLAttributes } from 'react';

interface ISelectOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: {
    id: string;
    text: string;
  };
  state: AutocompleteRenderOptionState;
  sx?: SxProps<Theme>;
}

const SelectOption = ({ props, option, state, sx }: ISelectOptionProps) => {
  const theme = useTheme();

  return (
    <Box
      component="li"
      {...{ ...props, key: option?.id }}
      sx={{
        p: '0 !important',
        ...sx,
      }}
    >
      <Checkbox
        checked={state.selected}
        sx={{
          padding: 0,
          py: 3.75,
          pl: 5,
          pr: 3,
          '& .MuiSvgIcon-root': {
            color: theme.palette.text.primary,
          },
          '&.Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main,
          },
        }}
        disableRipple
      />
      <Typography>{option.text}</Typography>
    </Box>
  );
};

export default SelectOption;
