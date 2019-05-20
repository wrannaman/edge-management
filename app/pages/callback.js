/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Auth from '../src/Auth';
import Router from 'next/router';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

class Index extends React.Component {

  state = {
    showTryAgain: false,
  }

  componentDidMount() {
    this.auth = new Auth();
    this.handleAuthentication(window.location);
    setTimeout(() => {
      this.setState({ showTryAgain: true });
    }, 5000);
  }

  handleClick = () => {
    this.auth.login();
  };

  handleAuthentication(location) {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.auth.handleAuthentication(Router);
    }
  }

  render() {
    const { classes } = this.props;
    const { showTryAgain } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="display1" gutterBottom>
          One moment please...
        </Typography>

        <Typography gutterBottom>
        </Typography>
        {showTryAgain && (
          <Button variant="contained" color="secondary" onClick={this.handleClick}>
            Try again.
          </Button>
        )}
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
