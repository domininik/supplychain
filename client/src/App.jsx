import React from 'react';
import Web3 from 'web3';
import { Container, Segment, Grid, Divider, Message } from 'semantic-ui-react';
import HeaderIcon from './HeaderIcon';
import NewItemForm from './NewItemForm';
import SearchItem from './SearchItem';
import ItemManager from './contracts/ItemManager.json';

class App extends React.Component {
  state = {
    owner: '',
    account: '',
    itemIndex: 0,
    web3: null,
    notification: ''
  }

  componentDidMount () {
    if (typeof web3 !== 'undefined') {
      this.initialize();
    } else {
      console.log('ERROR: web3 is undefined');
    }
  }

  async initialize() {
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const accounts = await web3.eth.requestAccounts();
    const networkID = await web3.eth.net.getId();
    let address, contract;

    try {
      address = ItemManager.networks[networkID].address;
      contract = new web3.eth.Contract(ItemManager.abi, address);
    } catch (err) {
      console.error(err);
    }

    this.setState({
      web3: web3,
      account: accounts[0],
      contract: contract,
      owner: await contract.methods.owner().call(),
      itemIndex: await contract.methods.itemIndex().call()
    });

    contract.events.StatusChange()
      .on('data', (event) => {
        const index = event.returnValues.index;
        const status = event.returnValues.status;
        const notification = `Item with index ${index} changed status to ${status}`;

        this.setState({ notification: notification });
      });
  }

  render() {
    return (
      <Container style={{marginTop: 10}}>
        <HeaderIcon />
        {
          this.state.account && this.state.account === this.state.owner ? (
            <React.Fragment>
              {
                this.state.notification ? (
                  <Message positive>
                    <Message.Header>{this.state.notification}</Message.Header>
                  </Message>
                ) : null
              }
              <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                  <Grid.Column verticalAlign='middle'>
                    <SearchItem
                      itemIndex={this.state.itemIndex}
                      contract={this.state.contract}
                      web3={this.state.web3}
                      account={this.state.account}
                    />
                  </Grid.Column>
                  <Grid.Column verticalAlign='middle'>
                    <NewItemForm
                      account={this.state.account}
                      contract={this.state.contract}
                    />
                  </Grid.Column>
                </Grid>
                <Divider vertical>Or</Divider>
              </Segment>
            </React.Fragment>
          ) : (
            <Message warning>
              <Message.Header>You are not authorized to access this page</Message.Header>
              {
                this.state.account ? (
                  <p>Your current account is {this.state.account}, switch to proper account</p>
                ) : (
                  <p>Please enable MetaMask and select proper network and account</p>
                )
              }
            </Message>
          )
        }
      </Container>
    );
  }
}

export default App;
