import React from 'react';
import strftime from 'strftime';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const dateFormat = date => {
  if (!date) {
    return null;
  }

  return strftime('%m/%d/%Y %H:%M', new Date(date));
};

export const text = ({value}) => <Typography>{value}</Typography>;

const statusButtonStyle = {
  borderRadius: '5px',
  width: 'auto',
  padding: '1em',
  color: 'white',
};

export const status = ({value}) => {
  if (value === null) {
    return <Typography>Unfinished</Typography>;
  }
  if (value) {
    return (
      <Box
        container="span"
        style={Object.assign({backgroundColor: green[300]}, statusButtonStyle)}>
        <Typography>Success</Typography>
      </Box>
    );
  } else {
    return (
      <Box
        container="div"
        style={Object.assign({backgroundColor: red[300]}, statusButtonStyle)}>
        <Typography>Failure</Typography>
      </Box>
    );
  }
};

export const history = ({value}) => {
  if (value.finished_at) {
    return <Typography>Finished: {dateFormat(value.finished_at)}</Typography>;
  } else if (value.started_at) {
    return (
      <Typography style={{color: yellow[800]}}>
        Started: {dateFormat(value.started_at)}
      </Typography>
    );
  }

  return (
    <Typography style={{color: blue[800]}}>
      Created: {dateFormat(value.created_at)}
    </Typography>
  );
};
