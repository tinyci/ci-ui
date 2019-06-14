import React from 'react';
import Client from '../../lib/client/client';
import * as format from '../../lib/table-formatters';

import {handleError} from '../error-messages';
import Loading from '../loading';

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

const tableColumns = [
  {
    title: 'Repository',
    name: 'repository',
  },
  {
    title: 'Ref Info',
    name: 'ref',
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
];
const globalColumnExtensions = [
  {
    columnName: 'repository',
    width: 0.3,
  },
  {
    columnName: 'ref',
    width: 0.25,
  },
  {
    columnName: 'path',
    width: 0.1,
  },
  {
    columnName: 'runs',
    width: 0.05,
  },
  {
    columnName: 'status',
    width: 0.1,
  },
  {
    columnName: 'history',
    width: 0.15,
  },
];

class TaskList extends React.Component {
  state = {
    totalCount: 0,
    pageSize: 20,
    pageSizes: [1, 5, 10, 20, 40],
    currentPage: 0,
    loading: true,
    tasks: [],
    rerender: 0,
  };

  client = new Client();
  refreshInterval = null;

  changeCurrentPage(pg) {
    this.setState({currentPage: pg});
  }

  changePageSize(pz) {
    this.setState({pageSize: pz});
  }

  fetchTasks(repository, sha) {
    this.client.tasksCountGet(
      {repository: repository, sha: sha},
      (err, count) => {
        if (!handleError(err)) {
          this.setState({totalCount: count});
        }
      },
    );

    this.client.tasksGet(
      {
        repository: repository,
        sha: sha,
        page: this.state.currentPage,
        perPage: this.state.pageSize,
      },
      (err, tasks) => {
        if (!handleError(err)) {
          var taskList = tasks.map(elem => ({
            id: elem.id,
            repository: {
              name: elem.ref.repository.name,
              parentName: elem.parent.name,
            },
            // small hack to get the repo in with the ref
            ref: elem.ref,
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
        }
      },
    );
  }

  componentWillMount() {
    var repository = '';
    if (this.props.owner && this.props.repository) {
      repository = this.props.owner + '/' + this.props.repository;
    }

    this.refreshInterval = window.setInterval(
      this.fetchTasks.bind(this, repository),
      5000,
    );

    this.fetchTasks(repository, this.props.sha);
    window.addEventListener('resize', () => {
      this.setState({rerender: this.state.rerender + 1});
    });
  }

  componentWillUnmount() {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    var tableColumnExtensions = globalColumnExtensions.map(elem => {
      return {
        columnName: elem.columnName,
        width: window.innerWidth * elem.width,
      };
    });

    return (
      <Grid rows={this.state.tasks} columns={tableColumns}>
        <DataTypeProvider
          formatterComponent={format.repository}
          for={['repository']}
        />
        <DataTypeProvider formatterComponent={format.ref} for={['ref']} />
        <DataTypeProvider formatterComponent={format.text} for={['path']} />
        <DataTypeProvider formatterComponent={format.text} for={['runs']} />
        <DataTypeProvider formatterComponent={format.status} for={['status']} />
        <DataTypeProvider
          formatterComponent={format.history}
          for={['history']}
        />

        <PagingState
          currentPage={this.state.currentPage}
          onCurrentPageChange={this.changeCurrentPage.bind(this)}
          pageSize={this.state.pageSize}
          onPageSizeChange={this.changePageSize.bind(this)}
        />
        <CustomPaging totalCount={this.state.totalCount} />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow />
        <PagingPanel pageSizes={this.state.pageSizes} />
      </Grid>
    );
  }
}

export default TaskList;
