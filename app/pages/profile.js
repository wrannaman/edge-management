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

// next
import Router, { withRouter } from 'next/router';

// ours
import Side from '../components/Nav/Side';
import { saveProfile } from '../src/apiCalls/user';

import Auth from '../src/Auth';

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
    minHeight: 200,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    maxWidth: '60%',
    alignSelf: 'center',
    marginTop: 25,
  },
  textField: {
    minWidth: 300,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    width: '100%'
  }
});


@inject('store')
@observer
class Profile extends React.Component {

  state = {
    snackbarMessage: '',
    submitDisabled: false,
    disabled: false,
    waiting: true,
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
    this.setState({ waiting: false });
  }

  handleChange = _name => event => {
    const { auth: { setUserKey } } = this.props.store;
    setUserKey(_name, event.target.value);
  }

  saveProfile = async (e) => {
    e.preventDefault();
    const { auth: { user } } = this.props.store;
    const { first_name, last_name } = user;
    const res = await saveProfile({ first_name, last_name });
    if (res && res.user) {
      this.snacky('Saved!');
      localStorage.setItem('@SUGAR-USER', JSON.stringify(res.user));
      setTimeout(() => {
        this.setState({ snackbarMessage: '' });
      }, 3000);
    }
  }

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  render() {
    const { handleChange } = this;
    const { classes } = this.props;
    const { auth: { user } } = this.props.store;

    const { email, first_name, last_name } = user;
    const {
      snackbarMessage,
      disabled,
      submitDisabled,
      waiting
    } = this.state;

    return (
      <div className={classes.root}>
        <Side
          showSearch={false}
          title={'Profile'}
        >
          <div className={classes.container}>
            <Paper className={classes.paper} elevation={1}>
              <Typography variant="h3">Profile</Typography>
              <div style={{ marginTop: 10 }}>
                {!waiting && email && (
                  <div>
                    <form
                      className={classes.container}
                      autoComplete="off"
                      onSubmit={this.saveProfile}
                    >
                      <div>
                        <TextField
                          disabled
                          id="outlined-with-placeholder"
                          label="Email"
                          defaultValue={email}
                          className={classes.textField}
                          margin="normal"
                          variant="outlined"
                        />
                      </div>

                      <div>
                        <TextField
                          disabled={disabled}
                          value={first_name}
                          id="standard-disabled"
                          label="First Name"
                          onChange={handleChange('first_name')}
                          className={classes.textField}
                          margin="normal"
                          variant="outlined"
                        />
                      </div>
                      <div>
                        <TextField
                          disabled={disabled}
                          value={last_name}
                          id="standard-disabled"
                          label="Last Name"
                          onChange={handleChange('last_name')}
                          className={classes.textField}
                          margin="normal"
                          variant="outlined"
                        />
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 15}}>
                        <Button
                          disabled={submitDisabled}
                          variant="outlined"
                          color="secondary"
                          className={classes.button}
                          type="submit"
                          onClick={this.submit}
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </Paper>
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
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Profile));
