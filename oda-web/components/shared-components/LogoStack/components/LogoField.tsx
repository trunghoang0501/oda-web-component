import { Grid, Typography, useTheme } from '@mui/material';
import useMobileDetect from '@/hooks/useMobileDetect';
import { mediaMobileMax } from '@/utils/constants';
import { LogoStackClassEnum } from '../constants';
import { LogoImageStyled } from '../styles';
import { ILogoFieldProps } from '../types';

export const LogoField = ({ url, name, ...restOfProps }: ILogoFieldProps) => {
  const theme = useTheme();
  const mobile = useMobileDetect();
  return (
    <Grid
      container
      className={LogoStackClassEnum.LogoField}
      sx={{
        [mediaMobileMax]: {
          width: 'auto',
        },
      }}
    >
      <Grid
        item
        sx={{
          width: mobile.isMobile() ? theme.spacing(8) : theme.spacing(10),
          height: mobile.isMobile() ? theme.spacing(8) : theme.spacing(10),
          overflow: 'hidden',
        }}
        className={LogoStackClassEnum.LogoImageOuter}
      >
        <LogoImageStyled
          src={url}
          width={mobile.isMobile() ? theme.spacing(8) : theme.spacing(10)}
          height={mobile.isMobile() ? theme.spacing(8) : theme.spacing(10)}
          className={LogoStackClassEnum.LogoImage}
        />
      </Grid>
      {
        /**
         * If title is enabled to show and the condition about total of logo item match, then the title can be shown
         */
        !restOfProps.disableToShowTitle && restOfProps.canBeShownTitle && (
          <Grid
            item
            flex="1 1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: '1 1',
              minWidth: 0,
              marginLeft: theme.spacing(2),
            }}
          >
            <Typography
              className={LogoStackClassEnum.LogoName}
              sx={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: theme.spacing(4),
                lineHeight: theme.spacing(6),
                color: theme.palette.customColors.tableText,
                fontWeight: '600',
              }}
            >
              {name}
            </Typography>
          </Grid>
        )
      }
    </Grid>
  );
};
