import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default class Snacky extends React.Component {
  static defaultProps = {
    handleClose: () => {}
  }
  render() {
    const { snackbarMessage, handleClose } = this.props;
    return (
      <Snackbar
        open={snackbarMessage.length > 0 ? true : false}
        onClose={handleClose}
        TransitionComponent={TransitionUp}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{snackbarMessage}</span>}
      />
    );
  }
}

Snacky.propTypes = {
  snackbarMessage: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
};
