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
import { updateAssets } from '../../src/apiCalls/asset';
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
class ApplyTagsToMedia extends React.Component {
  componentDidMount() {}

  submit = async (e) => {
    e.preventDefault();
    const {
      props: {
        fetchMedia,
        handleClose,
        store: {
          project: {
            id
          },
          media: {
            selectedMedia,
            mediaTags,
          }
        }
      }
    } = this;
    const res = await updateAssets({ id, assets: selectedMedia, tags: mediaTags });
    if (res.success) {
      setTimeout(() => {
        fetchMedia();
        handleClose();
      }, 300);
    }
  }

  // chips
  handleChange = (name) => (e) => {
    const { store: { media: { update } } } = this.props;
    update(name, e.target.value);
  }

  handleDeleteChip = (chipIndex) => (e) => {
    const { store: { media: { update, mediaTags } } } = this.props;
    const sliced = mediaTags.slice();
    sliced.splice(chipIndex, 1);
    update('mediaTags', sliced);
  }

  addTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { store: { media: { update, tags, tag, mediaTags } } } = this.props;
    const sliced = mediaTags.slice();
    if (!tag) return;
    sliced.push(tag);
    update('mediaTags', sliced);
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
          media: {
            selectedMedia,
            tag,
            mediaTags,
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
          <DialogTitle id="form-dialog-title">Apply Tag(s) To {selectedMedia.length} Assets?</DialogTitle>
          <DialogContent>
            <Tags
              addTag={addTag}
              handleChange={handleChange}
              tag={tag}
              tags={mediaTags}
              handleDeleteChip={handleDeleteChip}
            />
            <div style={{ width: 400 }} />
            {mediaTags.length > 0 && (
              <Typography>
                Apply tags to {selectedMedia.length} assets?
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

ApplyTagsToMedia.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchMedia: PropTypes.func.isRequired,
};

export default withStyles(styles)(ApplyTagsToMedia);
