import React from 'react';
import { ListItems } from './ListItems';
import { ShowAddForm } from './ShowAddForm';

export class ItemsFormAndList extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <ShowAddForm
          addItem={this.props.addItem}
          action={this.props.action}
          what={this.props.items}
          fields={this.props.fields}
        />
        <ListItems
          fields={this.props.showFields}
          data={this.props.data}
          deleteItem={this.props.deleteItem}
          apiCall={this.props.apiCall}
          items={this.props.items}
          label={this.props.label}
        />
      </div>
    );
  }
}
