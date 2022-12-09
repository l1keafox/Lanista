import "./App.css";

import React from "react";
import ExistingUserProvider from "./utils/existingUserContext";
import { useState, useEffect } from "react";
import LandingPage from "./pages/Landing/LandingPage.js";
import auth from "./utils/auth";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

const Pages = {
  landing: "landing",
};

const Modals = {
  create: "create",
  join: "join",
};

function App() {
  const [stage, setStage] = useState(Pages.landing);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [modalContent, changeModal] = useState(null);
  const [mapGroupId, setGroupId] = useState(null);
  let displayContent;

  useEffect(() => {
    setLoading(true);
    if (auth.loggedIn()) {
      setStage(Pages.profile);
    } else {
      console.log('Token invald?');
    }
  }, []); 

  function changeStage(nextStage) {
    console.log(" APP://Change stage", nextStage);
    if (nextStage === "logout") {
      auth.logout();
      return;
    }
    setLoading(false);

    setTimeout(() => {
      setStage(nextStage);
      setLoading(true);
    }, 500);
  }

  function mapSelect(groupId) {
    setGroupId(groupId);
    changeStage(Pages.map);
  }

  switch (stage) {
    case Pages.landing:
      displayContent = (
        <LandingPage isShowing={loading} changeStage={changeStage} />
      );
      break;
    default:
      displayContent = (
        <LandingPage isShowing={loading} changeStage={changeStage} />
      );
      break;
  }

  return (
    <>

        <ExistingUserProvider>
          {displayContent ?? <LandingPage isShowing={loading} />}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>{modalContent ?? <div /> }</Box>
          </Modal>
        </ExistingUserProvider>
    </>
  );
}

export default App;
