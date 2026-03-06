import { DeleteOutline } from '@mui/icons-material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ModeEditOutlineOutlined from '@mui/icons-material/ModeEditOutlineOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TypeAction } from '@/types';

interface IListActionsButtonProps {
  onClick?: (type?: TypeAction) => void;
  showEditButton?: boolean;
  showRemoveButton?: boolean;
  showApproveButton?: boolean;
  showRejectButton?: boolean;
  showDeleteButton?: boolean;
  sx?: SxProps<Theme>;
}

const ListActionsButton = (props: IListActionsButtonProps) => {
  const {
    onClick,
    showEditButton = true,
    showRemoveButton = false,
    showApproveButton = false,
    showRejectButton = false,
    showDeleteButton = false,
    sx,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [t] = useTranslation();
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

  const handleEdit = async () => {
    handleClose();
    onClick?.(TypeAction.Edit);
  };

  const handleRemove = async () => {
    handleClose();
    onClick?.(TypeAction.Remove);
  };

  const handleApproval = async () => {
    onClick?.(TypeAction.Approve);
    handleClose();
  };

  const handleReject = () => {
    onClick?.(TypeAction.Rejected);
    handleClose();
  };

  return (
    <>
      <IconButton
        sx={{ color: theme.palette.customColors.summaryTitleColor }}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={sx}>
        {showEditButton && (
          <MenuItem onClick={handleEdit}>
            <ModeEditOutlineOutlined
              fontSize="medium"
              color={theme.palette.text.primary as any}
            />
            <Typography sx={{ fontWeight: 400, ml: 2 }} color="text.primary">
              {t('edit')}
            </Typography>
          </MenuItem>
        )}
        {showRemoveButton && (
          <MenuItem onClick={handleRemove}>
            <DeleteOutline fontSize="medium" color="secondary" />
            <Typography sx={{ fontWeight: 400, ml: 2 }} color="secondary">
              {t('remove')}
            </Typography>
          </MenuItem>
        )}

        {showApproveButton && (
          <MenuItem onClick={handleApproval}>
            <CheckOutlinedIcon fontSize="medium" color="success" />
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
        )}

        {showRejectButton && (
          <MenuItem onClick={handleReject}>
            <CloseOutlinedIcon fontSize="medium" color="error" />
            <Typography sx={{ fontWeight: 400, ml: 2 }} color="error">
              {t('reject')}
            </Typography>
          </MenuItem>
        )}

        {showDeleteButton && (
          <MenuItem onClick={handleRemove}>
            <DeleteOutline fontSize="medium" color="error" />
            <Typography sx={{ fontWeight: 400, ml: 2 }} color="error">
              {t('delete')}
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ListActionsButton;
