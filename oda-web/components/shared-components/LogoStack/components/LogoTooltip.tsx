import { Box, Grid, Typography, useTheme } from '@mui/material';
import { LogoStackClassEnum } from '../constants';
import { LogoImageStyled } from '../styles';
import { ILogoTooltipProps } from '../types';

export const LogoTooltip = ({
  value,
  renderTooltipProps = {},
  renderLogoFieldInTooltipProps = {},
  renderLogoListInTooltipProps = {},
}: ILogoTooltipProps) => {
  const theme = useTheme();

  const logoList = value.map((item, index) => (
    <Grid
      container
      key={index}
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: theme.spacing(4),

        '&:first-of-type': {
          marginTop: theme.spacing(2),
        },
        '&:last-of-type': {
          marginBottom: theme.spacing(2),
        },
        ...renderLogoFieldInTooltipProps.sx,
      }}
    >
      <Grid
        item
        sx={{
          width: theme.spacing(6),
          height: theme.spacing(6),
          overflow: 'hidden',
        }}
      >
        <LogoImageStyled
          src={item.url}
          width="24"
          height="24"
          className={LogoStackClassEnum.LogoImage}
        />
      </Grid>
      {!renderLogoFieldInTooltipProps.disableToShowTitle && (
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
              fontSize: theme.spacing(3.5),
              lineHeight: theme.spacing(5),
              color: theme.palette.text.primary,
              fontWeight: '400',
            }}
          >
            {item.name}
          </Typography>
        </Grid>
      )}
    </Grid>
  ));

  return (
    <>
      {logoList.length > 0 && (
        <Box
          className={LogoStackClassEnum.LogoTooltip}
          sx={{
            backgroundColor: theme.palette.common.white,
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
            margin: `-${theme.spacing(2)}`,
            overflow: 'hidden',
            borderRadius: theme.spacing(1),
            maxWidth: theme.spacing(77),
          }}
        >
          {!renderTooltipProps.disableToShowHeader && (
            <Box
              className={LogoStackClassEnum.LogoTooltipHeader}
              sx={{
                padding: theme.spacing(2),
                paddingBottom: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: theme.spacing(3.5),
                  lineHeight: theme.spacing(5),
                  color: theme.palette.text.primary,
                  fontWeight: '600',
                }}
              >
                {renderTooltipProps.title}
              </Typography>
            </Box>
          )}
          <Box
            className={LogoStackClassEnum.LogoTooltipBody}
            sx={{
              paddingX: theme.spacing(2),
              maxHeight: theme.spacing(52.5),
              overflow: 'auto',
              ...renderLogoListInTooltipProps.sx,
            }}
          >
            {logoList}
          </Box>
        </Box>
      )}
    </>
  );
};
