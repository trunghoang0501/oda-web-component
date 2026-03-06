import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Box,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import deepmerge from 'deepmerge';

interface ICustomBackProps {
  onClick?: () => void;
  content: string;
  typographyProps?: any;
  iconProps?: any;
  sx?: SxProps<Theme>;
}

/**
 * @example
 * <CustomBack content="Back" typographyProps={{sx: {backgroundColor: "red"}}}  />
 */
const CustomBack = (props: ICustomBackProps) => {
  const { onClick, content, typographyProps, iconProps, sx } = props;

  const theme = useTheme();

  const sxTypography = deepmerge(
    {
      sx: {
        color: theme.palette.text.primary,
        cursor: 'pointer',
      },
    },
    typographyProps || {}
  );

  const sxIcon = deepmerge(
    {
      sx: {
        color: theme.palette.text.primary,
      },
    },
    iconProps || {}
  );

  const handleClickBack = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Box className="custom-back" onClick={handleClickBack} sx={sx}>
      <Stack direction="row" alignItems="center">
        <ArrowBackIosIcon {...sxIcon} />
        <Typography {...sxTypography}>{content}</Typography>
      </Stack>
    </Box>
  );
};

export default CustomBack;
