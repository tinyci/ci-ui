import React from 'react';
import Client from '../../lib/client/client';
import {sizeColumns} from '../../lib/column-sizer';
import Loading from '../loading';
import Breadcrumb from '../breadcrumb';
import {
  getPaginationState,
  changePage,
  changePerPage,
} from '../../lib/pagination';

import {Grid, Table, PagingPanel} from '@devexpress/dx-react-grid-material-ui';
import {
  PagingState,
  DataTypeProvider,
  CustomPaging,
} from '@devexpress/dx-react-grid';

class DataGrid extends React.Component {
  perPageList = [5, 10, 20, 40, 100];

  state = {
    perPage: 20,
    currentPage: 0,
    loading: true,
    totalCount: 0,
    submission: null,
    task: null,
    items: [],
  };

  client = new Client();
  refreshInterval = null;

  componentDidMount() {
    this.fetch(getPaginationState(this));

    this.refreshInterval = window.setInterval(
      this.fetch.bind(this, () => {
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

  dataGridRender(action, tableColumns, globalColumnExtensions, columns) {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <div style={{minWidth: this.props.minWidth, overflowX: 'auto'}}>
        <Breadcrumb
          submission={this.state.submission}
          path={this.state.task ? this.state.task.path : null}
          task_id={this.state.task ? this.state.task.id : null}
          action={action}
        />
        <Grid rows={this.state.items} columns={tableColumns}>
          {Object.entries(columns).map(([k, v]) => (
            <DataTypeProvider formatterComponent={v} for={[k]} />
          ))}
          <PagingState
            currentPage={this.state.currentPage}
            onCurrentPageChange={changePage(this, state => {
              this.fetch(state);
            })}
            pageSize={this.state.perPage}
            onPageSizeChange={changePerPage(this, state => {
              this.fetch(state);
            })}
          />
          <CustomPaging totalCount={this.state.totalCount} />
          <Table
            columnExtensions={sizeColumns(
              this.props.minWidth,
              globalColumnExtensions,
            )}
          />
          <PagingPanel pageSizes={this.perPageList} />
        </Grid>
      </div>
    );
  }
}

export default DataGrid;
