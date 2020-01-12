import React from 'react';

import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';

import Button from '@material-ui/core/Button';
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export class EditItemPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    // console.log(props.item);
  }
  handleChange(id, name) {
    this.props.item.onChange(id, name, this.props.items);
  }
  handleClose = () => {
    this.props.item.saveAction(
      this.props.item._id,
      this.props.item.name,
      this.props.item.editAction
    );
    this.setState({ visible: false });
  };
  handleShow = () => {
    this.setState({ visible: true });
  };
  deleteItem = id => {
    this.props.deleteItem(id, this.props.items, this.props.action);
    this.setState({ visible: false });
  };
  render() {
    return (
      <React.Fragment>
        <Button color="primary" onClick={this.handleShow} size="small">
          {this.props.item.name}
        </Button>
        <Modal show={this.state.visible} onHide={this.handleClose}>
          <Modal.Body>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  value={this.props.item.name}
                  label={this.props.label}
                  onChange={e => {
                    this.handleChange(this.props.item._id, e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  onClick={this.handleClose}
                  color="primary"
                >
                  Done
                </Button>
              </Grid>
              <Grid item xs={2} align="right">
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    this.deleteItem(this.props.item._id);
                  }}
                >
                  <DeleteSharpIcon></DeleteSharpIcon>
                </Button>
              </Grid>
            </Grid>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}
