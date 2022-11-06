import React from 'react';
import { Form, Input, Message } from 'semantic-ui-react';
import ShowItem from './ShowItem';

class SearchItem extends React.Component {
  state = {
    errorMessage: '',
    itemData: null,
    index: ''
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', itemData: null });

    const contract = this.props.contract;
    const index = this.state.index;

    try {
      const itemData = await contract.methods.items(index).call();
      this.setState({ itemData: itemData });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  render() {
    return(
      <div>
        <div className='field'>
          <p>Total number of items: {this.props.itemIndex}</p>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Input
              action={{ color: 'blue', content: 'Search' }}
              icon='search'
              iconPosition='left'
              placeholder='item index'
              value={this.state.index}
              onChange={(e) => this.setState({ index: e.target.value })}
            />
            <Message error header='Oops!' content={this.state.errorMessage} />
          </Form>
        </div>
        {
          this.state.itemData ? (
            <ShowItem
              index={this.state.index}
              identifier={this.state.itemData.identifier}
              status={this.state.itemData.status}
              address={this.state.itemData.item}
              web3={this.props.web3}
              account={this.props.account}
              contract={this.props.contract}
            />
          ) : null
        }
      </div>
    )
  }
}

export default SearchItem;
