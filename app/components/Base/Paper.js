import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

// We can inject some CSS into the DOM.
const styles = theme => ({
  root: {
    borderRadius: 0,
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 600,
    transition: 'all 0.5s',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

function ClassNames(props) {
  const { classes, children, className, ...other } = props;
  return (
    <Paper
      className={classNames(classes, className)}
      elevation={1}
      {...other}
    >
      {children}
    </Paper>
  );
}

ClassNames.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default withStyles(styles)(ClassNames);
