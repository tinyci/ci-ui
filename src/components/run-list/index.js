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
    title: 'Status',
    name: 'status',
  },
  {
    title: 'History',
    name: 'history',
  },
  {
    title: 'Log',
    name: 'log',
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
    columnName: 'status',
    width: 0.1,
  },
  {
    columnName: 'history',
    width: 0.15,
  },
  {
    columnName: 'log',
    width: 0.05,
  },
];

class RunList extends React.Component {
  state = {
    totalCount: 0,
    perPage: 20,
    perPageList: [1, 5, 10, 20, 40, 100],
    currentPage: 0,
    loading: true,
    runs: [],
    rerender: 0,
  };

  client = new Client();
  refreshInterval = null;

  fetchRuns(id) {
    this.client.tasksRunsIdGet(
      id,
      {
        page: this.state.currentPage,
        perPage: this.state.perPage,
      },
      (err, runs, resp) => {
        if (!handleError(err, resp)) {
          var runList = runs.map(elem => ({
            repository: {
              name: elem.task.ref.repository.name,
              parentName: elem.task.parent.name,
            },
            ref: elem.task.ref,
            path: elem.name,
            status: {
              run_id: elem.id,
              status: elem.status,
              canceled: elem.task.canceled,
              type: 'run',
            },
            history: {
              created_at: elem.created_at,
              started_at: elem.started_at,
              finished_at: elem.finished_at,
            },
            log: {
              run_id: elem.id,
              started: !!elem.started_at,
            },
          }));

          this.client.tasksRunsIdCountGet(id, (err, count, resp) => {
            if (!handleError(err, resp)) {
              this.setState({totalCount: count, runs: runList, loading: false});
            }
          });
        }
      },
    );
  }

  componentWillMount() {
    this.refreshInterval = window.setInterval(
      this.fetchRuns.bind(this, this.props.task_id),
      5000,
    );

    loadPaginationState(this);
    this.fetchRuns(this.props.task_id);
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
        <Grid rows={this.state.runs} columns={tableColumns}>
          <DataTypeProvider
            formatterComponent={format.repository}
            for={['repository']}
          />
          <DataTypeProvider formatterComponent={format.ref} for={['ref']} />
          <DataTypeProvider formatterComponent={format.text} for={['path']} />
          <DataTypeProvider formatterComponent={format.log} for={['log']} />
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

export default RunList;
