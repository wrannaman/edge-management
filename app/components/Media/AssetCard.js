import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Tags from '../Shared/Tags';
import Snacky from '../Shared/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import { Stage, Layer, Text, Group } from 'react-konva';
import ColoredRect from '../Annotator/Rect';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import DetailsIcon from '@material-ui/icons/Details';
import CropRotateIcon from '@material-ui/icons/CropRotate';
import { deleteAsset, updateAsset, chopVideo, replaceAssetImage } from '../../src/apiCalls/asset';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Router, { withRouter } from 'next/router';
import { getBase64, rotateBase64 } from '../../utils/asset';
import ConvertVideoDialog from './ConvertVideoDialog';
import Button from '@material-ui/core/Button';

const TEXT_FIELD_WIDTH = 200;

const styles = {
  card: {
    // maxWidth: 450, //
    // maxHeight: 550,
    // minWidth: 150, //
    padding: 15,
    margin: 15,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  textField: {
    width: TEXT_FIELD_WIDTH,
  },
  checkbox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
    justifyContent: 'space-around'
  },
  flexLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start'
  }
};

@inject('store')
@observer
class AssetCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteForReal: false,
      snackbarMessage: "",
      stateShowDetails: false,
      width: 0,
      height: 0,
    };
  }

  toggleConvertVideoDialog = (id) => () => {
    const { project: { convertVideoDialogOpen, update } } = this.props.store;
    if (convertVideoDialogOpen === id) id = 0;
    update('convertVideoDialogOpen', id);
  }

  _deleteAsset = () => {
    const { state: { deleteForReal }, props: { store: { media: { media, update } }}} = this;
    this.setState({ deleteForReal: !deleteForReal });
    if (deleteForReal) {
      deleteAsset(this.props.media.id);
      const cloned = media.slice();

      let idx = -1;
      cloned.forEach((clone, _idx) => {
        if (clone.id === this.props.media.id) {
          idx = _idx;
        }
      });

      cloned.splice(idx, 1);
      update('media', cloned);
    }
  }

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  handleChange = (name) => (e) => {
    const { index, store: { media: { update, media } } } = this.props;
    const sliced = media.slice();
    sliced[index][name] = e.target.value;
    update('media', sliced);
  }

  submitUpdateAsset = (index) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    const {
      props: {
        media,
      },
      snacky
    } = this;
    const cloned = Object.assign({}, media);
    const ret = await updateAsset({ id: cloned.id, name: cloned.name, tags: cloned.tags });
    if (ret.success) snacky('Saved', 1000);
    else snacky('Error!!!');
  }

  checkBox = (id) => (e) => {
    const { props: { store: { media: { selectedMedia, update } }}} = this;
    const copy = selectedMedia.slice();
    const checked = e.target.checked;
    if (checked) {
      copy.push(id);
    } else {
      const idx = copy.indexOf(id);
      copy.splice(idx, 1);
    }
    update('selectedMedia', copy);
  }

  // chips
  handleDeleteChip = (chipIndex) => (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const { index, store: { media: { update, media } } } = this.props;
    const cloned = media.slice();
    const _tags = cloned[index].tags.slice();
    _tags.splice(chipIndex, 1);
    cloned[index].tags = _tags;
    update('media', cloned);
  }

  addTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { index, store: { media: { update, media } } } = this.props;
    const cloned = media.slice();
    const _tags = cloned[index].tags.slice();
    _tags.push(cloned[index].tag);
    cloned[index].tags = _tags;
    cloned[index].tag = "";
    update('media', cloned);
    setTimeout(() => {
      this.submitUpdateAsset(index)(null);
    }, 300);
  }

  onLoad = (id) => (e) => {
    const img = document.getElementById(id);
    const naturalHeight = img.naturalHeight;
    const naturalWidth = img.naturalWidth;
    this.setState({
      width: e.target.width,
      height: e.target.height,
      naturalWidth,
      naturalHeight,
    });
  }

  realign = (box, media) => {
    box = Object.assign({}, box);
    let { x, y, w, h } = box;
    const { props: { media: { id }}} = this;
    // if (!document.getElementById(`${id}`).getBoundingClientRect) return console.log('dims not ready');
    const imageSize = document.getElementById(`${id}`).getBoundingClientRect();
    let { naturalWidth, naturalHeight } = this.state;
    if (media && media.original_dimensions) {
      naturalWidth = media.original_dimensions.width;
      naturalHeight = media.original_dimensions.height;
    }
    const widthFactor = (imageSize.width / naturalWidth);
    const heightFactor = (imageSize.height / naturalHeight);
    x = x * widthFactor;
    w = w * widthFactor;
    h = h * heightFactor;
    y = y * heightFactor;
    return { x, y, w, h };
  }

  isImage = (src) => (/^http.+(png|jpeg|gif|jpg)$/i).test(src.split('?')[0]);
  isVideo = (src) => (/^http.+(mkv|mp4|MOV|mov|ogg)$/i).test(src.split('?')[0]);

  vidToImage = (id, index) => (e) => {
    // console.log('INDEX', index)
    // console.log('ID', id);
    // console.log('this props media', toJS(this.props.media));
    if (e && e.stopPropagation) e.stopPropagation();
    const {
      project: {
        videoFidelity,
        applyTagsToImagesFromThisVideo,
        update,
        videoGrouping,
      }
    } = this.props.store;
    chopVideo({ id, videoFidelity, applyTagsToImagesFromThisVideo, videoGrouping });
    this.snacky('Converting... refresh to see new images.');
    // this.toggleConvertVideoDialog();
    // update('applyTagToFace', 'false');
    update('tagToApply', '');
  }

  reprocess = (index) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    const {
      props: {
        media,
        refetch,
      },
      snacky
    } = this;
    const cloned = Object.assign({}, media);
    const ret = await updateAsset({ id: cloned.id, reprocess: true });
    if (ret.success) snacky('Saved', 1000);
    else snacky('Error!!!');
    refetch();
  }

  rotate = (id) => async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const { props: { refetch, store: { media: { media, update }}, index }} = this;
    const rotationRes = await updateAsset({ id, rotate: 90 });
    refetch();

    // const base64 = getBase64(id);
    // const rotated = await rotateBase64(base64, this.state.naturalWidth, this.state.naturalHeight);
    // const copy = media.slice();
    // // copy[index].signed = rotated;
    // // update('media', copy);
    // const res = await replaceAssetImage({ id, base64: rotated });
    // if (res.success && res.signed) {
    //   copy[index].signed = res.signed;
    //   update('media', copy);
    //   this.snacky('Rotated!');
    // } else {
    //   this.snacky('Failed to rotate');
    // }
  }

  getStageDims = (which) => () => {
    const { props: { media: { id }}} = this;
    const imageSize = document.getElementById(`${id}`).getBoundingClientRect();
    return imageSize[which];
  }

  onMouseEnter = () => {
    const { props: { globalDragStart } } = this;
    if (globalDragStart) return;
    // const { props: { globalMouseDown, globalMouseMove, media: { id }, store: { media: { selectedMedia, update } }}} = this;
    // if (globalMouseDown && globalMouseMove) {
    //   const copy = selectedMedia.slice();
    //   const checked = selectedMedia.indexOf(id) !== -1;
    //   console.log('CHECKED', checked)
    //
    //   if (!checked) {
    //     copy.push(id);
    //   } else {
    //     const idx = copy.indexOf(id);
    //     copy.splice(idx, 1);
    //   }
    //   return update('selectedMedia', copy);
    // }
    // this.setState({ stateShowDetails: true });
  }

  toggleShowDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      stateShowDetails: !this.state.stateShowDetails
    });
  };

  render() {
    const {
      _deleteAsset,
      handleChange,
      submitUpdateAsset,
      checkBox,
      addTag,
      handleDeleteChip,
      onLoad,
      realign,
      isImage,
      isVideo,
      vidToImage,
      reprocess,
      rotate,
      getStageDims,
      toggleConvertVideoDialog,
      onMouseEnter,
      toggleShowDetails,
      state: { deleteForReal, snackbarMessage, stateShowDetails, width, height },
      props: {
        cardWidth,
        classes,
        index,
        showDetails,
        showAnnotations,
        media: { signed, name, tags, id, tag, boxes },
        store: {
          media: { selectedMedia },
          project: { convertVideoDialogOpen },
        }
      }
    } = this;

    const blendedShowDetails = showDetails || stateShowDetails;
    const blendedShowAnnotations = showAnnotations || stateShowDetails;

    return (
      <Paper
        className={classes.card}
        onMouseEnter={onMouseEnter}
        style={{ width: cardWidth * 1.14, overflow: 'hidden' }}
        classes={{
          root: 'selectable-nodes', // class name, e.g. `classes-nesting-root-x`
        }}
        id={`card-${id}`}
      >
        <div style={{ position: 'relative', height: '100%', textAlign: 'center' }}>
          {(isImage(signed) || signed.length > 500) && (
            <img
              className={classes.media}
              src={signed}
              title={name}
              crossOrigin={'Anonymous'}
              id={id}
              onLoad={onLoad(id)}
              style={{ userSelect: 'none', width: cardWidth, margin: '0 auto', height: '100%', paddingTop: 0 }}
            />
          )}
          {isVideo(signed) && (
            <video width={cardWidth} controls>
              <source src={signed} type="video/mp4" />
            </video>
          )}
          {width > 0 && height > 0 && blendedShowDetails && blendedShowAnnotations && (
            <Stage
              width={getStageDims('width')()}
              height={getStageDims('height')()}
              style={{ position: 'absolute', top: 0, zIndex: 99 }}
            >
              <Layer>
                {boxes && boxes.length > 0 && boxes.map((box, idx) => {
                  const { x, y, w, h } = realign(box, this.props.media);
                  return (
                    <Group key={box.uuid}>
                      <ColoredRect
                        color={box.color || 'red'}
                        x={x}
                        y={y}
                        w={w}
                        h={h}
                        rotation={box.rotation || 0}
                        draggable
                        name={box.uuid}
                      />
                      <Text
                        text={box.label}
                        fontFamily={'poppins'}
                        fontSize={10}
                        align="center"
                        fill="#fff"
                        x={x + 5}
                        y={y + 5}
                      />
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
          )}
        </div>
        <div className={classes.flexLeft}>
          {boxes && boxes.length > 0 && (
            <Tooltip title={`${boxes.length} Box${boxes.length === 1 ? '' : 'es'}`}>
              <Badge className={classes.margin} badgeContent={boxes.length} color="primary" />
            </Tooltip>
          )}
          <div>
            <Checkbox
              checked={selectedMedia.indexOf(id) !== -1}
              onChange={checkBox(id)}
            />
            <Tooltip
              title={this.state.stateShowDetails ? `Hide Details` : `Show Details`}
            >
              <IconButton
                onClick={toggleShowDetails}
                color="primary"
              >
                <DetailsIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <CardContent
          style={{
            transition: 'all 0.25s',
            maxHeight: (blendedShowDetails) ? 4000 : 0,
            opacity: (blendedShowDetails) ? 1 : 0,
            padding: (blendedShowDetails) ? 'inherit' : 0,
            height: (blendedShowDetails) ? 'inherit' : 0,
          }}
        >
          <form
            onSubmit={submitUpdateAsset(index)}
          >
            <TextField
              id="outlined-with-placeholder"
              label="Asset Name"
              placeholder="Asset Name"
              value={name}
              className={classes.textField}
              onChange={handleChange('name')}
              margin="normal"
              variant="outlined"
            />
            <Tags
              addTag={addTag}
              handleChange={handleChange}
              tag={tag}
              tags={tags}
              textFieldWidth={TEXT_FIELD_WIDTH}
              save={submitUpdateAsset(index)}
              handleDeleteChip={handleDeleteChip}
            />
          </form>
        </CardContent>

          <CardActions
            style={{
              position: 'relative',
              transition: 'all 0.5s',
              maxHeight: (blendedShowDetails) ? 100 : 0,
              opacity: (blendedShowDetails) ? 1 : 0,
              padding: (blendedShowDetails) ? 'inherit' : 0,
              height: (blendedShowDetails) ? 'inherit' : 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}
          >
            <div className={classes.flexRow}>
              <Tooltip title={'Delete'}>
                <IconButton
                  aria-label="Delete"
                  onClick={_deleteAsset}
                >
                  <DeleteIcon color={deleteForReal ? 'error' : 'inherit'} style={{ width: 25, height: 25 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={'Save'}>
                <IconButton
                  aria-label="Save"
                  onClick={submitUpdateAsset(index)}
                >
                  <SaveIcon color={'inherit'} style={{ width: 25, height: 25 }} />
                </IconButton>
              </Tooltip>
              {isImage(signed) && (
                <Tooltip title={'Rotate'}>
                  <IconButton
                    aria-label="Rotate"
                    onClick={rotate(id)}
                  >
                    <CropRotateIcon style={{ width: 25, height: 25 }} />
                  </IconButton>
                </Tooltip>
              )}
              {isVideo(signed) && (
                <Tooltip title={'Convert Video To Images'}>
                  <IconButton
                    aria-label="Convert to images"
                    onClick={toggleConvertVideoDialog(id)}
                  >
                    <BurstModeIcon style={{ width: 25, height: 25 }} />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </CardActions>
          <ConvertVideoDialog
            open={convertVideoDialogOpen === id}
            handleClose={toggleConvertVideoDialog(id)}
            vidToImage={vidToImage(id)}
          />

        <Snacky
          snackbarMessage={snackbarMessage}
        />
      </Paper>
    );
  }

}

AssetCard.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  media: PropTypes.object.isRequired,
  showDetails: PropTypes.bool.isRequired,
  showAnnotations: PropTypes.bool.isRequired,
  cardWidth: PropTypes.number.isRequired,
  router: PropTypes.object.isRequired,
  globalDragStart: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(AssetCard));
