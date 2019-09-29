import React from 'react';
import Client from '../../lib/client/client';
import {
  getPaginationState,
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
    title: 'Parent',
    name: 'parent',
  },
  {
    title: 'Base Ref',
    name: 'base_ref',
  },
  {
    title: 'Fork',
    name: 'fork',
  },
  {
    title: 'Head Ref',
    name: 'head_ref',
  },
  {
    title: 'Tasks',
    name: 'tasks',
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
    columnName: 'parent',
    width: 0.15,
  },
  {
    columnName: 'base_ref',
    width: 0.2,
  },
  {
    columnName: 'fork',
    width: 0.15,
  },
  {
    columnName: 'head_ref',
    width: 0.2,
  },
  {
    columnName: 'tasks',
    width: 0.1,
  },
  {
    columnName: 'status',
    width: 0.1,
  },
  {
    columnName: 'history',
    width: 0.1,
  },
];

class SubmissionList extends React.Component {
  state = {
    totalCount: 0,
    perPage: 20,
    perPageList: [5, 10, 20, 40, 100],
    currentPage: 0,
    loading: true,
    subs: [],
    rerender: 0,
  };

  repository = '';
  client = new Client();
  refreshInterval = null;

  fetchTasks(extraState) {
    extraState = Object.assign(this.state, extraState);
    this.client.submissionsGet(
      {
        repository: this.repository,
        sha: this.props.sha,
        page: extraState.currentPage,
        perPage: extraState.perPage,
      },
      (err, subs, resp) => {
        if (!handleError(err, resp)) {
          var subsList = subs.map(elem => ({
            id: elem.id,
            parent: {
              name: elem.base_ref.repository.name,
            },
            fork: {
              name: elem.head_ref.repository.name,
            },
            base_ref: elem.base_ref,
            head_ref: elem.head_ref,
            tasks: {
              count: elem.tasks_count,
              id: elem.id,
            },
            status: {
              status: elem.status,
              canceled: elem.canceled,
              type: 'submission',
              started_at: elem.started_at,
              submission_id: elem.id,
            },
            history: {
              started_at: elem.started_at,
              created_at: elem.created_at,
              finished_at: elem.finished_at,
            },
          }));

          this.client.submissionsCountGet(
            {repository: this.repository, sha: this.props.sha},
            (err, count, resp) => {
              if (!handleError(err, resp)) {
                this.setState(
                  Object.assign(extraState, {
                    subs: subsList,
                    loading: false,
                    totalCount: count,
                  }),
                );
              }
            },
          );
        }
      },
    );
  }

  componentWillMount() {
    this.repository = '';
    if (this.props.owner && this.props.repository) {
      this.repository = this.props.owner + '/' + this.props.repository;
    }

    this.fetchTasks(getPaginationState(this));
    this.refreshInterval = window.setInterval(
      this.fetchTasks.bind(this, () => {
        getPaginationState(this);
      }),
      5000,
    );
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
      <div style={{minWidth: minWidth, overflowX: 'auto'}}>
        <Grid rows={this.state.subs} columns={tableColumns}>
          <DataTypeProvider
            formatterComponent={format.repository}
            for={['parent']}
          />
          <DataTypeProvider
            formatterComponent={format.ref}
            for={['base_ref']}
          />
          <DataTypeProvider
            formatterComponent={format.repository}
            for={['fork']}
          />
          <DataTypeProvider
            formatterComponent={format.ref}
            for={['head_ref']}
          />
          <DataTypeProvider formatterComponent={format.tasks} for={['tasks']} />
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
            onCurrentPageChange={changePage(this, this.fetchTasks.bind(this))}
            pageSize={this.state.perPage}
            onPageSizeChange={changePerPage(this, this.fetchTasks.bind(this))}
          />
          <PagingPanel pageSizes={this.state.perPageList} />
          <CustomPaging totalCount={this.state.totalCount} />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow />
        </Grid>
      </div>
    );
  }
}

export default SubmissionList;
