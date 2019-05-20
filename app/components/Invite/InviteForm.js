import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';

// mui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '../Shared/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';

// ours
import { flex_row } from '../../utils/styles';
import colors from '../../utils/colors';

import { sendInvites } from '../../src/apiCalls/user';

const styles = theme => {
  return ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 500,
    },
    button: {
      margin: theme.spacing.unit,
    },
    snackbar: {
      margin: theme.spacing.unit,
    },
    error: {
      color: theme.palette.error.main,
    }
  });
};

@inject('store')
@observer
class Invite extends React.Component {
  state = {
    user: {},
    submitDisabled: false,
    disabled: false,
    snackbarMessage: '',
    showForm: true, // change to false
    invites: [{ email: '', id: 0 }], // remove my email
  };

  handleChange = (_name, index) => event => {
    const value = event.target.value;
    const invites = this.state.invites.slice();
    invites[index].email = value;
    let submitDisabled = false;
    // if (value === '') invites = in
    invites.forEach((invite) => {
      if (!invite.email) submitDisabled = true;
    });
    // console.log(', ', submitDisabled, 'submitDisabled');
    this.setState({ invites, submitDisabled });
  };

  componentDidMount() {

  }

  timedMessage = (snackbarMessage, time = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: '' }), time);
  }

  submit = async (e) => {
    e.preventDefault();
    const { timedMessage } = this;
    const { invites } = this.state;
    // console.log('submit', this.state.invites);

    this.setState({ disabled: true, submitDisabled: true });
    const res = await sendInvites({ invites });
    this.setState({ disabled: false, submitDisabled: false });
    if (res && res.success) {
      this.props.onInviteSent()
      timedMessage(`${invites.length} invites sent`);
    } else {
      timedMessage(`Error sending invites`);
    }
  }

  addRow = () => {
    const invites = this.state.invites.slice();
    invites.push({ email: '', id: Date.now() });
    this.setState({ invites });
  }

  removeItem = (index) => () => {
    const invites = this.state.invites.slice();
    if (invites.length === 1) return;
    invites.splice(index, 1);
    this.setState({ invites });
  }

  render() {
    const { addRow, handleChange, removeItem } = this;
    const { classes } = this.props;
    const { invites, submitDisabled, snackbarMessage, showForm, disabled } = this.state;

    if (!showForm) {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          style={{ marginTop: 15 }}
          onClick={() => this.setState({ showForm: true })}
        >
          Invite Your Team!
        </Button>
      );
    }
    return (
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={this.submit}
      >
      {invites.map((invite, index) => invite &&
        typeof invite.id !== 'undefined' && (
        <div
          style={flex_row}
          key={invite.id}
        >
          <TextField
            label="Invite"
            className={classes.textField}
            value={invite.email}
            onChange={handleChange('invite', index)}
            margin="normal"
            type="email"
            disabled={disabled}
          />
          <IconButton
            disabled={(invite.id === 0 && invites.length === 1)}
            color="inherit"
            aria-label="Open drawer"
            onClick={removeItem(index)}
            className={classNames(classes.menuButton, this.state.open && classes.hide)}
          >
            <DeleteIcon style={{ color: (invite.id === 0 && invites.length === 1) ? 'inherit' : colors.primary }} />
          </IconButton>
        </div>
      ))}
        <div>
          <Button
            disabled={submitDisabled}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
            onClick={this.submit}
          >
            Invite
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={addRow}
          >
            Add A Row
          </Button>
        </div>
        <Snackbar
          snackbarMessage={snackbarMessage}
        />
      </form>
    );
  }
}

Invite.propTypes = {
  classes: PropTypes.object.isRequired,
  onInviteSent: PropTypes.func.isRequired,
};

export default withStyles(styles)(Invite);
