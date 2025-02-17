import React, { useEffect, useState } from "react";
import { fetchToken } from "../../store";
import { Form, Field, Formik } from "formik";
import dayjs from 'dayjs';
import log from 'loglevel';
import { TextField, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import useLogout from "../../components/autoLogout"

export default function GenerateCode() {
  const [code, setCode] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [cohortsList, setCohortsList] = useState([]);
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  useLogout();

  useEffect(() => {
    fetch(`${window.location.origin}/api/modules/resource`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchToken().token}`
      },
    }).then((res) => res.json())
    .then((modules) => {
      if (modules.Success) {
        setModuleList(modules.Response.modules);
        for (let module of modules.Response.modules) {
          for (let attribute in module) {
            if (attribute == 'cohorts') {
              setCohortsList(module[attribute]);
            }
          }
        }
      }
    });
  }, []);

  const createSessionAndCode = async (requestBody) => {
    var newSessionRequest = await fetch(
      `${window.location.origin}/api/sessions/resource`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken().token}`,
        },
        body: JSON.stringify(requestBody)
      }
    );
    var newSession = await newSessionRequest.json();

    if (newSession.Success) {
      var sessionCode = newSession.Response;
      var newActiveSessionRequest = await fetch(
        `${window.location.origin}/api/activeSessions/GenerateNewActiveSession/${sessionCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fetchToken().token}`,
          }
        }
      );
      var generatedCode = await newActiveSessionRequest.json();
      if (generatedCode.Success) {
        log.info("Code when generated is: " + generatedCode.Response.code+" . Code was successfully generated at "+ dayjs().format());
        return generatedCode.Response.code;
      }
    } else {
      log.error("Failed to obtain code at"+dayjs().format());
      return "Failed to get code";
    }
  };

  return (
    <div className="GenerateCode">
      <Formik
        initialValues={{
          typeOfSession: '',
          moduleEl: '',
          cohortIdentifier: ''
        }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          var requestBody = {
            type: values.typeOfSession,
            module: values.moduleEl, 
            cohortIdentifier: values.cohortIdentifier,
            startDateTime: startTime.format(),
            endDateTime: endTime.format(),
          }
          var code = await createSessionAndCode(requestBody);
          setCode(code);
          setIsShown(true);
      
        }}
        // TODO: think a key needs to be added to list items
      >
        <Form>
          <Stack spacing={1}>
            <label htmlFor="typeOfSession">Type of session: </label>
            <Field as="select" name="typeOfSession">
              <option value=""></option>
              <option value="lecture">Lecture</option>
              <option value="seminar">Seminar</option>
            </Field>
            <label htmlFor="moduleEl">Module: </label>
            <Field as="select" name="moduleEl">
              <option value=""></option>
              {moduleList.map((module) => <option value={module._id}>{module.name}</option>)}
            </Field >
            <label htmlFor="cohortIdentifier">Cohort Identifier</label>
            <Field as="select" name="cohortIdentifier">
              <option value=""></option>
              {cohortsList.map((cohort) => <option value={cohort.name}>{cohort.identifier}</option>)}
            </Field>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Start Time"
                value={startTime}
                onChange={(value) => {
                  setStartTime(value);
                }}
              />
              <DesktopTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="End Time"
                value={endTime}
                onChange={(value) => {
                  setEndTime(value);
                }}
              />
            </LocalizationProvider>
            <button type="submit"> Start new session </button>
            {isShown && <h1 style={{ fontSize: "9rem" }}>{code}</h1>}
          </Stack>
        </Form>
      </Formik>
    </div>
  );
}