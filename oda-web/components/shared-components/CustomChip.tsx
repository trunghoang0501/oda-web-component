import { Chip, ChipProps, SxProps, Theme, useTheme } from '@mui/material';
import { CSSProperties } from 'styled-components';
import { hexToRGBA } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';

export type TCustomChipType = 'error' | 'success' | 'info';
interface ICustomChipProps extends ChipProps {
  label: string;
  type?: TCustomChipType;
  labelStyle?: CSSProperties;
}
const CustomChip = ({ label, sx, labelStyle, ...props }: ICustomChipProps) => {
  const theme = useTheme();

  const sxChip: SxProps<Theme> = (() => {
    const sxInitial: SxProps<Theme> = {
      height: 'unset',
      fontWeight: 600,
      fontSize: theme.spacing(4),
      minWidth: theme.spacing(22),
      [mediaMobileMax]: {
        minWidth: 0,
      },
      '& .MuiChip-label': {
        px: 2,
        ...labelStyle,
      },
    };

    switch (props.type) {
      case 'error':
        sxInitial.color = theme.palette.error.main;
        sxInitial.backgroundColor = hexToRGBA(theme.palette.error.main, 0.12);
        break;

      case 'success':
        sxInitial.color = theme.palette.success.main;
        sxInitial.backgroundColor = hexToRGBA(theme.palette.success.main, 0.12);
        break;

      case 'info':
        sxInitial.color = theme.palette.customColors.colorCyan;
        sxInitial.backgroundColor = hexToRGBA(
          theme.palette.customColors.colorCyan,
          0.12
        );
        break;
      default:
        break;
    }

    return { ...sxInitial, ...sx };
  })();

  return <Chip label={label} {...props} sx={sxChip} />;
};

export default CustomChip;
