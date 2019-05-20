/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Router, { withRouter } from 'next/router';
import Paper from '../components/Base/Paper';

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
    width: '80%',
    marginBottom: 15,
  }
});

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    const { open, error} = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.center} elevation={24}>
          <img src="/static/img/logo.png" className={classes.logo} />
          <Typography gutterBottom>
          {error && (
            <Typography variant="body2" gutterBottom color="error">
              {error}
            </Typography>
          )}
          </Typography>
          <Typography>
            Privacy
          </Typography>
        </Paper>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Index));
