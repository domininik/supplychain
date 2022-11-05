import React from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

class NewItemForm extends React.Component {
  state = {
    errorMessage: '',
    loading: false,
    identifier: '',
    price: ''
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });

    const account = this.props.account;
    const contract = this.props.contract;

    try {
      await contract.methods
        .createItem(this.state.identifier, this.state.price)
        .send({ from: account });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Identifier</label>
          <Input
            value={this.state.identifier}
            onChange={(e) => this.setState({ identifier: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <label>Price (in wei)</label>
          <Input
            value={this.state.price}
            onChange={(e) => this.setState({ price: e.target.value })}
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary type='submit' loading={this.state.loading}>Add Item</Button>
      </Form>
    )
  }
}

export default NewItemForm;
