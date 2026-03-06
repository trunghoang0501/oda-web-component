import { Box, Typography, TypographyProps, styled } from '@mui/material';

export const TitleModalStyled = styled(Typography)(({ theme }) => ({
  fontSize: theme.spacing(8.5),
  fontWeight: 500,
  textAlign: 'center',
}));

export const ContentModalStyled = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: theme.spacing(4.25),
    fontWeight: 600,
    marginTop: theme.spacing(12),
    width: '100%',
    textAlign: 'center',
  })
);

export const SalePurchaseConfirmModalWrapperStyled = styled(Box)(
  ({ theme }) => ({
    padding: theme.spacing(8),
  })
);
