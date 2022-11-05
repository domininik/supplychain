import React from 'react';
import { Segment } from 'semantic-ui-react';

class ShowItem extends React.Component {
  state = {
    price: null,
  }

  onClick = async (event) => {
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

  render() {
    return(
      <Segment>
        {
          this.state.price ? (
            <span>price: {this.state.price} wei</span>
          ) : (
            <a href='/' onClick={this.onClick}>view more</a>
          )
        }
      </Segment>
    );
  }
}

export default ShowItem;
