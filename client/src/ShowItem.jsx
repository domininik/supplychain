import React from 'react';
import { Segment, Button, Message } from 'semantic-ui-react';

class ShowItem extends React.Component {
  state = {
    price: null,
    itemContract: null,
    errorMessage: ''
  }

  async componentDidMount () {
    const web3 = this.props.web3;
    const address = this.props.address;
    const artifact = require('./contracts/Item.json');
    const itemContract = new web3.eth.Contract(artifact.abi, address);

    this.setState({ itemContract: itemContract });
  }

  viewMore = async (event) => {
    event.preventDefault();

    try {
      const price = await this.state.itemContract.methods.price().call();
      this.setState({ price: price });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }

  markItemAsPaid = async () => {
    try {
      await this.props.contract.methods
        .markItemAsPaid(this.props.index)
        .send({ from: this.props.account });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }

  markItemAsDelivered = async () => {
    try {
      await this.props.contract.methods
        .markItemAsDelivered(this.props.index)
        .send({ from: this.props.account });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }

  withdrawAll = async () => {
    try {
      await this.state.itemContract.methods
        .withdrawAll()
        .send({ from: this.props.account });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }

  render() {
    return(
      <Segment.Group>
        <Segment>identifier: {this.props.identifier}</Segment>
        <Segment>status: {this.props.status}</Segment>
        <Segment>address: {this.props.address}</Segment>
        {
          this.state.price ? (
            <Segment>price: {this.state.price} wei</Segment>
          ) : (
            <Segment><a href='/' onClick={this.viewMore}>view more</a></Segment>
          )
        }
        {
          this.props.status === '0' ? (
            <Segment>
              <Button primary onClick={this.markItemAsPaid}>mark as paid</Button>
            </Segment>
          ) : null
        }
        {
          this.props.status === '1' ? (
            <Segment>
              <Button.Group widths='2'>
                <Button primary onClick={this.markItemAsDelivered}>mark as delivered</Button>
                <Button primary onClick={this.withdrawAll}>withdraw money</Button>
              </Button.Group>
            </Segment>
          ) : null
        }
        {
          this.state.errorMessage ? (
            <Segment>
              <Message error header="Oops!" content={this.state.errorMessage} />
            </Segment>
          ) : null
        }
      </Segment.Group>
    );
  }
}

export default ShowItem;
