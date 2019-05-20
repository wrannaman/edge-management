import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';
import Router, { withRouter } from 'next/router';

// mui
import Button from '@material-ui/core/Button';
import Snacky from '../Shared/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/HelpOutline';
import Tags from '../Shared/Tags';
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles } from '@material-ui/core/styles';
// import { exportProject } from '../../src/apiCalls/project';

const styles = theme => {
  return ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%'
    },
    root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing.unit * 3,

    },
    group: {
      margin: `${theme.spacing.unit}px 0`,
      display: 'flex',
      flexDirection: 'column',
    },
  });
};

@inject('store')
@observer
class ExportCollection extends React.Component {
  state = {
    snackbarMessage: "",
    showHelp: false,
  };

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  submit = async (e) => {
    e.preventDefault();
    this.props.vidToImage();
    // const { query } = this.props.router;
    // const { collection: { id, exportType, exportValue, exportAnnotation, percentValidation } } = this.props.store;
    // console.log('submitted! => export ', id, ' as type ', exportType, ' with ', exportValue);
    // const res = await exportCollection({ id, exportType, exportValue, exportAnnotation, percentValidation });
    // if (res.success) {
    //   this.snacky('Export initiated');
    //   this.props.handleClose();
    //   Router.push({ pathname: '/exports', query: { ...query }});
    // }
  }

  handleChange = type => event => {
    const { project: { update } } = this.props.store;
    update(type, event.target.value);
  };

  handleDeleteChip = (chipIndex) => (e) => {
    const { store: { project: { update, applyTagsToImagesFromThisVideo } } } = this.props;
    const sliced = applyTagsToImagesFromThisVideo.slice();
    sliced.splice(chipIndex, 1);
    update('applyTagsToImagesFromThisVideo', sliced);
  }

  addTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { store: { project: { update, applyTagsToImagesFromThisVideo, videoTagInProgress } } } = this.props;
    const sliced = applyTagsToImagesFromThisVideo.slice();
    if (!videoTagInProgress) return;
    sliced.push(videoTagInProgress);
    update('applyTagsToImagesFromThisVideo', sliced);
    update('videoTagInProgress', "");
  }

  render() {
    const {
      submit,
      handleChange,
      handleDeleteChip,
      addTag,
      state: {
        snackbarMessage,
        showHelp
      },
      props: {
        classes,
        handleClose,
        open,
        store: {
          project: {
            videoFidelity,
            applyTagsToImagesFromThisVideo,
            videoTagInProgress,
            videoGrouping
          }
        },
      }
    } = this;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form
          className={classes.container}
          autoComplete="off"
          onSubmit={this.submit}
        >
        <DialogTitle id="form-dialog-title">Chop</DialogTitle>
        <DialogContent>
          <div>
            <FormControl component="fieldset" className={classes.formControl}>
             {showHelp && (
               <Typography variant="body2" style={{ marginTop: 10 }}>
                If we take several frames from this video, it could skew the rest of your project.
                We can either treat each frame as an independent image (and will contribute to the totals and averages in the reports)
                or we can treat each video as a group and provide video level statistics (total number of people or other objects, etc.).
               </Typography>
             )}
             <FormLabel component="legend">
              Group the analytics?
              <Tooltip
                title={this.state.stateShowDetails ? `Hide` : `Show Explanation`}
              >
                <IconButton
                  onClick={() => this.setState({ showHelp: !showHelp })}
                  color="primary"
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
             </FormLabel>
             <RadioGroup
               aria-label="Process images individually or as a group"
               name="videoGroup"
               className={classes.group}
               value={videoGrouping}
               onChange={this.handleChange('videoGrouping')}
             >
               <FormControlLabel value="group" control={<Radio />} label="Group (Most Common)" />
               <FormControlLabel value="individual" control={<Radio />} label="Individual (Could skew rest of project)" />
             </RadioGroup>
            </FormControl>
          </div>
          {videoGrouping === 'individual' && (
            <div>
              <FormControl component="fieldset" className={classes.formControl}>
               <FormLabel component="legend">How many frames should we take from this video?</FormLabel>
               <RadioGroup
                 aria-label="How many images should we grab from this video?"
                 name="videoFidelity"
                 className={classes.group}
                 value={videoFidelity}
                 onChange={this.handleChange('videoFidelity')}
               >
                 <FormControlLabel value="-1" control={<Radio />} label="All" disabled={videoGrouping === 'group'} />
                 <FormControlLabel value="1" control={<Radio />} label="1 Frame Per Second" disabled={videoGrouping === 'group'} />
                 <FormControlLabel value="5" control={<Radio />} label="5 Frames Per Second" disabled={videoGrouping === 'group'} />
                 <FormControlLabel value="10" control={<Radio />} label="10 Frames Per Second" disabled={videoGrouping === 'group'} />
                 <FormControlLabel value="0" control={<Radio />} label="Only 1 frame (take from middle of video)" disabled={videoGrouping === 'group'} />
               </RadioGroup>
              </FormControl>
            </div>
          )}
          <div>
            <DialogContentText>
              <Typography>
                Apply these tag(s) to each image from this video
              </Typography>
            </DialogContentText>
            <Tags
              addTag={addTag}
              handleChange={handleChange}
              tag={videoTagInProgress}
              tagName={'videoTagInProgress'}
              tags={applyTagsToImagesFromThisVideo}
              handleDeleteChip={handleDeleteChip}
            />
          </div>
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
            Chop Chop
          </Button>

        </DialogActions>
        </form>
        <Snacky
          snackbarMessage={snackbarMessage}
        />
      </Dialog>
    );
  }
}

ExportCollection.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  vidToImage: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(ExportCollection));
