import React from 'react';
import strftime from 'strftime';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export const ref = ({value}) => {
  var pretty_branch = value.ref_name.replace(/^(?:refs\/)?heads\//, '');
  var branch_link =
    'https://github.com/' + value.repository.name + '/tree/' + pretty_branch;
  var sha_link =
    'https://github.com/' + value.repository.name + '/tree/' + value.sha;

  return (
    <React.Fragment>
      <Box component="span">
        <Tooltip title={value.ref_name}>
          <Button variant="outlined" color="primary" href={branch_link}>
            {pretty_branch}
          </Button>
        </Tooltip>
      </Box>{' '}
      <Box component="span">
        <Tooltip title={value.sha}>
          <Button variant="outlined" color="primary" href={sha_link}>
            {value.sha.substring(0, 8)}
          </Button>
        </Tooltip>
      </Box>
    </React.Fragment>
  );
};

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
