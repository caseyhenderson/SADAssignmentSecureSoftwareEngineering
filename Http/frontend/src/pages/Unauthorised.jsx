import { Grid } from "@mui/material";
import dayjs from 'dayjs';
import log from 'loglevel';

export default function Unauthorised() {
    log.warn("Unauthorised page displayed at"+ dayjs().format());
    return (
      <div>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4}>
            <h2>
                Sorry, you are not authorised to access this page. 
                If you believe this is a mistake, please contact your system administrator.
            </h2>
          </Grid>
        </Grid>
      </div>
    );
}