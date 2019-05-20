/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
// mui
import Button from '../components/Base/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '../components/Shared/Snackbar';
import Slide from '@material-ui/core/Slide';
import Paper from '../components/Base/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

// next
import Router, { withRouter } from 'next/router';

// ours
import Side from '../components/Nav/Side';
import Auth from '../src/Auth';
import { saveProfile, getUser, getInvites, sendInvites } from '../src/apiCalls/user';


import TeamForm from '../components/Team/TeamForm';
import TeamMembers from '../components/Team/TeamMembers';
import Invite from '../components/Invite/InviteForm';
import InviteList from '../components/Invite/InviteList';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    marginTop: 25,
  },
  withTitle: {
    maxWidth: '60%',
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 auto',
    justifyContent: 'center',
    marginTop: 25,
  },
  textField: {
    minWidth: 300,
  }
});

@inject('store')
@observer
class Profile extends React.Component {

  state = {
    snackbarMessage: '',
    submitDisabled: false,
    name: '',
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const {
      props: {
        store: {
          auth: { checkTokenAndSetUser }
        }
      }
    } = this;
    this.auth = new Auth();
    if (!this.auth.isAuthenticated()) {
      Router.push({ pathname: '/' });
    }
    const { access_token, id_token } = this.auth.getSession();
    await checkTokenAndSetUser({ access_token, id_token });
    const invites = await getInvites();
    const { invite: { update } } = this.props.store;
    update('invited', invites.invited);
    update('counts', invites.counts);
    this.setState({ waiting: false });
  }

  handleChange = _name => event => {
    const { name, submitDisabled } = this.state;
    let value = event.target.value;
    if (_name === 'price') {
      value = Number(event.target.value);
    }

    this.setState({
      [_name]: value,
    });
    if (name && name.length > 3) this.setState({ submitDisabled: false });
    else if (submitDisabled === false) this.setState({ submitDisabled: true });
  }

  timedMessage = (snackbarMessage, time = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: '' }), time);
  }

  resendInvite = (invite) => async () => {
    const { timedMessage } = this;
    const res = await sendInvites({ invites: [invite], resend: true });
    if (res && res.success) {
      timedMessage(`Invite resent`);
    } else {
      timedMessage(`Error sending invites`);
    }
  }

  onInviteSent = async () => {
    const { invite: { update } } = this.props.store;
    const invites = await getInvites();
    update('invited', invites.invited);
    update('counts', invites.counts);
  }

  render() {
    const {
      handleTeamChange, resendInvite, onInviteSent,
      props: { classes },
      state: { snackbarMessage }
    } = this;
    const { invite: { invited } } = this.props.store;

    return (
      <div className={classes.root}>
        <Side
          showSearch={false}
          title={'Team'}
        >
          <div className={classes.container}>
            <div className={classes.withTitle}>
              <div className={classes.title}>
                <Typography variant="h4">My Team</Typography>
              </div>
              <Paper className={classes.paper} elevation={1}>
                <TeamForm />
              </Paper>
            </div>
            <div className={classes.withTitle}>
              <div className={classes.title}>
                <Typography variant="h4">Joined</Typography>
              </div>
              <Paper className={classes.paper} elevation={1}>
                <TeamMembers />
              </Paper>
            </div>
            <div className={classes.withTitle}>
              <div className={classes.title}>
                <Typography variant="h4">Invite</Typography>
              </div>
              <Paper
                className={classes.paper}
                elevation={1}
                style={{ minHeight: 50 }}
              >
                <Invite
                  onInviteSent={onInviteSent}
                />
              </Paper>
            </div>
            { invited && invited.length > 0 && (
              <div className={classes.withTitle}>
                <div className={classes.title}>
                  <Typography variant="h4">Invited</Typography>
                </div>
                <Paper
                  className={classes.paper}
                  elevation={1}
                  style={{ minHeight: 50 }}
                >
                  <InviteList
                    invited={invited}
                    resendInvite={resendInvite}
                  />
                </Paper>
              </div>
            )}
          </div>
        </Side>
        <Snackbar
          snackbarMessage={snackbarMessage}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Profile));
