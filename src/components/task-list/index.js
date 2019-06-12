import React from 'react';
import Client from '../../lib/client/client';

class TaskList extends React.Component {
  state = {tasks: []};
  client = new Client();
  refreshInterval = null;

  fetchTasks(repository) {
    this.client.tasksGet({repository: repository}, (err, tasks) => {
      this.setState({tasks: tasks});
    });
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
  }

  componentWillUnmount() {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
    }
  }

  render() {
    console.log(this.state.tasks);
    return <div />;
  }
}

export default TaskList;
