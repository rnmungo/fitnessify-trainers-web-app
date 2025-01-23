import MuiToggleButton from '@mui/material/ToggleButton';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslation } from '../../../context';
import { LANGUAGES } from '../../../constants';

const LanguageToggleButton = () => {
  const { t, changeLanguage, locale } = useTranslation();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string,
  ) => {
    if (value && value !== locale) {
      changeLanguage(value);
    }
  };

  return (
    <MuiToggleButtonGroup
      color="primary"
      size="small"
      value={locale}
      exclusive
      onChange={handleChange}
      aria-label={t('main.language.selector')}
    >
      {Object.entries(LANGUAGES).map(([lang, langText]) => (
        <MuiToggleButton key={lang} value={lang} selected={lang === locale}>{t(langText)}</MuiToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
};

export default LanguageToggleButton;
