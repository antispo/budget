import React from 'react';

import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import AddSharpIcon from '@material-ui/icons/AddSharp';

export const AddEntryForm = props => {
  return (
    <Container style={{ marginBottom: 10 }}>
      <form onSubmit={props.addEntry}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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
                    name="budgeted"
                    type="number"
                    label="Budgeted"
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                  >
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
