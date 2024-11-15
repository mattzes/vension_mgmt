'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Button, Avatar, Menu, MenuItem, Box } from '@mui/material';

export default function App() {
  const { user, logOut, googleSignIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);

  const handleSignIn = async () => {
    setAnchorElMenu(null);
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  return (
    <>
      {loading ? null : !user ? (
        <Box sx={{ pr: 3 }}>
          <Button onClick={handleSignIn} key={'loginButton'} color="secondary" variant="contained" disableElevation>
            Login
          </Button>
        </Box>
      ) : (
        <>
          <Button onClick={handleMenuOpen}>
            <Avatar src={user?.photoURL ?? ''} />
          </Button>
          <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
            <MenuItem key={'username'} disabled>
              {user.displayName}
            </MenuItem>
            <MenuItem key={'logout'} onClick={handleSignOut}>
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
}
