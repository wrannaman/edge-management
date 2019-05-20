/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

function About(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Sugar Analytics
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        The simplest way to get visual insight into your space, whether it's a retail store,
        a bar, or a building.
      </Typography>
      <Typography gutterBottom>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Typography>
    </div>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
