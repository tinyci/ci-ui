import React from 'react';
import strftime from 'strftime';
import Client from '../../lib/client/client';

import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import {
  PagingState,
  DataTypeProvider,
  CustomPaging,
} from '@devexpress/dx-react-grid';

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

const textFormatter = ({value}) => <Typography>{value}</Typography>;

const statusButtonStyle = {
  borderRadius: '5px',
  width: 'auto',
  padding: '1em',
  color: 'white',
};

const statusFormatter = ({value}) => {
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

const historyFormatter = ({value}) => {
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

class TaskList extends React.Component {
  state = {
    columns: [
      {
        title: 'Task ID',
        name: 'id',
      },
      {
        title: 'Section',
        name: 'path',
      },
      {
        title: 'Runs',
        name: 'runs',
      },
      {
        title: 'Status',
        name: 'status',
      },
      {
        title: 'History',
        name: 'history',
      },
    ],
    totalCount: 0,
    pageSize: 20,
    pageSizes: [1, 5, 10, 20, 40],
    currentPage: 0,
    loading: true,
    tasks: [],
  };

  client = new Client();
  refreshInterval = null;

  fetchTasks(repository) {
    this.client.tasksGet(
      {
        repository: repository,
        page: this.state.currentPage,
        perPage: this.state.pageSize,
      },
      (err, tasks) => {
        var taskList = tasks.map(elem => ({
          id: elem.id,
          repository: elem.parent.name,
          path: elem.path === '.' ? '*root*' : elem.path,
          runs: elem.runs,
          status: elem.status,
          history: {
            created_at: elem.created_at,
            started_at: elem.started_at,
            finished_at: elem.finished_at,
          },
        }));

        this.setState({tasks: taskList, loading: false});
      },
    );
  }

  componentWillMount() {
    var repository = '';
    if (this.props.owner && this.props.repository) {
      repository = this.props.owner + '/' + this.props.repository;
    } else {
      // add the repo column so it shows
      var cols = [
        {
          title: 'Repository',
          name: 'repository',
        },
      ].concat(this.state.columns);

      this.setState({columns: cols});
    }

    this.refreshInterval = window.setInterval(
      this.fetchTasks.bind(this, repository),
      5000,
    );

    this.fetchTasks(repository);
  }

  componentWillUnmount() {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={{height: '100%', marginTop: '25%'}}>
          <center>
            <img src="tiny-loading.gif" alt="" />
          </center>
        </div>
      );
    }

    return (
      <Grid rows={this.state.tasks} columns={this.state.columns}>
        <DataTypeProvider formatterComponent={textFormatter} for={['id']} />
        {!this.props.owner ? (
          <DataTypeProvider
            formatterComponent={textFormatter}
            for={['repository']}
          />
        ) : (
          ''
        )}
        <DataTypeProvider formatterComponent={textFormatter} for={['path']} />
        <DataTypeProvider formatterComponent={textFormatter} for={['runs']} />
        <DataTypeProvider
          formatterComponent={statusFormatter}
          for={['status']}
        />
        <DataTypeProvider
          formatterComponent={historyFormatter}
          for={['history']}
        />

        <PagingState
          currentPage={this.state.currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={this.state.pageSize}
          onPageSizeChange={this.changePageSize}
        />
        <CustomPaging totalCount={this.state.totalCount} />
        <Table />
        <TableHeaderRow />
        <PagingPanel pageSizes={this.state.pageSizes} />
      </Grid>
    );
  }
}

export default TaskList;
