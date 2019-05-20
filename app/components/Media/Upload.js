import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';
import Router from 'next/router';
const { uploader } = require('../../config');
// mui
import Typography from '@material-ui/core/Typography';
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
// import { create, update } from '../../src/apiCalls/collection';
import { createAsset } from '../../src/apiCalls/asset';
// import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import uuid from 'uuid';

// Import the plugins
const Uppy = require('@uppy/core');
// const Tus = require('@uppy/tus');
// const XHRUpload = require('@uppy/xhr-upload');
// const Dashboard = require('@uppy/dashboard')
const Webcam = require('@uppy/webcam');
const Url = require('@uppy/url');
const Instagram = require('@uppy/instagram');
const Dropbox = require('@uppy/dropbox');
const GoogleDrive = require('@uppy/google-drive');
const AwsS3 = require('@uppy/aws-s3');
const ms = require('ms');

const { DragDrop, ProgressBar, StatusBar, Dashboard } = require('@uppy/react')

import '../../static/css/fix.css';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/progress-bar/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import '@uppy/webcam/dist/style.css';

import Auth from '../../src/Auth';

const styles = theme => {
  return ({
  });
};

@inject('store')
@observer
class Upload extends React.Component {

  static defaultProps = {
    // open: false,
  }

  fileAdded = (file) => {
    // console.log('Added file', file)
  }

  fileRemoved = (file) => {
    // console.log('Removed file', file)
  }

  upload = (data) => {
    // console.log('upload DATA', data)
    const { id, fileIDs } = data;
    // data object consists of `id` with upload ID and `fileIDs` array
    // with file IDs in current upload
    // data: { id, fileIDs }
    // console.log(`Starting upload ${id} for files ${fileIDs}`)
  }

  uploadProgress = (file, progress) => {
    // file: { id, name, type, ... }
    // progress: { uploader, bytesUploaded, bytesTotal }
    // console.log(file.id, progress.bytesUploaded, progress.bytesTotal)
  }

  uploadSuccess = (file, response) => {
    // console.log(file.name, response.uploadURL)
    // handle successful file uploads
  }

  complete = async (result) => {
    const { props: { fetch, store: { project: { id }}} } = this;
    // console.log('id ', id, this.props.store.project);
    const res = await createAsset({ assets: result.successful, id });
    if (res.assets) {
      fetch()
    }
  }

  uploadError = (file, error, response) => {
    console.error('error with file:', file.id);
    console.error('error message:', error);
  }

  onBeforeFileAdded = (currentFile, files) => {
    // adds collection name as prefix
    const { props: { store: { project: { id, name, asset }}} } = this;
    let originalName = currentFile.name;
    originalName = originalName.split('.');
    const extension = originalName[originalName.length - 1];
    originalName.pop();
    const nameOnly = `${originalName.join('.')}-${uuid.v4()}`;
    const modifiedFile = Object.assign({}, currentFile, { name: `${id}/${nameOnly}.${extension}` });
    return modifiedFile;
  }

  async componentDidMount() {
    const { fileAdded, fileRemoved, upload, uploadProgress, uploadSuccess, complete, uploadError, onBeforeFileAdded } = this;
    const { props: { store: { auth: { checkTokenAndSetUser } } } } = this;

    this.auth = new Auth();
    const { access_token, id_token } = this.auth.getSession();
    await checkTokenAndSetUser({ access_token, id_token });

    const uppy = Uppy({
      meta: { type: 'avatar' },
      restrictions: { maxNumberOfFiles: 10 },
      autoProceed: true,
      allowMultipleUploads: true,
      onBeforeFileAdded
    });

    uppy.use(Webcam, { id: 'Webcam' });

    uppy.use(GoogleDrive, { id: 'GoogleDrive', companionUrl: uploader });
    uppy.use(Url, { id: 'Url', companionUrl: uploader });
    uppy.use(Dropbox, { id: 'Dropbox', companionUrl: uploader });
    uppy.use(Instagram, { id: 'Instagram', companionUrl: uploader });

    uppy.use(AwsS3, {
      limit: 100,
      timeout: ms('2 minute'),
      companionUrl: uploader
    });


    uppy.on('file-added', fileAdded);
    uppy.on('file-removed', fileRemoved);
    uppy.on('upload', upload);
    uppy.on('upload-progress', uploadProgress);
    uppy.on('upload-success', uploadSuccess);
    uppy.on('complete', complete);
    uppy.on('upload-error', uploadError);

    this.uppy = uppy;

    this.setState({ uppyDoneLoading: true });
  }


  render() {
    const { uppy, props: { open, close, classes } } = this;
    if (!uppy) return null;
    return (
      <div>
        <Dialog
          open={open}
          onClose={close}
          aria-labelledby="form-dialog-title"
          maxWidth={'xl'}
        >
          <DialogTitle id="form-dialog-title">Upload Photos or video</DialogTitle>
          <DialogContent>
            <Dashboard
              uppy={uppy}
              plugins={['Webcam', 'GoogleDrive', 'Tus', 'Url', 'Instagram', 'Dropbox']}
            />
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={close} color="default">
              Cancel
            </Button>
            <Button onClick={close} color="primary" variant="contained">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
    // return (
    //   <div>
    //     <Typography>
    //       Upload photos or video!
    //     </Typography>
    //     <Dashboard
    //       uppy={uppy}
    //       plugins={['Webcam', 'GoogleDrive', 'Tus', 'Url', 'Instagram', 'Dropbox']}
    //     />
    //   </div>
    // )
  }
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
};

export default withStyles(styles)(Upload);
