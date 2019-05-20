import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import LabelIcon from '@material-ui/icons/Label';
import AppBar from '@material-ui/core/AppBar';
import DateRange from '@material-ui/icons/DateRange';
import DatePicker from './DatePicker';
import Snackbar from '../Shared/Snackbar';
import { updateAssets, deleteAsset } from '../../src/apiCalls/asset';
import ApplyTagsToMedia from './ApplyTagsToMedia';

const styles = theme => ({
  addMediaButton: {
    // marginTop: 10,
    // marginLeft: 10,
    // position: 'absolute',
    // top: -3,
    // zIndex: 9999,
    // right: 75,
    // width: 550,
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'flex-end',
  },
  margin: {
    marginLeft: 10,
    marginRight: 10,
  },
  selectAll: {
    marginLeft: 10
  },
  move: {
    // width: 500,
    // height: 400,
    // position: 'absolute',
    // top: 70,
    // right: 0,
    // zIndex: 9999,
    // background: theme.palette.primary.main,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

@inject('store')
@observer
class MediaBar extends Component {

  state = {
    snackbarMessage: "",
    tagModelOpen: false,
    datePickerOpen: false,
    deleteForReal: false,
  };

  toggleDatePicker = () => {
    this.setState({ datePickerOpen: !this.state.datePickerOpen})
  }

  closeDateModal = (doChange = false) => async () => {
    if (!doChange) return;
    const { media: { date, selectedMedia } } = this.props.store;
    this.setState({ datePickerOpen: !this.state.datePickerOpen });
    const res = await updateAssets({ assets: selectedMedia.slice(), date });

    this.setState({ snackbarMessage: 'Date updated' });
    setTimeout(() => {
      this.setState({ snackbarMessage: '' });
    }, 3000);
  }

  toggleTagModal = () => {
    this.setState({ tagModelOpen: !this.state.tagModelOpen });
  }

  closeTagModal = (doUpdate = false) => () => {
    // console.log('close tag modal', doUpdate);
  }

  fetchMedia = () => {
    // console.log('fetch media');
  }

  deleteManyAssets = async () => {
    const { fetchMedia, store: { media: { selectedMedia, update } } } = this.props;
    if (!this.state.deleteForReal) {
      this.setState({ deleteForReal: true });
      return setTimeout(() => {
        this.setState({ deleteForReal: false });
      }, 5000);
    }
    const promises = [];
    selectedMedia.forEach((id) => promises.push(deleteAsset(id)));
    update('selectedMedia', []);
    await Promise.all(promises);
    fetchMedia();
    this.setState({ deleteForReal: false });
  }

  render() {
    const {
      fetchMedia, toggleDatePicker, closeDateModal, toggleTagModal, closeTagModal, deleteManyAssets,
      state: { datePickerOpen, snackbarMessage, tagModelOpen, deleteForReal }
    } = this;
    const { classes, zoom, toggleDetails, applyTag, showDetails, selectAll, close, moveSelected } = this.props;
    const {
      media: { selectedMedia, media },
      project: { name }
    } = this.props.store;
    return (
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <div className={classes.zoomButtons}>
          <IconButton
            onClick={zoom('in')}
            variant="contained"
            color="secondary"
          >
            <ZoomInIcon style={{ color: '#fff' }} />
          </IconButton>

          <IconButton
            onClick={zoom('out')}
            variant="contained"
            color="secondary"
          >
            <ZoomOutIcon style={{ color: '#fff' }} />
          </IconButton>
        </div>

        <Button
          onClick={toggleDetails}
          variant="contained"
          color="primary"
        >
          {showDetails ? `Hide Details` : `Show Details`}
        </Button>
        <div className={classes.selectAll}>
          <Button
            onClick={selectAll}
            variant="contained"
            color="primary"
          >
            {selectedMedia.length === media.length ? `Deselect All` : `Select All`}
          </Button>
        </div>
        {selectedMedia.length > 0 && (
          <Tooltip
            title="Delete Assets"
            placement="left"
          >
            <Fab
              onClick={deleteManyAssets}
              size="medium"
              color="secondary"
              aria-label="Select All"
              className={classes.margin}
            >
              <DeleteIcon color={deleteForReal ? 'error' : 'inherit'} />
            </Fab>
          </Tooltip>
        )}
        {selectedMedia.length > 0 && (
          <div>
          <Tooltip
            title="Change Date of Selected Assets"
            placement="left"
          >
            <Fab
              onClick={toggleDatePicker}
              size="medium"
              color="secondary"
              aria-label="Tag All"
              className={classes.margin}
            >
              <DateRange />
            </Fab>
          </Tooltip>

          <Tooltip
            title="Apply tags to selected images"
            placement="left"
          >
            <Fab
              onClick={toggleTagModal}
              size="medium"
              color="secondary"
              aria-label="Tag All"
              className={classes.margin}
            >
              <LabelIcon />
            </Fab>
          </Tooltip>

          </div>
        )}
        <Tooltip
          title={`Add media to ${name}`}
          placement="left"
        >
          <Fab
            onClick={close}
            size="medium"
            color="primary"
            aria-label="Add"
            className={classes.margin}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <DatePicker
          onClose={toggleDatePicker}
          open={datePickerOpen}
          close={closeDateModal}
        />
        <ApplyTagsToMedia
          onClose={toggleTagModal}
          open={tagModelOpen}
          close={closeTagModal}
          fetchMedia={fetchMedia}
          handleClose={toggleTagModal}
        />
        <Snackbar snackbarMessage={snackbarMessage} />
      </AppBar>
    );
  }
}

MediaBar.propTypes = {
  zoom: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  toggleDetails: PropTypes.func.isRequired,
  applyTag: PropTypes.func.isRequired,
  showDetails: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  closeChangeLabel: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  moveSelected: PropTypes.func.isRequired,
  fetchMedia: PropTypes.func.isRequired,
};
export default withRouter(withStyles(styles)(MediaBar));
