import React from 'react';

import muiTheme from '../../muitheme.js';

import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader'; 

import MenuIcon from '@material-ui/icons/Menu';
import HelpIcon from '@material-ui/icons/Help';


class SidePanel extends React.Component {
  state = {
    drawerOpen: false,
  };

  toggleDrawer() {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  render() {
    return (
      <React.Fragment>
        <Button style={{ color: muiTheme.palette.primary.light }} onClick={this.toggleDrawer.bind(this)}><MenuIcon /></Button>
        <Drawer 
          anchor={'left'} 
          open={this.state.drawerOpen} 
          onClose={this.toggleDrawer.bind(this)}
        >
          <List
            style={{ 
              backgroundColor: muiTheme.palette.primary.dark, 
            }}
            divider={true}
            dense={true}
            subheader={
              <ListSubheader component="div" style={{ color: muiTheme.palette.primary.light }}>
                Other Destinations   
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemIcon><HelpIcon style={{ color: muiTheme.palette.primary.light }} /></ListItemIcon>
              <ListItemText>
                <Link style={{ color: muiTheme.palette.primary.light }} href="//tinyci.org/docs/intro" target="_blank" rel="noopener">Documentation</Link>
              </ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default SidePanel;
