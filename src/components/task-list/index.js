import React from 'react';
import Client from '../../lib/client/client';
import {
  loadPaginationState,
  changePage,
  changePerPage,
} from '../../lib/pagination';
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

// these should add up to 1 or close to it
const globalColumnExtensions = [
  {
    columnName: 'repository',
    width: 0.25,
  },
  {
    columnName: 'ref',
    width: 0.25,
  },
  {
    columnName: 'path',
    width: 0.2,
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
    perPage: 20,
    perPageList: [1, 5, 10, 20, 40, 100],
    currentPage: 0,
    loading: true,
    tasks: [],
    rerender: 0,
  };

  client = new Client();
  refreshInterval = null;

  fetchTasks(repository, sha) {
    this.client.tasksGet(
      {
        repository: repository,
        sha: sha,
        page: this.state.currentPage,
        perPage: this.state.perPage,
      },
      (err, tasks) => {
        if (!handleError(err)) {
          var taskList = tasks.map(elem => ({
            id: elem.id,
            repository: {
              name: elem.ref.repository.name,
              parentName: elem.parent.name,
            },
            ref: elem.ref,
            path: elem.path === '.' ? '*root*' : elem.path,
            runs: {
              count: elem.runs,
              id: elem.id,
            },
            status: elem.status,
            history: {
              created_at: elem.created_at,
              started_at: elem.started_at,
              finished_at: elem.finished_at,
            },
          }));

          this.client.tasksCountGet(
            {repository: repository, sha: sha},
            (err, count) => {
              if (!handleError(err)) {
                this.setState({
                  tasks: taskList,
                  loading: false,
                  totalCount: count,
                });
              }
            },
          );
        }
      },
    );
  }

  componentDidMount() {
    var repository = '';
    if (this.props.owner && this.props.repository) {
      repository = this.props.owner + '/' + this.props.repository;
    }

    this.refreshInterval = window.setInterval(
      this.fetchTasks.bind(this, repository, this.props.sha),
      5000,
    );

    loadPaginationState(this);
    this.fetchTasks(repository, this.props.sha);
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

    var minWidth = this.props.minWidth;
    var tableColumnExtensions = globalColumnExtensions.map(elem => {
      return {
        columnName: elem.columnName,
        width: minWidth * elem.width,
      };
    });

    return (
      <div style={{minWidth: minWidth, overflowX: 'scroll'}}>
        <Grid rows={this.state.tasks} columns={tableColumns}>
          <DataTypeProvider
            formatterComponent={format.repository}
            for={['repository']}
          />
          <DataTypeProvider formatterComponent={format.ref} for={['ref']} />
          <DataTypeProvider formatterComponent={format.text} for={['path']} />
          <DataTypeProvider formatterComponent={format.runs} for={['runs']} />
          <DataTypeProvider
            formatterComponent={format.status}
            for={['status']}
          />
          <DataTypeProvider
            formatterComponent={format.history}
            for={['history']}
          />

          <PagingState
            currentPage={this.state.currentPage}
            onCurrentPageChange={changePage(this)}
            pageSize={this.state.perPage}
            onPageSizeChange={changePerPage(this)}
          />
          <CustomPaging totalCount={this.state.totalCount} />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow />
          <PagingPanel pageSizes={this.state.perPageList} />
        </Grid>
      </div>
    );
  }
}

export default TaskList;
