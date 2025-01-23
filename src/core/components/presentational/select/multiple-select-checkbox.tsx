import { useCallback, useEffect, useState } from 'react';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiChip from '@mui/material/Chip';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormHelperText from '@mui/material/FormHelperText';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiListItemText from '@mui/material/ListItemText';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiOutlinedInput from '@mui/material/OutlinedInput';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from '@/core/i18n/context';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type ItemProps = {
  id: string;
  name: string;
};

interface MultipleSelectCheckboxProps {
  id: string;
  label: string;
  items: ItemProps[];
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onChange?: (value: string[]) => void;
  [key: string]: any;
}

const defaultId = 'multiple-select-checkbox';

const MultipleSelectCheckbox = ({
  id,
  label,
  items = [],
  value = [],
  defaultValue = [],
  placeholder,
  error = false,
  errorMessage = '',
  onRetry,
  onChange,
  ...formProps
}: MultipleSelectCheckboxProps) => {
  const [valueState, setValueState] = useState<string[]>(defaultValue);
  const { t } = useTranslation();

  const handleChange = useCallback((event: SelectChangeEvent<typeof valueState>) => {
    const { target: { value: eventValue } } = event;
    const newValue = typeof eventValue === 'string' ? eventValue.split(',') : eventValue;
    setValueState(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  useEffect(() => {
    setValueState(value || defaultValue);
  }, [value, defaultValue]);

  const idState = id || defaultId;

  const renderItems = () => {
    if (items.length === 0) {
      return <MuiMenuItem disabled>{placeholder || t('common.wordings.there-are-no-elements')}</MuiMenuItem>;
    }

    return items.map((item) => (
      <MuiMenuItem key={item.id} value={item.id}>
        <MuiCheckbox checked={valueState.indexOf(item.id) > -1} />
        <MuiListItemText primary={item.name} />
      </MuiMenuItem>
    ));

  };

  return (
    <MuiFormControl error={error} {...formProps}>
      <MuiInputLabel sx={{ top: 'inherit' }} id={`${idState}-label`}>{label}</MuiInputLabel>
      <MuiSelect
        labelId={`${idState}-label`}
        id={idState}
        multiple
        value={valueState}
        onChange={handleChange}
        input={<MuiOutlinedInput id={`${idState}-input`} label={label} />}
        inputProps={{ 'aria-label': label }}
        renderValue={(selected) => (
          <MuiBox sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, overflowX: 'hidden', height: 'auto' }}>
            {selected.map((selectedValue: string) => {
              const item = items.find((item) => item.id === selectedValue);
              return (
                <MuiChip key={selectedValue} label={item?.name} size="small" />
              );
            })}
          </MuiBox>
        )}
        MenuProps={MenuProps}
      >
        {renderItems()}
      </MuiSelect>
      {error && (
        <MuiFormHelperText>
          {errorMessage}
          {onRetry && (
            <MuiButton size="small" color="error" onClick={onRetry}>
              {t('common.wordings.retry')}
            </MuiButton>
          )}
        </MuiFormHelperText>
      )}
    </MuiFormControl>
  );
}

export default MultipleSelectCheckbox;
