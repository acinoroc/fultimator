import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore, auth } from "../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, setDoc, collection, addDoc } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Grid,
  Divider,
  Fab,
  Fade,
  Tooltip,
  Button,
  TextField,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Download,
  Publish,
  Save,
  Share,
  ArrowUpward,
  ContentCopy,
  Image,
  HideImage,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import NpcPretty from "../../components/npc/Pretty";
// import NpcUgly from "../../components/npc/Ugly";
import EditBasics from "../../components/npc/EditBasics";
import ExplainSkills from "../../components/npc/ExplainSkills";
import EditAttacks from "../../components/npc/EditAttacks";
import EditWeaponAttacks from "../../components/npc/EditWeaponAttacks";
import EditAffinities from "../../components/npc/EditAffinities";
import EditSpecial from "../../components/npc/EditSpecial";
import ExplainAffinities from "../../components/npc/ExplainAffinities";
import EditExtra from "../../components/npc/EditExtra";
import EditSpells from "../../components/npc/EditSpells";
import EditActions from "../../components/npc/EditActions";
import EditNotes from "../../components/npc/EditNotes";
import EditRareGear from "../../components/npc/EditRareGear";
import Probs from "../probs/probs";
import useDownloadImage from "../../hooks/useDownloadImage";
import Export from "../../components/Export";
import { useTranslate, languageOptions } from "../../translation/translate";
import CustomHeader from "../../components/common/CustomHeader";
import TagList from "../../components/TagList";

