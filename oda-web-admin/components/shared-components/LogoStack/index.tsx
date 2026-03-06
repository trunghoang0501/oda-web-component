import { Stack } from '@mui/material';
import { LogoField } from './components/LogoField';
import { LogoTooltip } from './components/LogoTooltip';
import { LogoStackClassEnum } from './constants';
import {
  HtmlTooltipStyled,
  LogoShowMoreItemStyled,
  LogoStackStyled,
} from './styles';
import { ILogoFieldProps, ILogoStackProps } from './types';

export const LogoStack = ({
  value = [],
  maxLogoToShow = 10,
  minLogoToShowTooltip = 1,
  renderLogoFieldProps = {},
  renderLogoListProps = {},
  renderShowMoreItemProps = {},
  ...groupRenderTooltipProps
}: ILogoStackProps) => {
  const logoList =
    value.length > 0
      ? (() => {
          const tmpMaxItemToLoop =
            maxLogoToShow > value.length ? value.length : maxLogoToShow;
          const tmpLogoList = [];

          for (let i = 0; i < tmpMaxItemToLoop; i++) {
            const item = value[i];
            /**
             * If list of logo just only one item, then the title can be shown
             */
            const tmpLogoFieldProps: ILogoFieldProps = {
              canBeShownTitle: value.length === 1,
              ...item,
              ...renderLogoFieldProps,
            };

            tmpLogoList.push(
              <LogoField {...tmpLogoFieldProps} key={`LogoField${i}`} />
            );
          }

          if (value.length > maxLogoToShow) {
            tmpLogoList.push(
              <LogoShowMoreItemStyled key="LogoShowMoreItem">
                +{value.length - maxLogoToShow}
              </LogoShowMoreItemStyled>
            );
          }

          return (
            <>
              {tmpLogoList.length > 0 &&
                (value.length >= minLogoToShowTooltip ? (
                  <HtmlTooltipStyled
                    title={
                      <LogoTooltip value={value} {...groupRenderTooltipProps} />
                    }
                  >
                    <Stack direction="row">{tmpLogoList}</Stack>
                  </HtmlTooltipStyled>
                ) : (
                  tmpLogoList
                ))}
            </>
          );
        })()
      : undefined;

  return (
    <LogoStackStyled
      direction="row"
      className={
        value.length > 1 ? LogoStackClassEnum.IsMultipleLogo : undefined
      }
    >
      {logoList}
    </LogoStackStyled>
  );
};
