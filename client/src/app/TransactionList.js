import React from 'react';

import { findItemById } from './index';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { Container } from '@material-ui/core';

export const TransactionList = props => {
  const ts = props.ts.transactions.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  return (
    <Container style={{ marginBottom: 10 }}>
      <TableContainer component={Paper} elevation={3}>
        <Table with="100%" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Payee</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Ammount</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ts.map(t => {
              const payee = findItemById(props.ts.payees, t.payeeId);
              const accountFrom = findItemById(
                props.ts.accounts,
                t.accountIdFrom
              );
              const accountTo = findItemById(props.ts.accounts, t.accountIdTo);
              const category = findItemById(props.ts.categories, t.categoryId);
              return (
                <TableRow key={t._id} id={t._id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payee !== undefined ? payee.name : ''}</TableCell>
                  <TableCell>
                    {accountFrom !== undefined ? accountFrom.name : ''}
                  </TableCell>
                  <TableCell>
                    {accountTo !== undefined ? accountTo.name : ''}
                  </TableCell>
                  <TableCell>
                    {category !== undefined ? category.name : ''}
                  </TableCell>
                  <TableCell align="right">{t.ammount}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => {
                        props.deleteTransaction(t._id);
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
