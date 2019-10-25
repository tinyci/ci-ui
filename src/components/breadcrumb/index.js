import React from 'react';

import {AppBar, Breadcrumbs, Link} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';

class Breadcrumb extends React.Component {
  render() {
    return (
      <AppBar
        color="secondary"
        style={{
          paddingTop: '5px',
          paddingBottom: '5px',
          position: 'relative',
        }}>
        <Breadcrumbs
          style={{color: '#aaa'}}
          separator=">"
          aria-label="breadcrumb">
          <Link style={{color: 'white'}} href="/">
            <HomeIcon
              fontSize="inherit"
              style={{verticalAlign: 'bottom', margin: '5px'}}
            />
            Submission List
          </Link>
          {this.props.submission ? (
            <Link
              style={{color: 'white'}}
              href={
                '/submissions/' + this.props.submission.head_ref.repository.name
              }>
              {this.props.submission.head_ref.repository.name}
            </Link>
          ) : null}
          {this.props.submission ? (
            <Link
              style={{color: 'white'}}
              href={
                '/submissions/' +
                this.props.submission.head_ref.repository.name +
                '/' +
                this.props.submission.head_ref.sha
              }>
              {this.props.submission.head_ref.ref_name.replace(
                /^(?:refs\/)?heads\//,
                '',
              )}{' '}
              ({this.props.submission.head_ref.sha.substring(0, 8)})
            </Link>
          ) : null}
          {this.props.submission && this.props.task_id ? (
            <Link
              style={{color: 'white'}}
              href={'/tasks/' + this.props.submission.id}>
              Tasks
            </Link>
          ) : null}
          {this.props.submission && !this.props.task_id ? (
            <Link
              style={{color: 'white'}}
              href={'/submission/' + this.props.submission.id + '/runs'}>
              Runs
            </Link>
          ) : null}
          {this.props.task_id && this.props.path ? (
            <Link style={{color: 'white'}} href={'/runs/' + this.props.task_id}>
              {this.props.path} Runs
            </Link>
          ) : null}
        </Breadcrumbs>
      </AppBar>
    );
  }
}

export default Breadcrumb;
