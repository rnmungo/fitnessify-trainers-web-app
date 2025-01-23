import { ReactNode } from 'react';
import MuiBox from '@mui/material/Box';
import MuiDragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/system';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSectionProps {
  id: string;
  children: ReactNode;
}

const DragHandle = styled(MuiBox)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'grab',
});

const StyledBox = styled(MuiBox)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderWidth: 1,
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
  padding: theme.spacing(2),
}));

const SortableListSection = ({ id, children }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <StyledBox ref={setNodeRef} style={style}>
      <DragHandle {...attributes} {...listeners}>
        <MuiDragIndicatorIcon color="primary" />
      </DragHandle>
      {children}
    </StyledBox>
  );
};

export default SortableListSection;
