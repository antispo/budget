import React from 'react';
import Modal from 'react-bootstrap/Modal';

import Button from '@material-ui/core/Button';
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp';
import Grid from '@material-ui/core/Grid';

import { AddItemForm } from './AddItemForm';
import { Typography } from '@material-ui/core';

export class ShowAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }
  showAddForm = () => {
    this.setState({ visible: true });
  };
  handleClose = () => {
    this.setState({ visible: false });
  };
  render() {
    return (
      <Grid container>
        <Grid item xs={10}>
          <Typography variant="h6">
            {this.props.what.charAt(0).toUpperCase() + this.props.what.slice(1)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button color="primary" onClick={this.showAddForm}>
            <AddBoxSharpIcon></AddBoxSharpIcon>
          </Button>
        </Grid>

        <Modal show={this.state.visible} onHide={this.handleClose}>
          {/* <Modal.Header closeButton>
            <Modal.Title>{this.props.fields[0].ph}</Modal.Title>
          </Modal.Header> */}
          <Modal.Body>
            <AddItemForm
              action={e => {
                this.props.addItem(
                  e,
                  this.props.action,
                  this.props.fields,
                  this.props.what
                );
                this.handleClose();
              }}
              fields={this.props.fields}
            />
            {/* <Button variant="contained" onClick={this.handleClose}>
              Close
            </Button> */}
          </Modal.Body>
        </Modal>
      </Grid>
    );
  }
}
