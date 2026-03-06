import CloseIcon from '@mui/icons-material/Close';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Popper,
  Stack,
  useTheme,
} from '@mui/material';
import { difference, isEmpty } from 'rambda';
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import usePopperVisibility from '@/hooks/usePopperVisibility';
import { mediaMobileMax } from '@/utils/constants';
import { IPopperFilterButtonProps } from './types';

export const PopperFilterButton = (props: IPopperFilterButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { handlePopperOpen, handlePopperClose } = usePopperVisibility();
  const {
    onClickClearFilterIcon,
    buttonSx,
    filteredCount = 0,
    onOpenPopper,
    onClosePopper,
    popperContent,
    onClickPopperClearButton,
    onClickPopperConfirmButton,
    apiRef,
    dataFilters,
    setDataFilters,
    hideClearFilter = false,
    noClearButton = false,
    onClickPopperSaveAsDefaultButton,
    noShowFilteredCount = false,
    defaultDataFilters,
    showLabel = true,
    hideLabelIfMobile = true,
    triggerShowPopper = false,
    sx = {},
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [openedDataFilters, setOpenedDataFilters] = useState();

  const closePopper = useCallback(() => {
    console.log('🟢 closePopper called');
    console.log('🟢 openPopper before close:', openPopper);
    console.log('🟢 anchorEl before close:', anchorEl);

    onClosePopper?.();
    setAnchorEl(null);
    setOpenPopper(false);

    console.log('🟢 openPopper after close (state set to false)');
    // handlePopperClose();
  }, [onClosePopper, openPopper]);

  const handleClickButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    console.log('🟣 handleClickButton called, openPopper:', openPopper);
    if (openPopper) {
      console.log('🟣 Closing popper from button click');
      closePopper();
      handlePopperClose();
    } else {
      console.log('🟣 Opening popper from button click');
      // Set openedDataFilters BEFORE calling onOpenPopper
      // This ensures we capture the state before any sync happens
      setOpenedDataFilters(dataFilters);
      onOpenPopper?.();
      setAnchorEl(e.currentTarget);
      setOpenPopper(true);

      handlePopperOpen();
    }
  };

  const handleClickAway = () => {
    if (openPopper) {
      setDataFilters?.(openedDataFilters);
      closePopper();
      handlePopperClose();
    }
  };

  const handleClickClearFilter = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    onClickClearFilterIcon?.();
  };

  const noChangeWithDefault = useMemo(() => {
    if (defaultDataFilters && dataFilters) {
      return isEmpty(difference([defaultDataFilters], [dataFilters]));
    }
    return true;
  }, [defaultDataFilters, dataFilters]);

  const noChangeWithOpenedData = useMemo(() => {
    if (openedDataFilters && dataFilters) {
      return isEmpty(difference([openedDataFilters], [dataFilters]));
    }

    return true;
  }, [openedDataFilters, dataFilters]);

  useEffect(() => {
    if (apiRef?.current) {
      apiRef.current = {
        closePopper,
      };
    }
  }, [apiRef, closePopper]);

  useEffect(() => {
    if (triggerShowPopper) {
      // document.getElementById('buttonFilter')?.click();
      setAnchorEl(buttonRef.current);
      buttonRef.current?.click();
    }
  }, [triggerShowPopper]);
  useEffect(() => {
    console.log('🟡 openPopper state changed:', openPopper);
    console.log('🟡 anchorEl:', anchorEl);
    if (openPopper) {
      document.body.classList.add('disable-scroll-mobile');
    } else {
      document.body.classList.remove('disable-scroll-mobile');
    }
  }, [openPopper, anchorEl]);

  const handleCancel = () => {
    onClickPopperClearButton?.();
    closePopper();
    handlePopperClose();
  };
  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <Box>
        <Button
          id="buttonFilter"
          variant="outlined"
          color={filteredCount > 0 ? undefined : 'secondary'}
          sx={{
            px: 4,
            ...buttonSx,
            [mediaMobileMax]: {
              p: filteredCount > 0 || !hideLabelIfMobile ? 2 : 0,
              minWidth: hideLabelIfMobile
                ? theme.spacing(10)
                : theme.spacing(15),
              minHeight: theme.spacing(7),
              py: 1,
            },
          }}
          ref={buttonRef}
          onClick={handleClickButton}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <FilterListOutlinedIcon />
            <Box
              sx={{
                display: showLabel ? 'block' : 'none',
                [mediaMobileMax]: {
                  display: hideLabelIfMobile ? 'none' : 'block',
                },
              }}
              className="textFilter"
            >
              {t('filter')}
            </Box>

            {!noShowFilteredCount && filteredCount > 0 && (
              <>
                <Avatar
                  sx={{
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: theme.spacing(3),
                    fontWeight: 500,
                  }}
                >
                  {filteredCount}
                </Avatar>

                {!hideClearFilter && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={handleClickClearFilter}
                  >
                    <CloseIcon
                      sx={{
                        fontSize: theme.spacing(6),
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Stack>
        </Button>
        <Popper
          id="popper-filter"
          anchorEl={anchorEl}
          open={openPopper}
          placement="bottom-start"
          sx={{
            py: 4,
            zIndex: theme.zIndex.modal,
            pointerEvents: openPopper ? 'auto' : 'none',
            [mediaMobileMax]: {
              position: 'fixed !important',
              transform: 'none !important',
              bottom: '0 !important',
              top: '0 !important',
              left: '0 !important',
              right: '0 !important',
              display: openPopper ? 'flex' : 'none',
              alignItems: 'end',
              marginBottom: '90px !important',
              '& .popperFilterButton': {
                maxHeight: '65vh',
              },
            },
            ...sx,
          }}
        >
          <Box
            sx={{
              [mediaMobileMax]: {
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'stretch',
                flexDirection: 'column',
                pointerEvents: openPopper ? 'auto' : 'none',
              },
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'none',
                [mediaMobileMax]: {
                  display: openPopper ? 'block' : 'none',
                  pointerEvents: openPopper ? 'auto' : 'none',
                },
              }}
              onClick={() => {
                if (openPopper) {
                  handleClickAway();
                }
              }}
            />
            <Box
              className="popperFilterButton"
              sx={{
                width: theme.spacing(130),
                borderRadius: theme.spacing(1),
                bgcolor: theme.palette.common.white,
                p: 4,
                boxShadow:
                  '0px 2px 2px -3px rgba(58, 53, 65, 0.1),0px 2px 3px 1px rgba(58, 53, 65, 0.1),0px 3px 2px 2px rgba(58, 53, 65, 0.1)',
                [mediaMobileMax]: {
                  width: `calc(100vw - ${theme.spacing(8)})`,
                  ml: theme.spacing(4),
                  overflowY: 'auto',
                },
              }}
            >
              {popperContent}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mt={4}
              >
                {onClickPopperSaveAsDefaultButton && (
                  <Button
                    color="primary"
                    variant="text"
                    onClick={onClickPopperSaveAsDefaultButton}
                    disabled={noChangeWithDefault}
                    sx={{ p: 2 }}
                  >
                    {t('dashboard_page.save_as_default')}
                  </Button>
                )}
                <Stack
                  direction="row"
                  gap={4}
                  justifyContent="flex-end"
                  flex={1}
                >
                  {noClearButton ? (
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={handleCancel}
                    >
                      {t('cancel')}
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={onClickPopperClearButton}
                      disabled={noChangeWithDefault}
                    >
                      {t('clear')}
                    </Button>
                  )}

                  <Button
                    color="primary"
                    variant="contained"
                    onClick={onClickPopperConfirmButton}
                    disabled={noChangeWithOpenedData}
                  >
                    {t('apply')}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
