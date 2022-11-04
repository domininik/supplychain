import React from 'react';
import { Header, Icon } from 'semantic-ui-react'

const HeaderIcon = () => {
  return (
    <Header as='h2'>
      <Icon name='chain' />
      <Header.Content>
        SupplyChain
        <Header.Subheader>supply chain on blockchain</Header.Subheader>
      </Header.Content>
    </Header>
  )
}

export default HeaderIcon;
