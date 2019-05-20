import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { inject, observer } from 'mobx-react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = {
  avatar: {

  },
  padding: {
    padding: 25,
    // width: 200,
  },
  dialog: {
    padding: 50,
  }
};

@inject('store')
@observer
class SimpleDialog extends React.Component {
  state = {
  };

  render() {
    const { classes, onClose, open, close } = this.props;
    const { media: { date, dateChange } } = this.props.store;

    return (
      <Dialog
        onClose={onClose}
        open={open}
        aria-labelledby="simple-dialog-title"

      >
        <DialogTitle id="simple-dialog-title">
          Select Date
        </DialogTitle>
        <DialogContentText className={classes.padding}>
          Change the date of the assets.
        </DialogContentText>
        <div className={classes.padding}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              margin="normal"
              label="Date picker"
              value={date}
              onChange={dateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
        <DialogActions>
          <Button onClick={close(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={close(true)} color="primary">
            Change Date
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  store: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default withStyles(styles)(SimpleDialog);
