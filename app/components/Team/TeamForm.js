import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

// mui
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '../Shared/Snackbar';

import { flex_row } from '../../utils/styles';

import { updateTeam } from '../../src/apiCalls/team';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textField: {
    minWidth: 300,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  img: {
    maxWidth: '70%'
  }
});

@inject('store')
@observer
class TeamForm extends React.Component {
  static defaultProps = {};
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    snackbarMessage: '',
  }

  handleChange = _name => event => {
    const { auth: { user: { teams }, setUserKey } } = this.props.store;
    const cp = teams.slice();
    cp[0][_name] = event.target.value;
    setUserKey('teams', cp);
  };

  handleSnack = (snackbarMessage) => {
    this.setState({ snackbarMessage });
    setTimeout(() => {
      this.setState({ snackbarMessage: '' });
    }, 3000);
  }

  submit = async (e) => {
    const { handleSnack } = this;
    e.preventDefault();
    const { auth: { user: { teams } } } = this.props.store;
    const res = await updateTeam({ ...teams[0] });
    if (res && res.team) {
      handleSnack('Saved');
    } else {
      handleSnack('An Error occurred');
    }
  }

  imgError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://s3.us-west-1.wasabisys.com/public.sugarkubes/error.png";
  }

  haveLogo = (l) => l &&
  l.length > 5 &&
  (l.indexOf('.png') !== -1 ||
  l.indexOf('.jpg') !== -1 ||
  l.indexOf('.gif') !== -1 ||
  l.indexOf('.jpeg') !== -1);

  render() {
    const { haveLogo, imgError, handleChange } = this;
    const { classes } = this.props;
    const { auth: { user: { teams } } } = this.props.store;
    const { snackbarMessage } = this.state;

    const team = teams[0];
    if (!team || !team.name) return null;
    const { name, link, logo } = team;

    return (
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={this.submit}
      >
        <div style={flex_row}>
          <TextField
            id="outlined-with-placeholder"
            label="Team Name"
            placeholder="Team Name"
            value={name}
            className={classes.textField}
            onChange={handleChange('name')}
            margin="normal"
            variant="outlined"
          />
        </div>
        {false && (
          <div style={flex_row}>
            <TextField
              id="outlined-with-placeholder"
              label="link"
              placeholder="link"
              value={link}
              className={classes.textField}
              onChange={handleChange('link')}
              margin="normal"
              variant="outlined"
            />
          </div>
        )}
        {false && (
          <div style={flex_row}>
            <TextField
              id="outlined-with-placeholder"
              label="logo"
              placeholder="logo"
              value={logo}
              className={classes.textField}
              onChange={handleChange('logo')}
              margin="normal"
              variant="outlined"
            />
          </div>
        )}

        {false && haveLogo(logo) && (
          <div style={flex_row}>
            <img
              src={logo}
              className={classes.img}
              onError={imgError}
            />
          </div>
        )}

        <div>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            type="submit"
            onClick={this.submit}
          >
            Save
          </Button>
        </div>
        <Snackbar
          snackbarMessage={snackbarMessage}
        />
      </form>
    );
  }
}
TeamForm.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default withStyles(styles)(TeamForm);
