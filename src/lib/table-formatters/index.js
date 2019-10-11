import React from 'react';
import strftime from 'strftime';

import Client from '../client/client';
import {handleError} from '../../components/error-messages';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';

import LinkIcon from '@material-ui/icons/Link';
import FilterIcon from '@material-ui/icons/Filter';
import CancelIcon from '@material-ui/icons/Cancel';

import {withStyles} from '@material-ui/core/styles';

const thisClient = new Client();

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.backgroundColor,
    color: theme.palette.common.black,
    fontWeight: 'bolder',
    fontSize: '1.2em',
    borderBottom: 'none',
  },
  body: {
    fontSize: 14,
    borderBottom: 'none',
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const prettyBranch = value => value.ref_name.replace(/^(?:refs\/)?heads\//, '');

const branchLink = value =>
  new URL(
    'https://github.com/' +
      value.head_ref.repository.name +
      '/tree/' +
      prettyBranch(value.head_ref),
  ).toString();

const shaLink = value =>
  new URL(
    'https://github.com/' +
      value.head_ref.repository.name +
      '/tree/' +
      value.head_ref.sha,
  ).toString();

export const taskName = ({value}) => (
  <Button color="primary" variant="outlined" href={'/runs/' + value.id}>
    <Typography>{value.path}</Typography>
  </Button>
);

export const taskRuns = ({value}) => <Typography>{value.count}</Typography>;

export const submissionLinks = ({value}) => (
  <Table size="small">
    <TableBody>
      {value.ticket.id !== null ? (
        <StyledTableRow>
          <StyledTableCell>
            <Typography>Ticket ID</Typography>
          </StyledTableCell>
          <StyledTableCell>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                window.open(
                  'https://github.com/' +
                    value.ticket.repository.name +
                    '/pull/' +
                    value.ticket.id,
                );
              }}>
              <Typography>{value.ticket.id}</Typography>
            </Button>
          </StyledTableCell>
        </StyledTableRow>
      ) : null}
      <StyledTableRow>
        <StyledTableCell style={{width: '30%'}}>
          <Typography>Tasks</Typography>
        </StyledTableCell>
        <StyledTableCell style={{width: '70%'}}>
          <Button
            color="primary"
            variant="contained"
            href={'/tasks/' + value.id}>
            <Typography>{value.tasks_count}</Typography>
          </Button>
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell>
          <Typography>Runs</Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Button
            color="primary"
            variant="contained"
            href={'/submission/' + value.id + '/runs'}>
            <Typography>{value.runs_count}</Typography>
          </Button>
        </StyledTableCell>
      </StyledTableRow>
    </TableBody>
  </Table>
);

export const submissionInfo = ({value}) => {
  var filter_link = '/submissions/' + value.base_ref.repository.name;
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell style={{width: '50%'}}>
              {value.head_ref.repository.name}
              <Tooltip title="Filter for tests against the base repository">
                <IconButton href={filter_link}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </StyledTableCell>
            <StyledTableCell style={{width: '50%'}}>
              <Link href={branchLink(value)}>
                {prettyBranch(value.head_ref)}
              </Link>
              <Tooltip title="Go to Github at the SHA of this test">
                <IconButton href={shaLink(value)}>
                  <LinkIcon />
                </IconButton>
              </Tooltip>
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {value.base_ref.id !== value.head_ref.id ? (
            <React.Fragment>
              <StyledTableRow>
                <StyledTableCell>
                  <Typography>Parent:</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>{value.base_ref.repository.name}</Typography>
                </StyledTableCell>
              </StyledTableRow>
            </React.Fragment>
          ) : null}
          {value.base_ref !== null &&
          prettyBranch(value.base_ref) !== 'master' ? (
            <React.Fragment>
              <StyledTableRow>
                <StyledTableCell>
                  <Typography>Parent Branch:</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>{prettyBranch(value.base_ref)}</Typography>
                </StyledTableCell>
              </StyledTableRow>
            </React.Fragment>
          ) : null}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export const refLink = ({value}) => {
  var pretty_branch = value.ref_name.replace(/^(?:refs\/)?heads\//, '');
  var branch_link = new URL(
    'https://github.com/' + value.repository.name + '/tree/' + pretty_branch,
  ).toString();
  var sha_link = new URL(
    'https://github.com/' + value.repository.name + '/tree/' + value.sha,
  ).toString();

  return (
    <Grid container spacing={1} style={{textAlign: 'center'}}>
      <Grid item xs={12}>
        <Tooltip title={pretty_branch}>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            href={branch_link}>
            Branch
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <Tooltip title={value.sha.substring(0, 8)}>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            href={sha_link}>
            SHA
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
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

  var filter_link = '/submissions/' + value.repository.name + '/' + value.sha;
  return (
    <Box style={{bottom: '2em'}}>
      <Tooltip title="Filter for this SHA">
        <IconButton size="small" color="secondary" href={filter_link}>
          <FilterIcon />
        </IconButton>
      </Tooltip>
      &nbsp;&nbsp;
      <Tooltip title={value.ref_name}>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          href={branch_link}>
          {pretty_branch}
        </Button>
      </Tooltip>
      &nbsp;&nbsp;
      <Tooltip title={value.sha}>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          href={sha_link}>
          {value.sha.substring(0, 8)}
        </Button>
      </Tooltip>
    </Box>
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
    case 'submission':
      thisClient.submissionIdCancelPost(value.submission_id, (err, _, resp) => {
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

    if (value.status === undefined || value.status === null) {
      return (
        <Tooltip title="Cancel">
          <Box
            container="span"
            style={Object.assign(
              {
                margin: 0,
                padding: 0,
                backgroundColor: value.started_at ? yellow[900] : 'inherit',
              },
              statusButtonStyle,
            )}>
            <IconButton
              size="small"
              style={{color: value.started_at ? 'white' : 'black'}}
              onClick={() => {
                cancelThing(value, value.type);
              }}>
              <CancelIcon size="small" />
            </IconButton>
            <Typography
              display="inline"
              style={{color: value.started_at ? 'white' : 'black'}}>
              {value.started_at ? 'Running' : 'Unstarted'}
            </Typography>
          </Box>
        </Tooltip>
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

export const history = ({value}) => (
  <Grid container>
    <Grid item xs={6}>
      <Typography variant="subtitle2" style={{color: blue[800]}}>
        <b>Created</b>
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2">{dateFormat(value.created_at)}</Typography>
    </Grid>
    {value.started_at ? (
      <React.Fragment>
        <Grid item xs={6}>
          <Typography variant="subtitle2" style={{color: yellow[900]}}>
            <b>Started</b>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            {dateFormat(value.started_at)}
          </Typography>
        </Grid>
      </React.Fragment>
    ) : null}
    {value.finished_at ? (
      <React.Fragment>
        <Grid item xs={6}>
          <Typography variant="subtitle2" style={{color: 'black'}}>
            <b>Finished</b>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            {dateFormat(value.finished_at)}
          </Typography>
        </Grid>
      </React.Fragment>
    ) : null}
  </Grid>
);

export const log = ({value}) => {
  return value.started ? (
    <Button variant="contained" href={'/log/' + value.run_id}>
      {value.run_id}
    </Button>
  ) : (
    ''
  );
};

export const ticket = ({value}) =>
  value.id !== null ? (
    <Button
      color="secondary"
      variant="contained"
      href={
        'https://github.com/' + value.repository.name + '/pull/' + value.id
      }>
      <Typography>{value.id}</Typography>
    </Button>
  ) : null;
