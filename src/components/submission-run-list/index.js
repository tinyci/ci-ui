import * as format from '../../lib/table-formatters';
import {handleError} from '../error-messages';
import DataGrid from '../data-grid';

const tableColumns = [
  {
    title: 'Section',
    name: 'path',
  },
  {
    title: 'History',
    name: 'history',
  },
  {
    title: 'Status',
    name: 'status',
  },
  {
    title: 'Log',
    name: 'log',
  },
];

// these should add up to 1 or close to it
const globalColumnExtensions = [
  {
    columnName: 'path',
    width: 0.3,
  },
  {
    columnName: 'history',
    width: 0.4,
  },
  {
    columnName: 'status',
    width: 0.1,
  },
  {
    columnName: 'log',
    width: 0.2,
  },
];

class SubmissionRunList extends DataGrid {
  fetch(extraState) {
    extraState = Object.assign(this.state, extraState);
    this.client.submissionIdRunsGet(
      this.props.id,
      {
        page: extraState.currentPage,
        perPage: extraState.perPage,
      },
      (err, runs, resp) => {
        if (!handleError(err, resp)) {
          var runList = runs.map(elem => ({
            path: elem.name,
            status: {
              run_id: elem.id,
              status: elem.status,
              canceled: elem.task.canceled,
              type: 'run',
              started_at: elem.started_at,
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

          this.client.submissionIdGet(this.props.id, (err, sub, resp) => {
            if (!handleError(err, resp)) {
              this.setState(
                Object.assign(extraState, {
                  totalCount: sub.runs_count,
                  items: runList,
                  loading: false,
                  submission: sub,
                }),
              );
            }
          });
        }
      },
    );
  }

  render() {
    return this.dataGridRender(tableColumns, globalColumnExtensions, {
      path: format.text,
      log: format.log,
      status: format.status,
      history: format.history,
    });
  }
}

export default SubmissionRunList;
