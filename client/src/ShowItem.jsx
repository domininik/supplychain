import React from 'react';
import { Segment, Button } from 'semantic-ui-react';

class ShowItem extends React.Component {
  state = {
    price: null
  }

  viewMore = async (event) => {
    event.preventDefault();

    const web3 = this.props.web3;
    const address = this.props.address;
    const artifact = require('./contracts/Item.json');
    const contract = new web3.eth.Contract(artifact.abi, address);

    try {
      const price = await contract.methods.price().call();
      this.setState({ price: price });
    } catch (err) {
      console.log(err.message);
    }
  }

  markItemAsPaid = async () => {
    try {
      await this.props.contract.methods
        .markItemAsPaid(this.props.index)
        .send({ from: this.props.account });
    } catch (err) {
      console.log(err.message);
    }
  }

  markItemAsDelivered = async () => {
    try {
      await this.props.contract.methods
        .markItemAsDelivered(this.props.index)
        .send({ from: this.props.account });
    } catch (err) {
      console.log(err.message);
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
              <Button primary onClick={this.markItemAsDelivered}>mark as delivered</Button>
            </Segment>
          ) : null
        }
      </Segment.Group>
    );
  }
}

export default ShowItem;
