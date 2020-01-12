import React from 'react';

import { EditItemPopup } from './EditItemPopup';
import { Grid } from '@material-ui/core';

export const ListItems = props => {
  return (
    <React.Fragment>
      {props.data.map(item => {
        return (
          <Grid container key={item._id}>
            <Grid item align="left" xs={1}>
              <EditItemPopup
                item={item}
                deleteItem={props.deleteItem}
                items={props.items}
                action={props.apiCall}
                label={props.label}
              />
            </Grid>
            <Grid item xs>
              <Grid container>
                {props.fields.map((field, index) => {
                  return (
                    <Grid item key={index} xs align="left">
                      {field === 'balance' ? item[field] : ''}
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </React.Fragment>
  );
};
