import React from 'react';
import { Paper, Container, Typography, Grid } from '@material-ui/core';
export const TotalList = props => {
  return (
    <div>
      {props.budget._id} | {props.budget.name} | {props.budget.total}
    </div>
  );
};

const bothStyles = {
  paddingLeft: 10,
  paddingRight: 10
};
const leftStyle = {
  textAlign: 'right',
  ...bothStyles
};
const rightStyle = {
  textAlign: 'left',
  ...bothStyles
};
export const BudgetList = props => {
  return (
    <Grid container>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <Container component={Paper} elevation={3}>
          <Grid container>
            <Grid item xs={6} style={leftStyle}>
              <Typography>Available:</Typography>
            </Grid>
            <Grid item xs style={rightStyle}>
              <Typography>{props.budget.currentState}</Typography>
            </Grid>
            <Grid item xs={6} style={leftStyle}>
              <Typography>Budgeted:</Typography>
            </Grid>
            <Grid item xs style={rightStyle}>
              <Typography>{props.budget.budgeted}</Typography>
            </Grid>
            <Grid item xs={6} style={leftStyle}>
              <Typography> Activity:</Typography>
            </Grid>
            <Grid item xs style={rightStyle}>
              <Typography>{props.budget.activity}</Typography>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
};
