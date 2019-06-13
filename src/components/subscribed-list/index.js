import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class SubscribedList extends React.Component {
  render() {
    return (
      <List style={{zIndex: 2, width: '35%'}}>
        {this.props.subscribed.map(elem => (
          <ListItem
            button
            onClick={this.props.handleSelect.bind(this.props.mainui, elem)}
            key={elem.name}>
            <ListItemText>{elem.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default SubscribedList;
