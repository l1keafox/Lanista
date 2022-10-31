import React, {  useEffect } from "react";
import Container from '@mui/material/Container';
// stylesheet
import { useQuery } from "@apollo/client";

// components
import Login from "../../components/Login/Login.js";
import CreateAccount from "../../components/CreateAccount/CreateAccount.js";

// user context
import auth from "../../utils/auth";

function HomePage() {

  return (
    <Container >
      {auth.loggedIn() ? <Login /> : <CreateAccount />}
    </Container>
  );
}
export default HomePage;
