import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';
import Router from 'next/router';

// mui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import Chip from '@material-ui/core/Chip';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import { createProject, updateProject } from '../../src/apiCalls/project';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tags from '../Shared/Tags';
import Typeahead from './Typeahead';
import { moveAssets } from '../../src/apiCalls/asset';
import Typography from '@material-ui/core/Typography';


const styles = theme => {
  return ({
    container: {
      // display: 'flex',
      // flexWrap: 'wrap',
      // flexDirection: 'column',
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 500,
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%'
    },
  });
};


@inject('store')
@observer
class NewProjectForm extends React.Component {
  componentDidMount() {}

  submit = async (e) => {
    e.preventDefault();
    const {
      props: {
        fetchCollection,
        handleClose,
        store: {
          collection: {
            selectedAssets,
            moveTo
          }
        }
      }
    } = this;
    const res = await moveAssets({ to: moveTo.id, assets: selectedAssets.slice() });
    if (res.success) {
      // window.location = `/collection?id=${moveTo.id}`
      Router.push({
        pathname: '/collection',
        query: {
          id: moveTo.id,
        }
      });
      setTimeout(() => {
        fetchCollection();
        handleClose();
      }, 300);
    }
  }
  render() {
    const {
      props: {
        open,
        collections,
        classes,
        close,
        handleClose,
        store: {
          collection: {
            moveTo,
            selectedAssets
          }
        }
      },
      submit,
    } = this;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <form
          autoComplete="off"
          onSubmit={submit}
        >
          <DialogTitle id="form-dialog-title">Move Collection</DialogTitle>
          <DialogContent>
            <Typeahead
              collections={collections}
            />
            <div style={{ width: 400 }} />
            {moveTo && moveTo.id && (
              <Typography>
                Move {selectedAssets.length} assets to {moveTo.name}?
              </Typography>
            )}
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={handleClose} color="default">
              Cancel
            </Button>
            <Button
              onClick={submit}
              color="primary"
              type="submit"
              variant="contained"
            >
              Move
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

NewProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewProjectForm);
