import React from 'react';

import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import grey from '@material-ui/core/colors/grey';

class SubscribedList extends React.Component {
  render() {
    return (
      <List
        style={{
          backgroundColor: grey[700],
          zIndex: 2,
          position: 'absolute',
          minWidth: '20%',
        }}>
        <ListItem>
          <ListItemText>Subscribed Repositories</ListItemText>
        </ListItem>
        {this.props.subscribed.map(elem => (
          <ListItem button key={elem.name}>
            {elem.all ? (
              <Link
                button
                color="secondary"
                style={{width: '100%', textDecoration: 'none'}}
                href="/">
                {elem.name}
              </Link>
            ) : (
              <Link
                color="secondary"
                style={{width: '100%', textDecoration: 'none'}}
                href={'/tasks/' + elem.name}>
                {elem.name}
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    );
  }
}

export default SubscribedList;
