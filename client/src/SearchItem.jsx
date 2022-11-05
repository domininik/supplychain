import React from 'react';
import { Form, Input, Message, Segment } from 'semantic-ui-react';
import ShowItem from './ShowItem';

class SearchItem extends React.Component {
  state = {
    errorMessage: '',
    itemData: null,
    index: ''
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '' });

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
            <Segment.Group>
              <Segment>identifier: {this.state.itemData.identifier}</Segment>
              <Segment>status: {this.state.itemData.status}</Segment>
              <Segment>address: {this.state.itemData.item}</Segment>
              <ShowItem
                address={this.state.itemData.item}
                web3={this.props.web3}
              />
            </Segment.Group>
          ) : null
        }
      </div>
    )
  }
}

export default SearchItem;
