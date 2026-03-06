import { SxProps } from '@mui/material';

export interface IRenderLogoListProps {
  sx?: SxProps;
}

export interface IRenderLogoFieldProps {
  sx?: SxProps;
  disableToShowTitle?: true;
}

export interface IRenderShowMoreItemProps {
  sx?: SxProps;
}

export interface IRenderTooltipProps {
  sx?: SxProps;
  disableToShowHeader?: true;
  title?: string;
}

export interface IRenderLogoListInTooltipProps {
  sx?: SxProps;
}

export interface IRenderLogoFieldInTooltipProps {
  sx?: SxProps;
  disableToShowTitle?: true;
}

export interface ILogoItem {
  name?: string;
  url: string;
}

export interface ILogoTooltipProps {
  value: ILogoItem[];
  renderLogoFieldInTooltipProps?: IRenderLogoFieldInTooltipProps;
  renderLogoListInTooltipProps?: IRenderLogoListInTooltipProps;
  renderTooltipProps?: IRenderTooltipProps;
}

export type ILogoFieldProps = ILogoItem &
  IRenderLogoFieldProps & {
    canBeShownTitle: boolean;
  };

export interface ILogoStackProps extends ILogoTooltipProps {
  maxLogoToShow?: number;
  minLogoToShowTooltip?: number;
  renderLogoFieldProps?: IRenderLogoFieldProps;
  showMore?: boolean;
}
