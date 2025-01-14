import * as React from 'react';
import { useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import useLogout from "../components/autoLogout"

export default function Main() {
  // Selectors used to get the required data from Redux store.
  const user = useSelector((state) => state.user);
  const roles = useSelector((state) => state.roles);
  useLogout();
  
  // Material UI Grid component used for responsiveness and scaling on different screen sizes.
  // xs - extra-small, md - medium, etc
  // Provides responsive UI
  return (
    <div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={8} md={12} lg={24} xl={48}>
          <h2>
            {" "}
            Welcome, {user.fullname.firstname} {user.fullname.lastname}. You are logged in as {roles[0] ?? "Student"}.
            What would you like to do today?
          </h2>
        </Grid>
        <Grid item xs={4} sm={8} md={12} lg={24} xl={48}>
            <h2>
                Not you? Click below to logout of the attendance system.
            </h2>
        </Grid>

    </Grid>
    <Logout/>
    </div>
  );
}
