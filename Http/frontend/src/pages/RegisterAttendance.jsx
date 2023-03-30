import { useEffect } from "react";
import * as DOMPurify from 'dompurify';
import { Button, Grid, TextField, FormControl } from "@mui/material";
import { fetchToken } from "../store";
import dayjs from 'dayjs';
import log from 'loglevel';
import useLogout from "../components/autoLogout"

import { useState } from "react";

export default function RegisterAttendance() {
  const [code, setCode] = useState("");
  const [submitColourButton, setSubmitColourButton] = useState("primary");
  // autoLogout hook
  useLogout();

  // code is sanitised here using DOMPurify
  const handleCodeChange = (event) => {
    setSubmitColourButton("primary");
    setCode(DOMPurify.sanitize(event.target.value));
    log.info("DOM Purify has sanitised the input to "+DOMPurify.sanitize(event.target.value)+" at "+dayjs().format());
  };

  const onSubmit = async () => {
    if (code === "") {
      setSubmitColourButton("error");
      log.error("Error generating code at "+ dayjs().format()+" . The code cannot be empty.");
      alert("The code cannot be empty");
    } else {
      var url = new URL(`${window.location.origin}/api/activeSessions/RecordStudentAttendance/${code}`);
      try{
        var request = await fetch(url,{
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${fetchToken().token}`,
            },
          });
          var body = await request.json();
    
          if(!body.Success){
            setSubmitColourButton("error");
            log.error("Error recording attendance at "+ dayjs().format());
            alert(`Failed to record attendance: ${body.Error}`);
          } else{
            log.info("Attendance successfully recorded at "+ dayjs().format()+". The code used was "+code);
            setSubmitColourButton("success");
          }
      } catch(err) {
        setSubmitColourButton("error");
        log.error("Error recording attendance at "+ dayjs().format());
        alert(`Failed to record attendance`);
      }
     

    }
  };

  return (
    <div className="RegisterAttendance">
      <FormControl
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <TextField
          sx={{ width: 300 }}
          variant="outlined"
          id="input-code"
          label="Code"
          onChange={handleCodeChange}
        />
        <Button
          sx={{ width: 300 }}
          variant="outlined"
          color={submitColourButton}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </FormControl>
    </div>
  );
}
