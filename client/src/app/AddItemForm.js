import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export const AddItemForm = props => {
  return (
    <form onSubmit={props.action} className="form">
      <Grid container style={{ flexGrow: 1 }}>
        {props.fields.map((field, key) => {
          return (
            <Grid item key={key} xs>
              <TextField
                autoComplete={0}
                key={key}
                name={field.name}
                label={field.ph}
              />
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
