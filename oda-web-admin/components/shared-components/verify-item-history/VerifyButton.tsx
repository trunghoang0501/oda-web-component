import React, { useCallback } from 'react';
import { TypeAction } from '@/types';
import { Menu, MenuItem, styled, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Verified from '@mui/icons-material/Verified';
import { hexToRGBA } from '@/utils';
import { ArrowDropDownOutlined, ReportRounded } from '@mui/icons-material';
import { VerifiedEnum } from '@/constants';

const ButtonStyled = styled(Button)(({ theme }: any) => ({
  color: theme.palette.text.secondary,
  backgroundColor: hexToRGBA(theme.palette.customColors.tableText, 0.2),
  width: theme.spacing(39),
  padding: theme.spacing(0.5, 3),
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: hexToRGBA(theme.palette.customColors.tableText, 0.2),
  },
  '.MuiSvgIcon-root': {
    fontSize: `${theme.spacing(4)} !important`,
  },
  '.MuiButton-startIcon': {
    color: theme.palette.text.secondary,
  },
  '.MuiButton-endIcon': {
    color: theme.palette.text.secondary,
  },
  '.MuiButton-text': {
    flex: 1,
    textAlign: 'left',
    marginLeft: theme.spacing(2),
  },
}));

const VerifyButtonStyled = styled(ButtonStyled)(({ theme }: any) => ({
  color: theme.palette.success.main,
  backgroundColor: hexToRGBA(theme.palette.success.main, 0.2),
  '&:hover': {
    backgroundColor: hexToRGBA(theme.palette.success.main, 0.2),
  },
  '& .MuiButton-startIcon': {
    color: theme.palette.success.main,
  },
}));

const RejectButtonStyled = styled(ButtonStyled)(({ theme }: any) => ({
  color: theme.palette.error.main,
  backgroundColor: hexToRGBA(theme.palette.error.main, 0.2),
  '&:hover': {
    backgroundColor: hexToRGBA(theme.palette.error.main, 0.2),
  },
  '& .MuiButton-startIcon': {
    color: theme.palette.error.main,
  },
}));

interface IVerifyButtonProps {
  onChange?: (status: TypeAction) => void;
  verified: VerifiedEnum;
}

const VerifyButton = ({ onChange, verified }: IVerifyButtonProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const theme = useTheme();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApproval = useCallback(async () => {
    onChange?.(TypeAction.Approve);
    handleClose();
  }, [onChange]);

  const handleReject = useCallback(() => {
    onChange?.(TypeAction.Rejected);
    handleClose();
  }, [onChange]);

  const renderButton = () => {
    switch (verified) {
      case VerifiedEnum.Verified:
        return (
          <VerifyButtonStyled
            variant="contained"
            startIcon={<Verified />}
            endIcon={<ArrowDropDownOutlined />}
            onClick={handleClick}
          >
            <div className="MuiButton-text">{t('approve')}</div>
          </VerifyButtonStyled>
        );
      case VerifiedEnum.Reject:
        return (
          <RejectButtonStyled
            variant="contained"
            startIcon={<ReportRounded />}
            endIcon={<ArrowDropDownOutlined />}
            onClick={handleClick}
          >
            <div className="MuiButton-text">{t('reject')}</div>
          </RejectButtonStyled>
        );
      default:
        return (
          <ButtonStyled
            variant="contained"
            startIcon={<ReportRounded />}
            endIcon={<ArrowDropDownOutlined />}
            onClick={handleClick}
          >
            <div className="MuiButton-text">{t('unverified')}</div>
          </ButtonStyled>
        );
    }
  };

  return (
    <>
      {renderButton()}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: theme.spacing(39),
            '.MuiButtonBase-root': { py: 3 },
          },
        }}
      >
        <MenuItem onClick={handleApproval}>
          <Verified fontSize="medium" color="success" />
          <Typography
            sx={{
              fontWeight: 400,
              ml: 2,
              color: theme.palette.success.light,
            }}
          >
            {t('approve')}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleReject}>
          <ReportRounded fontSize="medium" color="error" />
          <Typography sx={{ fontWeight: 400, ml: 2 }} color="error">
            {t('reject')}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default VerifyButton;
