import { useState, MouseEvent } from 'react';
import { amber } from '@mui/material/colors';
import MuiAppBar from '@mui/material/AppBar';
import MuiBox from '@mui/material/Box';
import MuiToolbar from '@mui/material/Toolbar';
import MuiIconButton from '@mui/material/IconButton';
import MuiTypography from '@mui/material/Typography';
import MuiMenu from '@mui/material/Menu';
import MuiMenuIcon from '@mui/icons-material/Menu';
import MuiContainer from '@mui/material/Container';
import MuiAvatar from '@mui/material/Avatar';
import MuiButton from '@mui/material/Button';
import MuiTooltip from '@mui/material/Tooltip';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiAdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface Link {
  label: string;
  onClick: () => void;
}

interface AvatarProps {
  src?: string;
  alt?: string;
  text?: string;
}

interface NavigationProps {
  logo: string;
  avatar: AvatarProps;
  widget?: React.ReactNode;
  links?: Link[] | null;
  settings?: Link[] | null;
}

const Navigation: React.FC<NavigationProps> = ({
  logo,
  avatar,
  widget,
  links = null,
  settings = null,
}) => {
  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);
  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorUser(null);
  };

  return (
    <MuiAppBar position="static" sx={{ height: '10vh' }}>
      <MuiContainer maxWidth="xl" sx={{ height: 'inherit', display: 'grid' }}>
        <MuiToolbar disableGutters>
          <MuiTypography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {logo}
          </MuiTypography>
          <MuiBox sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <MuiIconButton
              size="large"
              color="inherit"
              aria-label="App bar links button"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MuiMenuIcon />
            </MuiIconButton>
            <MuiMenu
              id="menu-appbar"
              anchorEl={anchorNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {links &&
                links.map((link) => (
                  <MuiMenuItem
                    key={link.label}
                    aria-label={link.label}
                    onClick={link.onClick}
                  >
                    <MuiTypography textAlign="center">{link.label}</MuiTypography>
                  </MuiMenuItem>
                ))}
            </MuiMenu>
          </MuiBox>
          <MuiAdminPanelSettingsIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <MuiTypography
            variant="h5"
            noWrap
            component="a"
            href="/"
            color="inherit"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Roboto Mono, monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
            }}
          >
            {logo}
          </MuiTypography>
          <MuiBox sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {links &&
              links.map((link) => (
                <MuiButton
                  key={link.label}
                  aria-label={link.label}
                  onClick={link.onClick}
                  color="inherit"
                  sx={{ my: 2, display: 'block' }}
                >
                  {link.label}
                </MuiButton>
              ))}
          </MuiBox>
          <MuiBox sx={{ flexGrow: 0 }}>
            {widget}
            <MuiTooltip title="Abrir opciones">
              <MuiIconButton
                aria-label="Avatar settings button"
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 2 }}
              >
                {avatar.src ? (
                  <MuiAvatar
                    sx={{ bgcolor: amber[500] }}
                    alt={avatar.alt}
                    src={avatar.src}
                  />
                ) : (
                  <MuiAvatar
                    sx={{
                      bgcolor: amber[500],
                      color: 'primary.contrastText',
                    }}
                  >
                    <MuiTypography variant="subtitle1" noWrap>
                      {avatar.text}
                    </MuiTypography>
                  </MuiAvatar>
                )}
              </MuiIconButton>
            </MuiTooltip>
            <MuiMenu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorUser)}
              onClose={handleCloseUserMenu}
            >
              {settings &&
                settings.map((setting) => (
                  <MuiMenuItem
                    key={setting.label}
                    aria-label={setting.label}
                    onClick={setting.onClick}
                  >
                    <MuiTypography textAlign="center">{setting.label}</MuiTypography>
                  </MuiMenuItem>
                ))}
            </MuiMenu>
          </MuiBox>
        </MuiToolbar>
      </MuiContainer>
    </MuiAppBar>
  );
};

export default Navigation;
