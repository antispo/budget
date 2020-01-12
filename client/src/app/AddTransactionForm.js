import React from 'react';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddSharpIcon from '@material-ui/icons/AddSharp';
import { TextField, MenuItem, Container } from '@material-ui/core';

export const AddTransactionForm = props => {
  return (
    <Container>
      <form onSubmit={props.addTransaction}>
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ marginBottom: 10 }}
        >
          <Table width="100%" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TextField
                    name="date"
                    type="text"
                    label="Date"
                    size="small"
                    style={{ width: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="payeeId"
                    select
                    style={{ width: 100 }}
                    label="Payee"
                  >
                    <MenuItem key="no-payee">None</MenuItem>
                    {props.payees.map(payee => {
                      return (
                        <MenuItem key={payee._id} value={payee._id} width={10}>
                          {payee.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    name="accFrom"
                    style={{ width: 150 }}
                    label="From"
                  >
                    <MenuItem key="no-account-from">None</MenuItem>
                    {props.accounts.map(account => {
                      return (
                        <MenuItem key={account._id} value={account._id}>
                          {account.name} ({account.balance})
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    name="accTo"
                    style={{ width: 150 }}
                    label="To"
                  >
                    <MenuItem key="no-account-to">None</MenuItem>
                    {props.accounts.map(account => {
                      return (
                        <MenuItem key={account._id} value={account._id}>
                          {account.name} ({account.balance})
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    name="category"
                    select
                    style={{ width: 100 }}
                    label="Category"
                  >
                    <MenuItem key="no-category">None</MenuItem>
                    {props.categories.map(category => {
                      return (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    name="ammount"
                    type="number"
                    label="amount"
                    inputProps={{
                      style: { textAlign: 'right', width: 80 }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" type="submit">
                    <AddSharpIcon fontSize="small"></AddSharpIcon>
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </form>
    </Container>
  );
};
