import React from "react";
import Web3 from "web3";
import { Container, Segment, Message } from 'semantic-ui-react'
import HeaderIcon from './HeaderIcon';
import NewItemForm from './NewItemForm';

class App extends React.Component {
  state = {
    owner: '',
    account: '',
    itemIndex: 0
  }

  async componentDidMount () {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    const networkID = await web3.eth.net.getId();
    const artifact = require("./contracts/ItemManager.json");
    const { abi } = artifact;
    let address, contract;

    try {
      address = artifact.networks[networkID].address;
      contract = new web3.eth.Contract(abi, address);
    } catch (err) {
      console.error(err);
    }

    this.setState({
      account: accounts[0],
      contract: contract,
      owner: await contract.methods.owner().call(),
      itemIndex: await contract.methods.itemIndex().call()
    });
  }

  render() {
    return (
      <Container style={{marginTop: 10}}>
        <HeaderIcon />
        {
          this.state.account === this.state.owner ? (
            <Segment>
              <p>Total number of items: {this.state.itemIndex}</p>
              <NewItemForm
                account={this.state.account}
                contract={this.state.contract}
              />
            </Segment>
          ) : (
            <Message warning>
              <Message.Header>You are not authorized to access this page</Message.Header>
              <p>Your current account is {this.state.account}</p>
            </Message>
          )
        }
      </Container>
    );
  }
}

export default App;
