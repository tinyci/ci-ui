import React from 'react';

import muiTheme from '../../muitheme.js';

import Typography from '@material-ui/core/Typography';

export const topBorder = '1px solid ' + muiTheme.palette.primary.light;

const topStyle = {
  width: '100%',
  height: '100%',
  borderRight: topBorder,
  paddingTop: '1em',
  paddingBottom: '1em',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
  OUserSelect: 'none',
};

export const TopButton = props => (
  <React.Fragment>
    <div
      style={Object.assign(
        {cursor: props.onClick ? 'pointer' : 'inherit'},
        topStyle,
      )}
      onClick={props.onClick}>
      {props.icon ? (
        <span style={{float: 'left', marginLeft: '1em'}}>{props.icon}</span>
      ) : (
        ''
      )}
      <Typography
        style={{float: props.icon ? 'right' : 'none', marginRight: '1em'}}>
        {props.flavor}
      </Typography>
    </div>
  </React.Fragment>
);
