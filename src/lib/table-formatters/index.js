import React from 'react';
import strftime from 'strftime';

import Client from '../client/client';
import {handleError} from '../../components/error-messages';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';

import FilterIcon from '@material-ui/icons/Filter';
import CancelIcon from '@material-ui/icons/Cancel';

const thisClient = new Client();

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
        <IconButton size="small" href={filter_link}>
          <FilterIcon />
        </IconButton>
      </Tooltip>
      &nbsp;&nbsp;
      <Tooltip title={value.ref_name}>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          href={branch_link}>
          {pretty_branch}
        </Button>
      </Tooltip>
      &nbsp;&nbsp;
      <Tooltip title={value.sha}>
        <Button size="small" variant="outlined" color="primary" href={sha_link}>
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

const cancelThing = value => {
  switch (value.type) {
    case 'task':
      thisClient.tasksCancelIdPost(value.task_id, (err, _, resp) => {
        handleError(err, resp);
      });
      break;
    case 'run':
      thisClient.cancelRunIdPost(value.run_id, (err, _, resp) => {
        handleError(err, resp);
      });
      break;
    default:
      handleError({message: 'unexpected api error in cancel code'}, null);
  }
};

export const status = ({value}) => {
  if (value.status) {
    return (
      <Box
        container="span"
        style={Object.assign({backgroundColor: green[300]}, statusButtonStyle)}>
        <Typography>Success</Typography>
      </Box>
    );
  } else {
    if (value.canceled) {
      return (
        <Box
          container="span"
          style={Object.assign(
            {backgroundColor: purple[300]},
            statusButtonStyle,
          )}>
          <Typography>Canceled</Typography>
        </Box>
      );
    }

    if (value.status === undefined) {
      return (
        <Box
          container="span"
          style={Object.assign(
            {
              margin: 0,
              padding: 0,
              backgroundColor: value.started_at ? yellow[800] : 'inherit',
            },
            statusButtonStyle,
          )}>
          <IconButton
            size="small"
            style={{width: '100%'}}
            onClick={() => {
              cancelThing(value, value.type);
            }}>
            <CancelIcon size="small" />
            &nbsp;&nbsp;
            <Typography>
              {value.started_at ? 'Running' : 'Unstarted'}
            </Typography>
          </IconButton>
        </Box>
      );
    }

    return (
      <Box
        container="span"
        style={Object.assign({backgroundColor: red[300]}, statusButtonStyle)}>
        <Typography>Failure</Typography>
      </Box>
    );
  }
};

const HistoryDetail = props => {
  return (
    <React.Fragment>
      <Box style={{color: props.color}}>
        <Typography variant="subtitle2">
          <b>{props.detail}:</b>
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2">{dateFormat(props.date)}</Typography>
      </Box>
    </React.Fragment>
  );
};

export const history = ({value}) => {
  if (value.finished_at) {
    return (
      <HistoryDetail color="black" detail="Finished" date={value.finished_at} />
    );
  } else if (value.started_at) {
    return (
      <HistoryDetail
        color={yellow[800]}
        detail="Started"
        date={value.started_at}
      />
    );
  }

  return (
    <HistoryDetail color={blue[800]} detail="Created" date={value.created_at} />
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
