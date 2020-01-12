import React from 'react';

import { findItemById } from './index';

import {
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField
} from '@material-ui/core';

import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';

export const EntryList = props => {
  return (
    <Container style={{ marginBottom: 10 }}>
      <TableContainer component={Paper} elevation={3}>
        <Table style={{ width: '100%' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Budgeted</TableCell>
              <TableCell align="right">Activity</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.es.map(e => {
              const category = findItemById(props.budget, e.categoryId);
              return (
                <TableRow key={e._id} id={e._id}>
                  <TableCell>
                    {category !== undefined ? category.name : 'NO_CATEGORY'}
                  </TableCell>
                  <TableCell>
                    <TextField
                      className="makeItGreen"
                      type="number"
                      value={e.budgeted}
                      onChange={ev => {
                        console.log(ev.target.value);
                        let x = isNaN(parseInt(ev.target.value, 10))
                          ? 0
                          : ev.target.value;
                        props.handleChange(e, x);
                      }}
                      onBlur={() => {
                        props.onBlur(e);
                      }}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </TableCell>
                  <TableCell align="right">{e.activitySum}</TableCell>
                  <TableCell align="right">{e.available}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="secondary"
                      className="btn btn-danger"
                      onClick={() => {
                        props.deleteEntry(e._id);
                      }}
                    >
                      <DeleteForeverSharpIcon fontSize="small"></DeleteForeverSharpIcon>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
