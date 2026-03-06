// ** MUI Imports
import { MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useGetLanguagesQuery } from '@/apis';
import { useSettings } from '@/hooks/useSettings';
import { ILanguage, ILocale } from '@/types';
import { LanguageEnum } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';

// Create a custom hook to get languages from API
export const useLocales = () => {
  const { data: languagesData } = useGetLanguagesQuery();

  // Convert API languages to ILocale format
  const locales = useMemo(() => {
    if (!languagesData?.data) return [];

    return languagesData.data.map((language: ILanguage) => ({
      key: language.code,
      label: language.name,
      value: language.code,
      img: language.flag_url,
    }));
  }, [languagesData]);

  return locales;
};

interface LanguageProps {
  transformOriginVertical: 'top' | 'bottom' | 'center';
  horizontal: 'right' | 'left' | 'center';
  anchorOriginVertical: 'top' | 'bottom' | 'center';
  alwayShowTitle?: boolean;
}

const Language = (props: LanguageProps) => {
  const {
    transformOriginVertical,
    horizontal,
    anchorOriginVertical,
    alwayShowTitle,
  } = props;
  const router = useRouter();
  const { settings, saveSettings } = useSettings();
  const { data: languagesData, isLoading: isLoadingLanguages } =
    useGetLanguagesQuery();
  // Use the custom hook to get locales
  const locales = useLocales();

  // Only set value if locales are loaded and the value exists in locales
  const selectValue = useMemo(() => {
    if (isLoadingLanguages || locales.length === 0) {
      return '';
    }
    const hasValue = locales.some(
      (locale: ILocale) => locale.key === settings.language
    );
    return hasValue ? settings.language : '';
  }, [settings.language, locales, isLoadingLanguages]);

  const changeLanguage = async (event: SelectChangeEvent) => {
    event.preventDefault();
    if (event?.target?.value) {
      saveSettings({
        ...settings,
        language: event?.target?.value as LanguageEnum,
      });
      router.reload();
    }
  };
  const theme = useTheme();

  // Don't render Select until locales are loaded to prevent MUI warning loop
  if (isLoadingLanguages || locales.length === 0) {
    return null;
  }

  return (
    <Box>
      <Select
        sx={{
          [mediaMobileMax]: {
            '& .MuiSelect-select.MuiOutlinedInput-input': {
              minWidth: `0 !important`,
            },
            maxWidth: !alwayShowTitle ? theme.spacing(16.75) : 'unset',
          },
          '& .MuiOutlinedInput-input': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 24px)',
            display: 'block',
          },
        }}
        className="customize-language"
        label="Locale"
        autoWidth
        value={selectValue}
        onChange={changeLanguage}
        MenuProps={{
          transformOrigin: {
            vertical: `${transformOriginVertical}`,
            horizontal: `${horizontal}`,
          },
          anchorOrigin: {
            vertical: `${anchorOriginVertical}`,
            horizontal: 'left',
          },
        }}
      >
        {locales.map((item: ILocale) => (
          <MenuItem key={item.key} value={item.key}>
            <Box
              sx={{
                '& > img': { mr: 2, flexShrink: 0, objectFit: 'contain' },
                display: 'flex',
              }}
            >
              <img loading="lazy" width="20" src={item.img} alt="" />
              <Box
                sx={{
                  [mediaMobileMax]: {
                    display: alwayShowTitle
                      ? 'block !important'
                      : 'none !important',
                  },
                }}
              >
                {item.label}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default Language;
