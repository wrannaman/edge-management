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
import { changeBoxLabel } from '../../src/apiCalls/asset';
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
            assetTags,
            id
          }
        }
      }
    } = this;
    const res = await changeBoxLabel({ id, assets: selectedAssets, tags: assetTags });
    if (res.success) {
      setTimeout(() => {
        fetchCollection();
        handleClose();
      }, 300);
    }
  }

  // chips
  handleChange = (name) => (e) => {
    const { store: { collection: { update } } } = this.props;
    update(name, e.target.value);
  }

  handleDeleteChip = (chipIndex) => (e) => {
    const { store: { collection: { update, assetTags } } } = this.props;
    const sliced = assetTags.slice();
    sliced.splice(chipIndex, 1);
    update('assetTags', sliced);
  }

  addTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { store: { collection: { update, tags, tag, assetTags } } } = this.props;
    const sliced = [];
    if (!tag) return;
    sliced.push(tag);
    update('assetTags', sliced);
    update('tag', "");
  }

  render() {
    const {
      handleDeleteChip,
      addTag,
      handleChange,
      submit,
      props: {
        open,
        classes,
        handleClose,
        store: {
          collection: {
            selectedAssets,
            tag,
            assetTags,
          }
        }
      },
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
          <DialogTitle id="form-dialog-title">Change {selectedAssets.length} labels?</DialogTitle>
          <DialogContent>
          <Typography>
            Warning! This will only change the label of the first box. You may only apply one tag.
          </Typography>

            <Tags
              addTag={addTag}
              handleChange={handleChange}
              tag={tag}
              tags={assetTags}
              handleDeleteChip={handleDeleteChip}
            />
            <div style={{ width: 400 }} />
            {assetTags.length > 0 && (
              <Typography>
                Apply tags to {selectedAssets.length} assets?
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
              Apply
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
  fetchCollection: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewProjectForm);