export default function NpcEdit() {
  const { t } = useTranslate(); // Translation hook
  const theme = useTheme(); // Theme hook for MUI
  const secondary = theme.palette.secondary.main; // Secondary color from theme
  const isSmallScreen = useMediaQuery("(max-width: 899px)"); // Media query hook for screen size

  let params = useParams(); // URL parameters hook
  const ref = doc(firestore, "npc-personal", params.npcId); // Firestore document reference

  const [user] = useAuthState(auth); // Authentication state hook
  const [showScrollTop, setShowScrollTop] = useState(true); // State for scroll-to-top button visibility

  // Scroll-to-top handler
  const handleMoveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [npc] = useDocumentData(ref, { idField: "id" }); // Firestore document data hook

  const [isUpdated, setIsUpdated] = useState(false); // State for unsaved changes
  const [npcTemp, setNpcTemp] = useState(npc); // Temporary NPC state

  // Update NPC handler
  const updateNPC = (data) => {
    setIsUpdated(true);
    setNpcTemp(data);
  };

  // Effect to update temporary NPC state when NPC data changes
  useEffect(() => {
    setNpcTemp(npc);
  }, [npc]);

  // Handler for Ctrl+S to save NPC
  const handleCtrlS = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setDoc(ref, npcTemp);
      }
    },
    [ref, npcTemp]
  );

  // Effect for scroll, focus, and blur events, and keyboard shortcuts
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    const handleFocus = () => {
      setShowScrollTop(false);
    };

    const handleBlur = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    document.body.addEventListener("focus", handleFocus, true);
    document.body.addEventListener("blur", handleBlur, true);
    document.addEventListener("keydown", handleCtrlS);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("focus", handleFocus, true);
      document.body.removeEventListener("blur", handleBlur, true);
      document.removeEventListener("keydown", handleCtrlS);
    };
  }, [handleCtrlS]);

  // Download image hook and reference
  const prettyRef = useRef();
  const [downloadImage] = useDownloadImage(npc?.name, prettyRef);

  // State and handler for including image
  const [includeImage, setIncludeImage] = useState(false);
  const toggleIncludeImage = () => {
    setIncludeImage(!includeImage);
  };

  if (!npcTemp) {
    return null;
  }

  // Function to check if NPC can be published
  const canPublish = () => {
    if (!npcTemp.name || npcTemp.name === "") {
      return {
        disabled: true,
        message: t("It must have a name in order to be published.", true),
      };
    }

    if (!npcTemp.description || npcTemp.description === "") {
      return {
        disabled: true,
        message: t(
          "It must have a description in order to be published.",
          true
        ),
      };
    }

    if (!npcTemp.traits || npcTemp.traits === "") {
      return {
        disabled: true,
        message: t("It must have a traits in order to be published.", true),
      };
    }

    if (!npcTemp.createdBy || npcTemp.createdBy === "") {
      return {
        disabled: true,
        message: t(
          "'Credit By' needs to be filled in order to be published",
          true
        ),
      };
    }

    if (!npcTemp.language || npcTemp.language === "") {
      return {
        disabled: true,
        message: t("Language need to be set in order to be published", true),
      };
    }

    if (
      (npcTemp.weaponattacks && npcTemp.weaponattacks.length) ||
      (npcTemp.attacks && npcTemp.attacks.length)
    ) {
      return { disabled: false };
    }

    return {
      disabled: true,
      message: t(
        "It must have at least one attack, in order to be published.",
        true
      ),
    };
  };

  // Function to publish NPC
  const publish = () => {
    setIsUpdated(false);
    setDoc(ref, {
      ...npcTemp,
      published: true,
      searchString: npcTemp.name
        .replace(/[\W_]+/g, " ")
        .toLowerCase()
        .split(" "),
      publishedAt: Date.now(),
    });
  };

  // Function to unpublish NPC
  const unPublish = () => {
    setIsUpdated(false);
    setDoc(ref, {
      ...npcTemp,
      published: false,
    });
  };

  // Function to copy NPC
  const copyNpc = async (npc) => {
    const data = Object.assign({}, npc);
    data.uid = user.uid;
    delete data.id;
    data.published = false;

    const ref = collection(firestore, "npc-personal");

    addDoc(ref, data)
      .then(function (docRef) {
        window.location.href = `/npc-gallery/${docRef.id}`;
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  // Function to share NPC link
  const shareNpc = async (id) => {
    await navigator.clipboard.writeText(window.location.href + "/");
  };

  // Function to download NPC as image
  function DownloadImage() {
    setTimeout(downloadImage, 100);
  }

  return (
    <Layout>
      {/* Main Grid Container */}
      <Grid container spacing={2}>
        {/* NPC Pretty Display (Left-side Grid Item) */}
        <Grid item xs={12} md={8}>
          <NpcPretty
            npc={npcTemp}
            ref={prettyRef}
            collapse={true}
            includeImage={includeImage}
          />
        </Grid>

        {/* Skills, Controls and Publish (Right-side Grid Item) */}
        <Grid item xs={12} md={4}>
          {/* Skill Points */}
          <ExplainSkills npc={npcTemp} />
          <Divider sx={{ my: 1 }} />

          {/* Upload NPC Image Button */}
          <Tooltip
            title={t(
              "Upload Image: Images are temporarily stored and will reset on page refresh."
            )}
          >
            <IconButton onClick={toggleIncludeImage}>
              {includeImage ? <Image /> : <HideImage />}
            </IconButton>
          </Tooltip>

          {/* Download NPC Sheet Button */}
          <Tooltip title={t("Download as Image")}>
            <IconButton onClick={DownloadImage}>
              <Download />
            </IconButton>
          </Tooltip>

          {/* Share URL Button */}
          <Tooltip title={t("Share URL")}>
            <IconButton onClick={() => shareNpc(npc.id)}>
              <Share />
            </IconButton>
          </Tooltip>

          {/* Export NPC Data */}
          <Export name={`${npc.name}`} data={npc} />

          {/* Copy and Edit Button, shown only if user is not the creator */}
          {user && user.uid !== npc.uid && (
            <Tooltip title={t("Copy and Edit Sheet")} placement="bottom">
              <IconButton
                aria-label="duplicate"
                onClick={() => copyNpc(npcTemp)}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
          )}

          <Divider sx={{ my: 1 }} />

          {/* NPC sharing options */}
          <Paper
            elevation={3}
            sx={{
              mt: "4px",
              p: "10px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            {/* Show editing options only if user is the creator */}
            {user && user.uid === npc.uid && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/* Input for "Created By" */}
                <TextField
                  id="outlined-basic"
                  label={t("Created By:")}
                  sx={{ marginTop: 2 }}
                  size="small"
                  helperText={
                    npcTemp.published
                      ? t("This NPC is part of the Adversary Compendium.")
                      : t(
                          "Help the Adversary Compendium grow by publishing your finished work!"
                        )
                  }
                  fullWidth
                  value={npcTemp.createdBy}
                  onChange={(evt) =>
                    updateNPC({ ...npcTemp, createdBy: evt.target.value })
                  }
                />

                {/* Language Selection */}
                <Select
                  labelId="study"
                  id="study"
                  size="small"
                  value={npcTemp.language}
                  onChange={(evt) =>
                    updateNPC({ ...npcTemp, language: evt.target.value })
                  }
                  fullWidth
                >
                  {languageOptions.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText sx={{ textAlign: "center" }}>
                  {t("Select language to publish with.")}
                </FormHelperText>

                {/* Publish/Unpublish Buttons */}
                {!npcTemp.published && (
                  <Button
                    variant="contained"
                    sx={{ marginTop: 1 }}
                    startIcon={<Publish />}
                    disabled={canPublish().disabled}
                    onClick={publish}
                  >
                    {t("Publish to Adversary Compendium")}
                  </Button>
                )}
                {npcTemp.published && (
                  <Button
                    variant="outlined"
                    sx={{ marginTop: 1 }}
                    onClick={unPublish}
                  >
                    {t("Unpublish")}
                  </Button>
                )}

                {/* Message for Publish Criteria */}
                {canPublish().disabled && (
                  <div
                    style={{
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: 4,
                      color: "red",
                    }}
                  >
                    {canPublish().message}
                  </div>
                )}
              </div>
            )}
          </Paper>
          {/* Tags Section */}
          {user && user.uid === npc.uid && (
            <>
              <Divider sx={{ my: 1 }} />
              <TagList npc={npcTemp} setNpc={updateNPC} />
              {/*TEST BUTTON <Button onClick={() => console.log(npcTemp)} variant="contained">Log Temp NPC Object</Button>*/}
            </>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      {/* NPC Edit Options for Creator */}
      {user && user.uid === npc.uid && (
        <>
          {/* Edit Basic Information */}
          <Paper
            elevation={3}
            sx={{
              p: "15px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            <EditBasics npc={npcTemp} setNpc={updateNPC} />
          </Paper>
          <Divider sx={{ my: 1 }} />

          {/* Edit Affinities and Bonuses */}
          <Paper
            elevation={3}
            sx={{
              p: "15px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CustomHeader type="top" headerText={t("Affinity")} />
                <ExplainAffinities npc={npcTemp} />
                <EditAffinities npc={npcTemp} setNpc={updateNPC} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomHeader
                  type={isSmallScreen ? "middle" : "top"}
                  headerText={t("Bonuses")}
                />
                <EditExtra npc={npcTemp} setNpc={updateNPC} />
              </Grid>
            </Grid>
          </Paper>
          <Divider sx={{ my: 1 }} />

          {/* Edit Base Attacks and Weapon Attacks */}
          <Paper
            elevation={3}
            sx={{
              p: "15px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <EditAttacks npc={npcTemp} setNpc={updateNPC} />
              </Grid>
              <Grid item xs={12}>
                <EditWeaponAttacks npc={npcTemp} setNpc={updateNPC} />
              </Grid>
            </Grid>
          </Paper>
          <Divider sx={{ my: 1 }} />

          {/* Edit Spells */}
          <Paper
            elevation={3}
            sx={{
              p: "15px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            <EditSpells npc={npcTemp} setNpc={updateNPC} />
          </Paper>
          <Divider sx={{ my: 1 }} />

          {/* Edit Extra Features */}
          <Paper
            elevation={3}
            sx={{
              p: "15px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            {/* <Typography
              variant="h5"
              component="legend"
              sx={{ color: primary, textTransform: "uppercase" }}
            >
              {t("Features")}
            </Typography>
            <Divider
              orientation="horizontal"
              sx={{
                color: primary,
                borderBottom: "2px solid",
                borderColor: "secondary",
                mb: "10px",
              }}
            /> */}

            <Grid container spacing={2}>
              {/* Edit Other Actions */}
              <Grid item xs={12} md={6}>
                <EditActions npc={npcTemp} setNpc={updateNPC} />
              </Grid>
              {/* Edit Special Rules */}
              <Grid item xs={12} md={6}>
                <EditSpecial npc={npcTemp} setNpc={updateNPC} />
              </Grid>
              {/* Edit Rare Gear */}
              <Grid item xs={12} md={6}>
                <EditRareGear npc={npcTemp} setNpc={updateNPC} />
              </Grid>
              {/* Edit Notes */}
              <Grid item xs={12} md={6}>
                <EditNotes npc={npcTemp} setNpc={updateNPC} />
              </Grid>
            </Grid>
          </Paper>
          <Divider sx={{ my: 1 }} />

          {/* Attack Chance Generator Section */}
          <Paper
            elevation={3}
            sx={{
              p: "15px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: secondary,
            }}
          >
            <Probs />
          </Paper>
          <Divider sx={{ my: 2, mb: 20 }} />
        </>
      )}

      {/* <NpcUgly npc={npcTemp} /> */}

      {/* SP Tracker Field */}
      {/* <Grid
        sx={{
          position: "fixed",
          top: 120,
          right: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          zIndex: 10,
        }}
      > */}
      {/* SP Tracker Field */}
      {/* <ExplainSkillsSimplified npc={npcTemp} />
      </Grid> */}

      {/* Save Button, shown if there are unsaved changes */}
      {isUpdated && (
        <Grid style={{ position: "fixed", bottom: 65, right: 10, zIndex: 100 }}>
          <Fade in={showScrollTop} timeout={300}>
            <Tooltip title="Save" placement="bottom">
              <Fab
                color="primary"
                aria-label="save"
                onClick={() => {
                  setIsUpdated(false);
                  setDoc(ref, npcTemp);
                }}
                disabled={!isUpdated}
                size="medium"
                style={{ marginLeft: "5px" }}
              >
                <Save />
              </Fab>
            </Tooltip>
          </Fade>
        </Grid>
      )}

      {/* Move to Top Button */}
      <Grid style={{ position: "fixed", bottom: 15, right: 10, zIndex: 100 }}>
        <Fade in={showScrollTop} timeout={300}>
          <Fab
            color="primary"
            aria-label="move-to-top"
            onClick={handleMoveToTop}
            size="medium"
          >
            <ArrowUpward />
          </Fab>
        </Fade>
      </Grid>
    </Layout>
  );
}
