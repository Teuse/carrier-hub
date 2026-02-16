import { AppBar, Toolbar, Button, Menu, MenuItem } from "@mui/material";
import { Divider, ListItemIcon } from "@mui/material";
import { Box } from "@mui/material";
import { useState } from "react";
import { getUser, logout } from "../auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import IvecoLogo from "../assets/iveco_logo_white.svg";

export default function Header() {
  const navigate = useNavigate();
  const user = getUser();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Box
            component="img"
            src={IvecoLogo}
            alt="IVECO"
            sx={{
              height: 28,
              width: "auto",
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          onClick={() => navigate("/anomalies")}
          sx={{
            color: isActive("/anomalies") ? "primary.main" : "#ffffff",
            fontWeight: isActive("/anomalies") ? 600 : 400,
          }}
        >
          Anomalies
        </Button>

        <Button
          onClick={() => navigate("/workbench")}
          sx={{
            color: isActive("/workbench") ? "primary.main" : "#ffffff",
            fontWeight: isActive("/workbench") ? 600 : 400,
          }}
        >
          Workspace
        </Button>

        <Button
          onClick={() => navigate("/logistics")}
          sx={{
            color: isActive("/logistics") ? "primary.main" : "#ffffff",
            fontWeight: isActive("/logistics") ? 600 : 400,
          }}
        >
          Logistics
        </Button>

        <Button
          onClick={() => navigate("/warehouse")}
          sx={{
            color: isActive("/warehouse") ? "primary.main" : "#ffffff",
            fontWeight: isActive("/warehouse") ? 600 : 400,
          }}
        >
          Warehouse
        </Button>

        <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleMenuOpen}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem disabled>{user?.username}</MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/workbenches/manage");
            }}
          >
            Workbench Management
          </MenuItem>

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/load-carriers/manage");
            }}
          >
            Load Carrier Management
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
