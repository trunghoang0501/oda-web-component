import {
  Stack,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from '@mui/material';
import { mediaMobileMax } from '@/utils/constants';
import { LogoStackClassEnum } from './constants';

export const LogoImageStyled = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  height: '100%',
  width: '100%',
  borderRadius: theme.spacing(1.5),
}));

export const LogoStackStyled = styled(Stack)(({ theme }) => ({
  [`&.${LogoStackClassEnum.IsMultipleLogo}`]: {
    [`.${LogoStackClassEnum.LogoField}:nth-of-type(n+2)`]: {
      marginLeft: `-${theme.spacing(2.5)}`,
    },

    [`.${LogoStackClassEnum.LogoImage}`]: {
      border: `1.5px solid ${theme.palette.customColors.tableBorder}`,
      backgroundColor: theme.palette.common.white,
    },
  },
  [`.${LogoStackClassEnum.LogoImageOuter}`]: {
    alignSelf: 'center',
  },
  [`.${LogoStackClassEnum.LogoName}`]: {
    fontSize: theme.spacing(4),
    lineHeight: theme.spacing(6),
    fontWeight: '600',
    color: theme.palette.customColors.tableText,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: theme.spacing(11.5),
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    display: `-webkit-box`,
    whiteSpace: 'initial',
  },
}));

export const LogoShowMoreItemStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '40px 0 0',
  width: theme.spacing(10),
  height: theme.spacing(10),
  [mediaMobileMax]: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  border: `1.5px solid ${theme.palette.customColors.tableBorder}`,
  fontSize: theme.spacing(3.5),
  fontWeight: '400',
  color: theme.palette.customColors.tableText,
  backgroundColor: theme.palette.customColors.greyBgColor,
  borderRadius: theme.spacing(1.5),
  marginLeft: `-${theme.spacing(2.5)}`,
}));

export const HtmlTooltipStyled = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} placement="top" arrow />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    fontSize: theme.spacing(3),
    padding: theme.spacing(2),
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    '&::before': {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}));
