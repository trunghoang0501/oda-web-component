// ** MUI Imports
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import { ILocale } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { LanguageEnum } from '@/utils';
import { buildYupLocale } from '@/i18n/buildYupLocale';
import { t } from 'i18next';

const locales: ILocale[] = [
  {
    key: LanguageEnum.vi_VN,
    label: 'Tiếng việt',
    value: LanguageEnum.vi_VN,
    img: '/country/vi.png',
  },
  {
    key: LanguageEnum.en_US,
    label: 'English',
    value: LanguageEnum.en_US,
    img: '/country/en.png',
  },
  {
    key: LanguageEnum.ko_KR,
    label: '한국어',
    value: LanguageEnum.ko_KR,
    img: '/country/ko.png',
  },
];

const Language = () => {
  const { settings, saveSettings } = useSettings();

  const theme = useTheme();

  const router = useRouter();

  const changeLanguage = async (event: SelectChangeEvent) => {
    event.preventDefault();
    if (event?.target?.value) {
      saveSettings({
        ...settings,
        language: event?.target?.value as LanguageEnum,
      });
      buildYupLocale(null, t);
      router.reload();
    }
  };

  return (
    <Box sx={{ minWidth: '9.5rem' }}>
      <Select
        className="customize-language"
        label="Locale"
        value={settings.language}
        onChange={changeLanguage}
        sx={{
          fontSize: theme.spacing(3.5),
          color: theme.palette.background.paper,
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.background.paper,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.background.paper,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.background.paper,
          },
          '.MuiSvgIcon-root ': {
            fill: theme.palette.background.paper,
          },
        }}
      >
        {locales.map((item) => (
          <MenuItem className="menu-custom" key={item.key} value={item.key}>
            <Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
              <img loading="lazy" width="20" src={item.img} alt="" />
              {item.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default Language;
