import * as format from '../../lib/table-formatters';
import {handleError} from '../error-messages';
import DataGrid from '../data-grid';

const tableColumns = [
  {
    title: 'Information',
    name: 'information',
  },
  {
    title: 'Links',
    name: 'links',
  },
  {
    title: 'History',
    name: 'history',
  },
  {
    title: 'Status',
    name: 'status',
  },
];

// these should add up to 1 or close to it
const globalColumnExtensions = [
  {
    columnName: 'information',
    width: 0.4,
  },
  {
    columnName: 'links',
    width: 0.2,
  },
  {
    columnName: 'history',
    width: 0.3,
  },
  {
    columnName: 'status',
    width: 0.1,
  },
];

class SubmissionList extends DataGrid {
  fetch(extraState) {
    extraState = Object.assign(this.state, extraState);
    this.client.submissionsGet(
      {
        repository: this.repository(),
        sha: this.props.sha,
        page: extraState.currentPage,
        perPage: extraState.perPage,
      },
      (err, subs, resp) => {
        if (!handleError(err, resp)) {
          var subsList = subs.map(elem => ({
            links: {
              id: elem.id,
              tasks_count: elem.tasks_count,
              runs_count: elem.runs_count,
              ticket: {
                id: elem.ticket_id === 0 ? null : elem.ticket_id,
                repository: elem.base_ref.repository,
              },
            },
            information: {
              id: elem.id,
              base_ref: elem.base_ref,
              head_ref: elem.head_ref,
            },
            status: {
              status: elem.status,
              canceled: elem.canceled,
              type: 'submission',
              started_at: elem.started_at,
              submission_id: elem.id,
            },
            history: {
              status: elem.status,
              started_at: elem.started_at,
              created_at: elem.created_at,
              finished_at: elem.finished_at,
            },
          }));

          this.client.submissionsCountGet(
            {repository: this.repository(), sha: this.props.sha},
            (err, count, resp) => {
              if (!handleError(err, resp)) {
                this.setState(
                  Object.assign(extraState, {
                    items: subsList,
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

  repository() {
    if (this.props.owner && this.props.repository) {
      return this.props.owner + '/' + this.props.repository;
    } else {
      return null;
    }
  }

  render() {
    return this.dataGridRender(
      'submissions',
      tableColumns,
      globalColumnExtensions,
      {
        information: format.submissionInfo,
        links: format.submissionLinks,
        status: format.status,
        history: format.history,
      },
    );
  }
}

export default SubmissionList;
