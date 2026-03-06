import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {
  Box,
  ClickAwayListener,
  Popper,
  Tab,
  Tabs,
  TextField,
  useTheme,
} from '@mui/material';
import clsx from 'clsx';
import deepmerge from 'deepmerge';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabPanel from '@/components/shared-components/tab/TabPanel';
import { DEFAULT_MINUTE_STEP_IN_DATE_PICKER } from '@/constants';
import { TIME_MODE_LIST } from '@/constants/date';
import {
  convertTimeTextToHourAndMinute,
  formatNumberWithLeadingZero,
  hexToRGBA,
} from '@/utils';
import { mediaMobileMax } from '@/utils/constants';
import { TimeModeEnum } from '../MyDateTimePicker/constants';
import {
  IMyTimeRangePickerProps,
  MY_TIME_RANGE_PICKER_TYPE,
  TabEnum,
} from './types';
import { getHourList, getMinuteList } from './utils';

const TAB_HEADER_HEIGHT = 48;

export const MyTimeRangePicker = (props: IMyTimeRangePickerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    value: propValue,
    onChange,
    disabled = false,
    minuteStep = DEFAULT_MINUTE_STEP_IN_DATE_PICKER,
    timeRangeList = [],
    boxWrapperProps = {},
    textFieldProps = {},
  } = props;
  const [tabActive, setTabActive] = useState<TabEnum>(TabEnum.TimeRange);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [rangeTimeValue, setRangeTimeValue] = useState<number | null>(null);
  const [hourValue, setHourValue] = useState<number | null>(1);
  const [minuteValue, setMinuteValue] = useState<number | null>(0);
  const [timeMode, setTimeMode] = useState<TimeModeEnum | null>(null);
  const rangeTimeWrapperRef = useRef<HTMLDivElement>(null);
  const hoursBoxRef = useRef<HTMLDivElement>(null);
  const minutesBoxRef = useRef<HTMLDivElement>(null);
  const isOpenPopper = Boolean(anchorEl);
  const tabList = useMemo(
    () => [
      {
        id: TabEnum.TimeRange,
        name: t('time_range'),
      },
      {
        id: TabEnum.ExactTime,
        name: t('exact_time'),
      },
    ],
    []
  );
  const hourList = useMemo(() => getHourList(), []);
  const minuteList = useMemo(() => getMinuteList(minuteStep), [minuteStep]);

  // update new value to state if prop value change
  useEffect(() => {
    if (isOpenPopper) {
      return;
    }

    if (!propValue) {
      setRangeTimeValue(null);
      setHourValue(null);
      setMinuteValue(null);
      setTimeMode(null);
      return;
    }

    if (propValue.type === MY_TIME_RANGE_PICKER_TYPE.TimeRange) {
      setRangeTimeValue(propValue.value);
      setTabActive(TabEnum.TimeRange);
      setHourValue(null);
      setMinuteValue(null);
      setTimeMode(null);
      return;
    }

    if (propValue.type === MY_TIME_RANGE_PICKER_TYPE.ExactTime) {
      const splitTime = propValue.value.split(':');

      // update new hour / time mode
      const newHourValue = Number(splitTime[0]);
      if (newHourValue <= 12) {
        setHourValue(newHourValue);
        setTimeMode(TimeModeEnum.AM);
      } else {
        setHourValue(newHourValue - 12);
        setTimeMode(TimeModeEnum.PM);
      }

      setMinuteValue(Number(splitTime[1]));
      setRangeTimeValue(null);
      setTabActive(TabEnum.ExactTime);
    }
  }, [propValue, isOpenPopper]);

  // scroll view to active hour/minute value
  useEffect(() => {
    if (!isOpenPopper) {
      return;
    }

    if (tabActive === TabEnum.TimeRange) {
      setTimeout(() => {
        const timeActiveEle = rangeTimeWrapperRef.current?.querySelector(
          '.is-active'
        ) as HTMLDivElement;

        if (rangeTimeWrapperRef.current && timeActiveEle) {
          rangeTimeWrapperRef.current?.scrollTo({
            top: timeActiveEle.offsetTop - TAB_HEADER_HEIGHT,
          });
        }
      }, 100);
    } else if (tabActive === TabEnum.ExactTime) {
      setTimeout(() => {
        const timeActive = hoursBoxRef.current?.querySelector(
          '.is-active'
        ) as HTMLDivElement;
        if (hoursBoxRef.current && timeActive) {
          hoursBoxRef.current?.scrollTo({
            top: timeActive.offsetTop,
          });
        }

        const timeActiveEle = minutesBoxRef.current?.querySelector(
          '.is-active'
        ) as HTMLDivElement;
        if (minutesBoxRef.current && timeActiveEle) {
          minutesBoxRef.current?.scrollTo({
            top: timeActiveEle.offsetTop,
          });
        }
      }, 100);
    }
  }, [isOpenPopper, tabActive]);

  const isEnableSubmit = (() => {
    if (tabActive === TabEnum.TimeRange) {
      return !!rangeTimeValue;
    }

    return (
      typeof hourValue === 'number' &&
      typeof minuteValue === 'number' &&
      timeMode
    );
  })();

  const textFieldValue: string = (() => {
    if (propValue?.type === MY_TIME_RANGE_PICKER_TYPE.TimeRange) {
      return (
        timeRangeList.find((item) => item.id === propValue.value)?.name ?? ''
      );
    }

    if (propValue?.type === MY_TIME_RANGE_PICKER_TYPE.ExactTime) {
      return convertTimeTextToHourAndMinute(propValue.value);
    }

    return '';
  })();

  const sxPropValue = deepmerge.all([
    {
      cursor: 'pointer',
      '.MuiOutlinedInput-notchedOutline': {
        cursor: 'pointer',
      },
    },
    textFieldProps?.sx ?? {},
  ]);

  const closePopper = () => {
    setAnchorEl(null);
  };

  const openPopper = (event: SyntheticEvent<HTMLDivElement>) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCancel = () => {
    closePopper();
  };

  const handleSubmit = () => {
    if (tabActive === TabEnum.TimeRange && typeof rangeTimeValue === 'number') {
      onChange({
        type: MY_TIME_RANGE_PICKER_TYPE.TimeRange,
        value: rangeTimeValue,
      });
    }

    if (
      tabActive === TabEnum.ExactTime &&
      typeof hourValue === 'number' &&
      typeof minuteValue === 'number' &&
      timeMode
    ) {
      const hourText: string = (() => {
        if (hourValue === 12) {
          if (timeMode === TimeModeEnum.AM) {
            return '00';
          }

          return '12';
        }

        if (timeMode === TimeModeEnum.PM) {
          return (hourValue + 12).toString();
        }

        return formatNumberWithLeadingZero(hourValue);
      })();
      const minuteText = formatNumberWithLeadingZero(minuteValue);
      const newValue = `${hourText}:${minuteText}`;

      onChange({
        type: MY_TIME_RANGE_PICKER_TYPE.ExactTime,
        value: newValue,
      });
    }

    closePopper();
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={closePopper}
    >
      <Box {...boxWrapperProps} className="my-time-range-picker">
        <TextField
          className="my-time-range-picker__text-field"
          sx={sxPropValue}
          {...textFieldProps}
          fullWidth
          disabled={disabled}
          inputProps={{
            autoComplete: 'off',
            readOnly: true,
            ...textFieldProps.inputProps,
          }}
          InputProps={{
            endAdornment: (
              <ArrowDropDownOutlinedIcon
                sx={{
                  position: 'relative',
                  left: theme.spacing(1.25),
                  color: hexToRGBA(theme.palette.text.primary, 0.8),
                }}
              />
            ),
            ...textFieldProps.InputProps,
            onClick: openPopper,
          }}
          value={textFieldValue}
        />

        <Popper
          className="my-time-range-picker__popper"
          anchorEl={anchorEl}
          open={isOpenPopper}
          placement="bottom"
          sx={{
            zIndex: 1301,
          }}
        >
          <Box
            sx={{
              width: theme.spacing(130),
              height: theme.spacing(90),
              background: theme.palette.common.white,
              borderRadius: theme.spacing(1),
              boxShadow: `0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)`,
              display: 'flex',
              flexDirection: 'column',
              [mediaMobileMax]: {
                width: '90vw',
                maxWidth: theme.spacing(130),
              },
            }}
          >
            <Tabs
              value={tabActive}
              onChange={(_, newValue) => {
                setTabActive(newValue);
              }}
              sx={{
                borderBottom: `1px solid ${hexToRGBA(
                  theme.palette.common.black,
                  0.12
                )}`,
              }}
            >
              {tabList.map((tabItem) => {
                return (
                  <Tab
                    key={tabItem.id}
                    label={tabItem.name}
                    sx={{
                      flex: 1,
                    }}
                  />
                );
              })}
            </Tabs>

            <TabPanel
              wrapperRef={rangeTimeWrapperRef}
              value={tabActive}
              index={TabEnum.TimeRange}
              sx={{
                overflow: 'auto',
              }}
            >
              {timeRangeList.map((rangeItem) => {
                const isSelected = rangeItem.id === rangeTimeValue;

                return (
                  <Box
                    key={rangeItem.id}
                    className={clsx({
                      'is-active': isSelected,
                    })}
                    sx={{
                      py: 3,
                      px: 4,
                      background: isSelected
                        ? theme.palette.primary.main
                        : undefined,
                      color: isSelected
                        ? theme.palette.common.white
                        : undefined,
                      '&:hover': isSelected
                        ? undefined
                        : {
                            cursor: 'pointer',
                            background: hexToRGBA(
                              theme.palette.customColors.magnolia,
                              0.8
                            ),
                          },
                    }}
                    onClick={() => {
                      setRangeTimeValue(rangeItem.id);
                    }}
                  >
                    {rangeItem.name}
                  </Box>
                );
              })}
            </TabPanel>

            <TabPanel
              value={tabActive}
              index={TabEnum.ExactTime}
              sx={{
                position: 'relative',
                flex: 1,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  m: 4,
                  fontSize: theme.spacing(3.5),
                  lineHeight: theme.spacing(5),
                  textAlign: 'center',
                }}
              >
                {/* Select hour */}
                <Box
                  ref={hoursBoxRef}
                  sx={{
                    width: theme.spacing(15),
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {hourList.map((item) => {
                    const isSelected = item === hourValue;

                    return (
                      <Box
                        className={clsx({
                          'is-active': isSelected,
                        })}
                        sx={{
                          py: 2,
                          cursor: 'pointer',
                          borderRadius: theme.spacing(1),
                          background: isSelected
                            ? theme.palette.primary.dark
                            : undefined,
                          color: isSelected
                            ? theme.palette.common.white
                            : undefined,
                        }}
                        key={item}
                        onClick={() => {
                          setHourValue(item);
                        }}
                      >
                        {item.toString().padStart(2, '0')}
                      </Box>
                    );
                  })}
                </Box>

                {/* Select minute */}
                <Box
                  ref={minutesBoxRef}
                  sx={{
                    width: theme.spacing(15),
                    mx: 2,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {minuteList.map((item) => {
                    const isSelected = item === minuteValue;

                    return (
                      <Box
                        key={item}
                        className={clsx({
                          'is-active': isSelected,
                        })}
                        sx={{
                          py: 2,
                          cursor: 'pointer',
                          borderRadius: theme.spacing(1),
                          background: isSelected
                            ? theme.palette.primary.dark
                            : undefined,
                          color: isSelected
                            ? theme.palette.common.white
                            : undefined,
                        }}
                        onClick={() => {
                          setMinuteValue(item);
                        }}
                      >
                        {item.toString().padStart(2, '0')}
                      </Box>
                    );
                  })}
                </Box>

                {/* Select time mode AM|PM */}
                <Box
                  sx={{
                    width: theme.spacing(15),
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {TIME_MODE_LIST.map((item) => {
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          py: 2,
                          borderRadius: theme.spacing(1),
                          cursor: 'pointer',
                          background:
                            timeMode === item.id
                              ? theme.palette.primary.dark
                              : undefined,
                          color:
                            timeMode === item.id
                              ? theme.palette.common.white
                              : undefined,
                          textTransform: 'uppercase',
                        }}
                        onClick={() => {
                          setTimeMode(item.id);
                        }}
                      >
                        {item.name}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </TabPanel>

            <Box
              sx={{
                borderTop: `1px solid ${hexToRGBA(
                  theme.palette.common.black,
                  0.12
                )}`,
                px: 4,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Box
                sx={{
                  cursor: 'pointer',
                  ml: 'auto',
                  px: 2,
                  py: 1.5,
                  color: theme.palette.text.secondary,
                }}
                onClick={handleCancel}
              >
                {t('cancel')}
              </Box>

              <Box
                sx={{
                  cursor: isEnableSubmit ? 'pointer' : undefined,
                  px: 2,
                  py: 1.5,
                  ml: 6,
                  color: theme.palette.primary.main,
                  opacity: isEnableSubmit ? undefined : 0.5,
                }}
                onClick={isEnableSubmit ? handleSubmit : undefined}
              >
                {t('question:ok')}
              </Box>
            </Box>
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export { MY_TIME_RANGE_PICKER_TYPE } from './types';
export type {
  IMyTimeRangePickerProps,
  TMyTimeRangePickerType,
  TMyTimeRangePickerValue,
} from './types';
export { convertToMyTimeRangePickerValue } from './utils';
