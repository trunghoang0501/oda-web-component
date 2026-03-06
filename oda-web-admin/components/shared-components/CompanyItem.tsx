/* eslint-disable camelcase */
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Stack from '@mui/system/Stack';
import * as React from 'react';
import { BusinessType, ICity, IDistrict } from '@/types';
import { IMAGE_DEFAULT } from '@/utils/constants';

// ** Styled Components
const ImgStyled = styled('img')(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  borderRadius: theme.spacing(1.5),
  flexBasis: theme.spacing(10),
}));

interface ICompanyItemProps {
  name: string;
  picture: string;
  business_type?: BusinessType[];
  city_id: ICity;
  district_id: IDistrict;
  isLinked?: boolean;
}

function CompanyItem(props: ICompanyItemProps) {
  const {
    name,
    business_type,
    city_id,
    district_id,
    picture,
    isLinked = false,
  } = props;

  const addressList = [city_id?.name, district_id?.name].filter(Boolean);

  const renderDescription = React.useMemo(
    () =>
      `${(business_type || []).map((b) => b.name).join(' | ')}${
        addressList.length > 0 ? ` (${addressList.join(', ')})` : ''
      }`,
    [business_type]
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={(theme) => theme.spacing(2)}
      sx={(theme) => ({
        color: theme.palette.customColors.summaryTitleColor,
        fontSize: theme.spacing(4),
        lineHeight: theme.spacing(6),
        overflow: 'hidden',
      })}
    >
      <ImgStyled src={picture || IMAGE_DEFAULT.COMPANY} alt="" />
      <Stack direction="column" flex={1} minWidth={0}>
        <Typography
          noWrap
          sx={(theme) => ({
            fontWeight: 600,
            color: isLinked
              ? theme.palette.customColors.colorCyan
              : theme.palette.customColors.summaryTitleColor,
          })}
        >
          {name}
        </Typography>

        <Typography
          noWrap
          sx={(theme) => ({
            fontWeight: 400,
            maxWidth: theme.spacing(90.5),
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: theme.palette.text.secondary,
          })}
        >
          {renderDescription}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default CompanyItem;
