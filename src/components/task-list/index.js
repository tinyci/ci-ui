import * as format from '../../lib/table-formatters';
import DataGrid from '../data-grid';
import {handleError} from '../error-messages';

const tableColumns = [
  {
    title: 'Task Name',
    name: 'taskName',
  },
  {
    title: 'Run Count',
    name: 'runs',
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
    columnName: 'taskName',
    width: 0.4,
  },
  {
    columnName: 'runs',
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

class TaskList extends DataGrid {
  fetch(extraState) {
    extraState = Object.assign(this.state, extraState);
    this.client.submissionIdTasksGet(this.props.id, {}, (err, tasks, resp) => {
      if (!handleError(err, resp)) {
        var taskList = tasks.map(elem => ({
          runs: {
            count: elem.runs,
            id: elem.id,
          },
          taskName: {
            id: elem.id,
            path: elem.path === '.' ? '*root*' : elem.path,
          },
          status: {
            task_id: elem.id,
            status: elem.status,
            type: 'task',
            canceled: elem.canceled,
            started_at: elem.started_at,
          },
          history: {
            status: elem.status,
            created_at: elem.created_at,
            started_at: elem.started_at,
            finished_at: elem.finished_at,
          },
        }));
        this.client.submissionIdGet(this.props.id, (err, sub, resp) => {
          if (!handleError(err, resp)) {
            this.setState(
              Object.assign(extraState, {
                items: taskList,
                loading: false,
                totalCount: sub.tasks_count,
                submission: sub,
              }),
            );
          }
        });
      }
    });
  }

  render() {
    return this.dataGridRender('tasks', tableColumns, globalColumnExtensions, {
      taskName: format.taskName,
      runs: format.taskRuns,
      status: format.status,
      history: format.history,
    });
  }
}

export default TaskList;
