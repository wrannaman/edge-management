import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';

// mui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snacky from '../Shared/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import { createProject, fetchProjects } from '../../src/apiCalls/project';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tags from '../Shared/Tags';

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
    actions: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%'
    }
  });
};

@inject('store')
@observer
class NewProjectForm extends React.Component {
  state = {
    deleteForReal: false,
    snackbarMessage: "",
  };
  componentDidMount() {
    const { store: { project: { tags, newProjectName, update } } } = this.props;
    update('tags', []);
    update('tag', "");
    update('newProjectName', "");
  }
  submit = async (e) => {
    e.preventDefault();
    const { handleClose } = this.props;
    const { store: { project: { tags, newProjectName, update } } } = this.props;
    const res = await createProject({ name: newProjectName, tags });
    if (res && res.project) {
      const projectsRes = await fetchProjects({});
      update('projects', projectsRes.projects);
      this.snacky('Project created');
      update('createProjectModalOpen', false);
      update('newProjectName', "");
      update('tag', '');
      update('tags', []);
    } else {
      this.snacky(res.error ? res.error : 'an error occurred');
    }
    // reset();
    // handleClose();
  }

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  handleChange = (name) => (e) => {
    const { store: { project: { update } } } = this.props;
    update(name, e.target.value);
  }

  deleteProject = async () => {
    const { snacky, props: { handleClose, store: { project: { list, selectedIndex, update }, collection: { id, assetCount, get, reset } } }, state: { deleteForReal } } = this;
    if (assetCount > 0) return snacky('Remove assets before deleting.', 5000)
    if (!deleteForReal) return this.setState({ deleteForReal: true });
    const res = await deleteCollection(id);
    if (res.success) {
      const copy = list.slice();
      copy.splice(selectedIndex, 1);
      update('list', copy);
    }
    this.setState({ deleteForReal: false });
    reset();
    handleClose();
  }

  close = () => {
    const { store: { project: { update } } } = this.props;
    update('createProjectModalOpen', false)
  }

  // chips
  handleDeleteChip = (chipIndex) => (e) => {
    const { store: { project: { update, tags } } } = this.props;
    const sliced = tags.slice();
    sliced.splice(chipIndex, 1);
    update('tags', sliced);
  }

  addTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { store: { project: { update, tags, tag } } } = this.props;
    const sliced = tags.slice();
    if (!tag) return;
    sliced.push(tag);
    update('tags', sliced);
    update('tag', "");
  }

  render() {
    // const {
    //   handleChange,
    //   submit,
    //   deleteProject,
    //   close,
    //   addTag,
    //   handleDeleteChip,
    //   state: {
    //     deleteForReal,
    //     snackbarMessage
    //   },
    //   props: {
    //     classes,
    //     store: {
    //       collection: {
    //         name,
    //         tag,
    //         tags,
    //         id
    //       }
    //     },
    //     open,
    //     handleClose
    //   }
    // } = this;
    // if (!name && id) return null;
    const {
      addTag, handleDeleteChip, submit, handleChange, close,
      props: {
        handleClose, classes,
        store: {
          project: { tag, tags, newProjectName, createProjectModalOpen }
        }
      },
      state: { snackbarMessage }
    } = this;
    return (
      <div>
        <Dialog
          open={createProjectModalOpen}
          onClose={close}
          aria-labelledby="form-dialog-title"
        >
          <form
            className={classes.container}
            autoComplete="off"
            onSubmit={this.submit}
          >
          <DialogTitle id="form-dialog-title">Create A Project</DialogTitle>
          <DialogContent>
            <div className={classes.textField}>
              <TextField
                id="outlined-with-placeholder"
                label="Project Name"
                placeholder="Project Name"
                value={newProjectName}
                className={classes.textField}
                onChange={handleChange('newProjectName')}
                margin="normal"
                variant="outlined"
              />
            </div>

            <Tags
              addTag={addTag}
              handleChange={handleChange}
              tag={tag}
              tags={tags}
              handleDeleteChip={handleDeleteChip}
            />

          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={close} color="default">
              Cancel
            </Button>
            <Button
              onClick={submit}
              color="primary"
              type="submit"
              variant="contained"
            >
              Create Project
            </Button>
            {false && (
              <div>
                {id && deleteForReal && (
                  <Button
                    onClick={deleteProject}
                    color="secondary"
                    variant="contained"
                  >
                    {'Delete Collection'}
                  </Button>
                )}
                {id && !deleteForReal && (
                  <IconButton
                    aria-label="Delete"
                    className={classes.margin}
                    onClick={deleteProject}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            )}

          </DialogActions>
          </form>

        </Dialog>
        <Snacky
          snackbarMessage={snackbarMessage}
        />
      </div>
    );
  }
}

NewProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewProjectForm);
