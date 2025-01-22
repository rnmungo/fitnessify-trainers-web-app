import { ReactNode } from 'react';
import MuiBox from '@mui/material/Box';
import MuiGrid from '@mui/material/Grid2';
import MuiPaper from '@mui/material/Paper';
import MuiDragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/system';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

const DragHandle = styled(MuiBox)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'grab',
});

const SortableListItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <MuiPaper style={style} sx={{ p: 2, mb: 2 }}>
      <MuiGrid container spacing={2} alignItems="center">
        <MuiGrid>
          <DragHandle ref={setNodeRef} {...attributes} {...listeners}>
            <MuiDragIndicatorIcon color="primary" />
          </DragHandle>
        </MuiGrid>
        {children}
      </MuiGrid>
    </MuiPaper>
  );
};

export default SortableListItem;
