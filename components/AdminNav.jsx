import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Link,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as NextLink } from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import HomeIcon from "@mui/icons-material/Home";

import MohoSVG from "./MohoSVG";

import { useState } from "react";
import { auth } from "../services/firebase";

export default function AdminNav() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          sx={{
            flexGrow: 1,
            fontSize: 27,
            fontWeight: 600,
          }}
        >
          <Link sx={{ color: "white" }} href="/admin">
            <MohoSVG color={"white"} height={45} />
            AUTH
          </Link>
        </Typography>
        <Box>
          <IconButton
            size="large"
            aria-label="admin navigation options"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} href="/admin" onClick={handleClose}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Home" />
            </MenuItem>

            <MenuItem component={Link} href="/code" onClick={handleClose}>
              <ListItemIcon>
                <QrCodeIcon />
              </ListItemIcon>
              <ListItemText primary="Your QR Code" />
            </MenuItem>
            <MenuItem onClick={() => auth.signOut()}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
