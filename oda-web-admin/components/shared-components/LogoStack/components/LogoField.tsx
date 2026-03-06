import { Grid, Typography, useTheme } from '@mui/material';
import { ILogoFieldProps } from '../types';
import { LogoStackClassEnum } from '../constants';
import { LogoImageStyled } from '../styles';

export const LogoField = ({ url, name, ...restOfProps }: ILogoFieldProps) => {
  const theme = useTheme();

  return (
    <Grid container className={LogoStackClassEnum.LogoField}>
      <Grid
        item
        sx={{
          width: '40px',
          height: '40px',
          overflow: 'hidden',
        }}
        className={LogoStackClassEnum.LogoImageOuter}
      >
        <LogoImageStyled
          src={url}
          width="40"
          height="40"
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
