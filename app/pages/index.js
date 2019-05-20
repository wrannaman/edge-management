/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Router, { withRouter } from 'next/router';
import Paper from '@material-ui/core/Paper';
import { inject, observer } from 'mobx-react';
import Auth from '../src/Auth';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
    backgroundImage: 'url("/static/img/cool!.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh',
  },
  center: {
    position: 'absolute',
    width: 500,
    height: 400,
    top: 'calc(50% - 200px)',
    left: 'calc(50% - 250px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '50%',
    marginBottom: 15,
  }
});

@inject('store')
@observer
class Index extends React.Component {
  state = {
    error: '',
  };

  componentDidMount() {
    this.auth = new Auth();
    if (this.auth.isAuthenticated()) {
      Router.push({
        pathname: '/dashboard',
      });
    }
    const { query } = this.props.router;
    if (query.error) {
      this.setState({ error: query.error });
    }
  }

  handleClick = () => {
    this.auth.login();
  };

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.center} elevation={24}>
          <img src="/static/img/logo.png" className={classes.logo} />
          {false && (
            <Typography variant="body1" gutterBottom>
              Simple Analytics!
            </Typography>
          )}
          <Typography gutterBottom>
          {error && (
            <Typography variant="body2" gutterBottom color="error">
              {error}
            </Typography>
          )}
          </Typography>
          <div>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            style={{ marginTop: 20 }}
            onClick={this.handleClick}
          >
            Log in or Sign Up
          </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Index));
