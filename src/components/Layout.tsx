import { Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./appbar/AppBar";

import { useThemeContext } from "../ThemeContext";

type ThemeValue = "Fabula" | "High" | "Techno" | "Natural" | "Midnight";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setTheme } = useThemeContext();

  const [selectedTheme, setSelectedTheme] = useState<ThemeValue>(() => {
    return (localStorage.getItem("selectedTheme") as ThemeValue) || "Fabula";
  });

  const handleSelectTheme = (theme: ThemeValue) => {
    setSelectedTheme(theme);
  };

  useEffect(() => {
    // Update the theme in localStorage and ThemeContext
    localStorage.setItem("selectedTheme", selectedTheme);
    setTheme(selectedTheme);
  }, [selectedTheme, setTheme]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const fultimatorRoutes = ["/npc-gallery/:npcId"];
  const isNpcEdit = fultimatorRoutes.includes(location.pathname);

  return (
    <>
      <AppBar
        isNpcEdit={isNpcEdit}
        handleGoBack={handleGoBack}
        selectedTheme={selectedTheme}
        handleSelectTheme={handleSelectTheme}
      />
      <Container style={{ marginTop: "8em", alignItems: "center" }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
