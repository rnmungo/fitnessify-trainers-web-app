import { MouseEvent, useState } from 'react';
import MuiChip from '@mui/material/Chip';
import MuiPopover from '@mui/material/Popover';
import MuiStack from '@mui/material/Stack';

interface Item {
  id: string;
  label: string;
};

interface ChipCollapsedProps {
  items: Array<Item>;
  maxVisibleItems: number;
};

const ChipCollapsed = ({ items = [], maxVisibleItems = 2 }: ChipCollapsedProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleShowRemaining = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'chip-collapsed-popover' : undefined;

  const displayItems = items.slice(0, maxVisibleItems);
  const remainingCount = items.length - maxVisibleItems;

  return (
    <>
      <MuiStack direction="row" spacing={1} alignItems="center">
        {displayItems.map((item) => (
          <MuiChip
            key={item.id}
            label={item.label}
            size="small"
            variant="outlined"
          />
        ))}
        {remainingCount > 0 && (
          <MuiChip
            label={`+${remainingCount}`}
            size="small"
            variant="outlined"
            onClick={handleShowRemaining}
          />
        )}
      </MuiStack>
      <MuiPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MuiStack direction="column" spacing={1} padding={2}>
          {items.slice(maxVisibleItems).map((item) => (
            <MuiChip
              key={item.id}
              label={item.label}
              size="small"
              variant="outlined"
            />
          ))}
        </MuiStack>
      </MuiPopover>
    </>
  );
};

export default ChipCollapsed;
