import React, { createRef, useRef, useState, useEffect } from "react";
import {
  Card,
  Grid,
  Stack,
  Typography,
  Box,
  Avatar,
  useTheme,
  ThemeProvider,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { createFileName, useScreenshot } from "use-react-screenshot";
import { Download, Code } from "@mui/icons-material";

function Pretty({ base, custom }) {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PrettySingle armor={base} />
        <Typography textAlign="center">
          <ArrowDownward />
        </Typography>
        <PrettySingle armor={custom} showActions />
      </div>
    </ThemeProvider>
  );
}

function PrettySingle({ armor, showActions }) {
  const ref = createRef(null);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const ternary = theme.palette.ternary.main;
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleGridItemClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataURL = reader.result;
      setSelectedImage(imageDataURL);
    };
    reader.readAsDataURL(selectedFile);
  };

  const [image, takeScreenShot] = useScreenshot();

  function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  const getJSON = () => {
    const jsonData = JSON.stringify(armor);
    const fileName = `${armor.name.replace(/\s/g, "_").toLowerCase()}.json`;
    downloadFile(jsonData, fileName, "text/plain");
  };

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const getImage = () => {
    takeScreenShot(ref.current);
  };

  useEffect(() => {
    if (image) {
      download(image, { name: armor.name, extension: "png" });
    }
  }, [image, armor.name]);

  return (
    <>
      <Card>
        <div
          ref={ref}
          style={{ backgroundColor: "white", background: "white" }}
        >
          <Stack>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1,
                background: `${primary}`,
                color: "#ffffff",
                "& .MuiTypography-root": {
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                },
              }}
            >
              <Grid item xs={1}></Grid>
              <Grid item xs={3}>
                <Typography variant="h4" textAlign="left">
                  {armor.category}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h4" textAlign="center">
                  Cost
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h4" textAlign="center">
                  Defense
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" textAlign="center">
                  M. Defense
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              {/* Image */}
              <Grid
                item
                xs={2}
                sx={{
                  flex: "0 0 70px",
                  minWidth: "70px",
                  minHeight: "70px",
                  overflow: "hidden",
                  border: `1px solid ${primary}`,
                  background: `${ternary}`,
                }}
                onClick={handleGridItemClick}
              >
                <Box
                  sx={{
                    width: "70px",
                    height: "70px",
                    background: "white",
                    border: `1px solid ${primary}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    alt="Image"
                    src={selectedImage || ""}
                    sx={{ objectFit: "cover", borderRadius: "0" }}
                  />
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </Grid>

              <Grid container direction="column" item xs>
                {/* First Row */}
                <Grid
                  container
                  justifyContent="space-between"
                  item
                  sx={{
                    background: `linear-gradient(to right, ${ternary}, transparent)`,
                    borderBottom: `1px solid ${secondary}`,
                    padding: "5px",
                  }}
                >
                  <Grid item xs={3}>
                    <Typography fontWeight="bold">{armor.name}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography textAlign="center">{`${armor.cost}z`}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography fontWeight="bold" textAlign="center">
                      {armor.category === "Shield" ? "+" + armor.def : ""}
                      {armor.category === "Armor" && armor.martial
                        ? armor.def
                        : ""}
                      {armor.category === "Armor" && !armor.martial
                        ? armor.def === 0
                          ? "DEX die"
                          : "DEX die +" + armor.def
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography fontWeight="bold" textAlign="center">
                      {armor.category === "Shield" ? "+" + armor.mdef : ""}
                      {armor.category === "Armor" && armor.martial
                        ? armor.def
                        : ""}
                      {armor.category === "Armor"
                        ? armor.mdef === 0
                          ? "INS die"
                          : "INS die +" + armor.mdef
                        : ""}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Second Row */}
                <Grid
                  container
                  justifyContent="flex-start"
                  sx={{
                    background: "transparent",
                    padding: "5px",
                  }}
                >
                  <Typography>
                    {!armor.quality && "No Qualities"} {armor.quality}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </div>
      </Card>
      {showActions && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Download">
            <IconButton onClick={getImage}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export JSON">
            <IconButton onClick={getJSON}>
              <Code />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
}

export default Pretty;
