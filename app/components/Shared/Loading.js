import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  width: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

class Loading extends React.Component {
  static defaultProps = {
    handleClose: () => {}
  }
  render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.width}
      >
        <CircularProgress className={classes.progress} color="secondary" />
      </div>
    );
  }
}

Loading.propTypes = {
};
export default withStyles(styles)(Loading);
