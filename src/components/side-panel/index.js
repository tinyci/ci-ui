import React from "react";

import muiTheme from "../../muitheme.js";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuIcon from "@material-ui/icons/Menu";
import HelpIcon from "@material-ui/icons/Help";

class SidePanel extends React.Component {
  state = {
    drawerOpen: false,
  };

  toggleDrawer() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  render() {
    return (
      <React.Fragment>
        <IconButton onClick={this.toggleDrawer.bind(this)} color="secondary">
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor={"right"}
          open={this.state.drawerOpen}
          onClose={this.toggleDrawer.bind(this)}
        >
          <List
            style={{
              backgroundColor: muiTheme.palette.primary.main,
            }}
            divider={true}
            dense={true}
            subheader={
              <ListSubheader
                component="div"
                style={{
                  backgroundColor: muiTheme.palette.primary.dark,
                  color: muiTheme.palette.primary.light,
                }}
              >
                Other Destinations
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemIcon>
                <HelpIcon style={{ color: muiTheme.palette.primary.light }} />
              </ListItemIcon>
              <ListItemText>
                <Link
                  style={{ color: muiTheme.palette.primary.light }}
                  href="//tinyci.org/docs/intro"
                  target="_blank"
                  rel="noopener"
                >
                  Documentation
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default SidePanel;
