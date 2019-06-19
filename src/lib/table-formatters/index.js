import React from 'react';
import strftime from 'strftime';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import FilterIcon from '@material-ui/icons/Filter';

export const runs = ({value}) => {
  return (
    <Button color="primary" variant="contained" href={'/runs/' + value.id}>
      <Typography>{value.count}</Typography>
    </Button>
  );
};

export const repository = ({value}) => {
  var filter_link = '/tasks/' + value.name;
  var parent_extra =
    value.parentName !== '' && value.name !== value.parentName
      ? ' (fork of ' + value.parentName + ')'
      : '';
  return (
    <React.Fragment>
      <Tooltip title={'Filter by this repository' + parent_extra}>
        <Button variant="outlined" color="primary" href={filter_link}>
          {value.name}
        </Button>
      </Tooltip>
    </React.Fragment>
  );
};

export const ref = ({value}) => {
  var pretty_branch = value.ref_name.replace(/^(?:refs\/)?heads\//, '');

  var branch_link = new URL(
    'https://github.com/' + value.repository.name + '/tree/' + pretty_branch,
  ).toString();

  var sha_link = new URL(
    'https://github.com/' + value.repository.name + '/tree/' + value.sha,
  ).toString();

  var filter_link = '/tasks/' + value.repository.name + '/' + value.sha;
  return (
    <React.Fragment>
      <Tooltip title="Filter for this SHA">
        <IconButton href={filter_link}>
          <FilterIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={value.ref_name}>
        <Button variant="outlined" color="primary" href={branch_link}>
          {pretty_branch}
        </Button>
      </Tooltip>{' '}
      <Tooltip title={value.sha}>
        <Button variant="outlined" color="primary" href={sha_link}>
          {value.sha.substring(0, 8)}
        </Button>
      </Tooltip>
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
  if (value === undefined) {
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
    return (
      <React.Fragment>
        <Box>
          <Typography>
            <b>Finished:</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{dateFormat(value.finished_at)}</Typography>
        </Box>
      </React.Fragment>
    );
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

export const log = ({value}) => {
  return value.started ? (
    <Button variant="contained" href={'/log/' + value.run_id}>
      {value.run_id}
    </Button>
  ) : (
    ''
  );
};
