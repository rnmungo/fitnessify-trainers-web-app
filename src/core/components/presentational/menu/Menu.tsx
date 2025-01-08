import { useState } from 'react';
import MuiIconButton from '@mui/material/IconButton';
import MuiTypography from '@mui/material/Typography';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiMoreVertIcon from '@mui/icons-material/MoreVert';

import type { MouseEvent } from 'react';

interface Option {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

interface MenuProps {
  options: Array<Option>;
  size: 'small' | 'medium' | 'large';
  color: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
}

const Menu = ({ options, size = 'medium', color = 'default', ...buttonProps }: MenuProps) => {
  const [anchorState, setAnchorState] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorState(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorState(null);
  };

  return (
    <>
      <MuiIconButton
        color={color}
        size={size}
        onClick={handleOpenMenu}
        {...buttonProps}
      >
        <MuiMoreVertIcon />
      </MuiIconButton>
      <MuiMenu
        sx={{ mt: '45px' }}
        id="menu-options"
        anchorEl={anchorState}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorState)}
        onClose={handleCloseMenu}
      >
        {options &&
          options.map(option => (
            <MuiMenuItem
              key={option.label}
              aria-label={option.label}
              disabled={option.disabled}
              onClick={() => {
                option.onClick();
                handleCloseMenu();
              }}
            >
              <MuiTypography textAlign="center">{option.label}</MuiTypography>
            </MuiMenuItem>
          ))}
      </MuiMenu>
    </>
  );
};

export default Menu;
