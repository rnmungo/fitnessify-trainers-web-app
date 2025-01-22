import { useEffect, useState } from 'react';
import { MultipleSelectCheckbox } from '@/core/components/presentational/select';
import { useTranslation } from '@/core/i18n/context';
import useQueryMuscleGroups from '../../../hooks/useQueryMuscleGroups';

interface MuscleGroupsMultipleSelectProps {
  id: string;
  label: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  [key: string]: any;
}

const MuscleGroupsMultipleSelect: React.FC<MuscleGroupsMultipleSelectProps> = ({
  id,
  label,
  value,
  defaultValue,
  onChange,
  ...formProps
}) => {
  const { data: muscleGroups, status, refetch } = useQueryMuscleGroups();
  const [items, setItems] = useState<Array<{ id: string; name: string }>>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (status === 'success' && muscleGroups) {
      setItems(muscleGroups.map(muscleGroup => ({
        id: muscleGroup.id,
        name: muscleGroup.name,
      })));
    }
  }, [status, muscleGroups]);

  const errorMessage = t('muscle-groups.multi-select.error-message');
  const placeholder = status === 'pending' ? t('common.wordings.loading') : t('muscle-groups.multi-select.empty-message');

  return (
    <MultipleSelectCheckbox
      id={id}
      label={label}
      items={items}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      error={status === 'error'}
      errorMessage={errorMessage}
      onRetry={refetch}
      onChange={onChange}
      {...formProps}
    />
  );
};

export default MuscleGroupsMultipleSelect;
