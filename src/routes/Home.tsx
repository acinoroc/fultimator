import { CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import adversary_compedium from "./adversary_compedium.png";
import adversary_designer from "./adversary_designer.png";
import combat_simulator from "./combat_simulator.png";
import dice_roller from "./dice_roller.png";
import items_rituals_projects from "./items_rituals_projects.png";
import React, { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [hover, setHover] = useState("");
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <CardMedia
          component="img"
          image={adversary_designer}
          alt=""
          sx={{
            objectFit: "contain",
            width: 360,
            cursor: "pointer",
            transform: hover === "adversary_designer" ? " scale(1.1)" : "none",
          }}
          onMouseEnter={() => {
            setHover("adversary_designer");
          }}
          onMouseLeave={() => {
            setHover("");
          }}
          onClick={() => {
            navigate("/npc-gallery");
          }}
        />

        <CardMedia
          component="img"
          image={adversary_compedium}
          alt=""
          sx={{
            objectFit: "contain",
            width: 360,
            cursor: "pointer",
            transform: hover === "adversary_compedium" ? " scale(1.1)" : "none",
          }}
          onMouseEnter={() => {
            setHover("adversary_compedium");
          }}
          onMouseLeave={() => {
            setHover("");
          }}
          onClick={() => {
            navigate("/npc-compedium");
          }}
        />

        <CardMedia
          component="img"
          image={combat_simulator}
          alt=""
          sx={{
            objectFit: "contain",
            width: 360,
            cursor: "pointer",
            transform: hover === "combat_simulator" ? " scale(1.1)" : "none",
          }}
          onMouseEnter={() => {
            setHover("combat_simulator");
          }}
          onMouseLeave={() => {
            setHover("");
          }}
          onClick={() => {
            navigate("/combat");
          }}
        />

        <CardMedia
          component="img"
          image={items_rituals_projects}
          alt=""
          sx={{
            objectFit: "contain",
            width: 360,
            cursor: "pointer",
            transform:
              hover === "items_rituals_projects" ? " scale(1.1)" : "none",
          }}
          onMouseEnter={() => {
            setHover("items_rituals_projects");
          }}
          onMouseLeave={() => {
            setHover("");
          }}
          onClick={() => {
            navigate("/generate");
          }}
        />

        <CardMedia
          component="img"
          image={dice_roller}
          alt=""
          sx={{
            objectFit: "contain",
            width: 360,
            cursor: "pointer",
            transform: hover === "dice_roller" ? " scale(1.1)" : "none",
          }}
          onMouseEnter={() => {
            setHover("dice_roller");
          }}
          onMouseLeave={() => {
            setHover("");
          }}
          onClick={() => {
            navigate("/roller");
          }}
        />
      </div>

      <Typography sx={{ p: 3, textAlign: "center" }}>
        The wonderful Fultimator Icons are made by Runty! Email:{" "}
        <a href="mailto:contactrunty@iCloud.com">contactrunty@iCloud.com</a>
        <br />
        Monster Icons are taken from{" "}
        <a href="http://www.akashics.moe/" target="_blank" rel="noreferrer">
          http://www.akashics.moe/
        </a>
      </Typography>
    </Layout>
  );
}

export default Home;