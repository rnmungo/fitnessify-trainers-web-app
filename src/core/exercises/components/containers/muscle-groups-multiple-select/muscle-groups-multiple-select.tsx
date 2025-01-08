import { useEffect, useState } from 'react';
import useQueryMuscleGroups from '../../../hooks/useQueryMuscleGroups';
import { MultipleSelectCheckbox } from '@/core/components/presentational/select';

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

  useEffect(() => {
    if (status === 'success' && muscleGroups) {
      setItems(muscleGroups.map(muscleGroup => ({
        id: muscleGroup.id,
        name: muscleGroup.name,
      })));
    }
  }, [status, muscleGroups]);

  const errorMessage = "Error al cargar grupos musculares.";
  const placeholder = status === 'pending' ? 'Cargando...' : 'No hay grupos musculares';

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
