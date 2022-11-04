import "./App.css";
import React from "react";
import Web3 from "web3";

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
      owner: await contract.methods.owner().call(),
      itemIndex: await contract.methods.itemIndex().call()
    });
  }

  render() {
    return (
      <div id="App" >
        <div className="container">
          <p>Contract owner is {this.state.owner}</p>
          <p>And Your account is {this.state.account}</p>
          <p>Number of items: {this.state.itemIndex}</p>
        </div>
      </div>
    );
  }
}

export default App;
