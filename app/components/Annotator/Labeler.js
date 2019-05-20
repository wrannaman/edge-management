import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import { Stage, Layer, Text, Group, Line } from 'react-konva';
import ColoredRect from './Rect';
import Snacky from '../Shared/Snackbar';
import TransformerComponent from './Transformer';
import { updateAsset } from '../../src/api/asset';

const styles = {
  labelerContainer: {
    // height: '60%',
    position: 'relative',
    // margin: '0 auto',
    border: '1px solid black',
    outline: 'none'
  },
  rectArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    outline: 'none',
  },
  img: {
    outline: 'none',
    height: '100%',
    // maxHeight: 500,
  }
};

@inject('store')
@observer
class Labeler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verticalPoints: [],
      horizontalPoints: [],
      snackbarMessage: "",
      waiting: true,
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { store: { annotation: { editing }} } = nextProps;
  }

  onMouseDown = (e) => {
    setTimeout(() => {
      const {
        props: {
          store: {
            annotation: { id, update, active, COLOR_NEW, COLOR_DEFAULT, boxes, editing },
          },
        },
      } = this;
      if (this.isDown || this.isTransforming || editing !== -1) return;
      const bbox = document.getElementById(`img-${id}`).getBoundingClientRect();

      if (this.isTransforming) {
        const parent = e.target.getParent();
        const clickedOnTransformer = parent && parent.className && parent.className === 'Transformer' ? true : false;
        // do nothing
        if (clickedOnTransformer) return;
        const copy = boxes.slice();
        if (copy[editing]) {
          copy[editing].color = COLOR_DEFAULT;
          update('boxes', copy);
        }
        update('editing', -1);
      }
      this.isDown = true;
      const newActive = Object.assign({}, active);
      newActive.x = e.evt.clientX - bbox.x;
      newActive.y = e.evt.clientY - bbox.y;
      newActive.color = COLOR_NEW;
      update('active', newActive);
    }, 100);
  }

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  onMouseMove = (e) => {
    const {
      props: {
        store: {
          annotation: { id, update, active, editing },
        },
      },
    } = this;

    if (!this.isDown || this.isTransforming || editing !== -1) return;


    const bbox = document.getElementById(`img-${id}`).getBoundingClientRect();
    const newActive = Object.assign({}, active);
    newActive.w = (e.clientX - bbox.x) - active.x;
    newActive.h = (e.clientY - bbox.y) - active.y;
    // for bb click events
    if (newActive.w < 5 || newActive.h < 5) return;
    update('active', newActive);
  }
  onMouseUp = (e) => {
    const {
      props: {
        store: {
          annotation: { id, update, active, boxes, editing, COLOR_EDITING, COLOR_DEFAULT },
        },
      },
    } = this;
    if (!this.isDown || this.isTransforming || editing !== -1) return;

    const newActive = Object.assign({}, active);
    const bbox = document.getElementById(`img-${id}`).getBoundingClientRect();
    newActive.w = (e.clientX - bbox.x) - active.x;
    newActive.h = (e.clientY - bbox.y) - active.y;
    newActive.color = COLOR_EDITING;
    newActive.uuid = uuid.v4();
    newActive.label = "";
    newActive.scaleFactor = 1;

    // for bb click events
    if (newActive.w < 5 || newActive.h < 5) return;

    const _boxes = boxes.slice();
    _boxes.push(newActive);
    if (_boxes[_boxes.length - 2]) _boxes[_boxes.length - 2].color = COLOR_DEFAULT;
    update('active', { x: 0, y: 0, w: 0, h: 0, label: "", scaleFactor: 1 });
    update('boxes', _boxes);
    update('editing', _boxes.length - 1);
    this.isDown = false;
    this.isTransforming = false;
  }
  annotationClick = (index) => () => {
    if (this.isTransforming) return;
    const { props: { store: { annotation: { update, boxes, editing, COLOR_DEFAULT, COLOR_EDITING } } } } = this;
    if (index === editing) return;
    const copy = boxes.slice();
    copy[index].color = COLOR_EDITING;
    if (copy[editing]) copy[editing].color = COLOR_DEFAULT;
    update('editing', index);
    update('active', { x: 0, y: 0, w: 0, h: 0, label: "", scaleFactor: 1 });
  }

  isTransformingChange = (state) => {
    this.isTransforming = state;
  }

  crosshairs = (id) => e => {
    const bbox = document.getElementById(`img-${id}`).getBoundingClientRect();
    const x = e.evt.clientX - bbox.x;
    const y = e.evt.clientY - bbox.y;
    const verticalPoints = [x, 0, x, bbox.height];
    const horizontalPoints = [0, y, bbox.width, y];
    this.setState({ verticalPoints, horizontalPoints });
  }

  transformEnd = (updated, index = null) => {
    const {
      props: {
        store: {
          annotation: { update, boxes, editing },
        },
      },
    } = this;

    let boxIndex = editing;
    if (index) boxIndex = index;
    const copy = boxes.slice();
    // updating x and y for drag / drop
    if (updated.x && index !== null) copy[boxIndex].x = updated.x;
    if (updated.y && index !== null) copy[boxIndex].y = updated.y;
    update('boxes', copy);
  }

  dragEnd = index => e => {
    this.transformEnd({ x: e.evt.dragEndNode.x(), y: e.evt.dragEndNode.y() }, index);
    setTimeout(() => {
      this.isDown = false;
      this.isTransforming = false;
      this.props.save();
    }, 500);
  }

  onDragMove = (index) => e => {
    const { props: { store: { annotation: { update, editing } } } } = this;
    if (editing !== index) update('editing', index);

    this.transformEnd({ x: e.currentTarget.x(), y: e.currentTarget.y() }, index);
    if (this.isDown && this.isTransforming) return;
    this.isDown = true;
    this.isTransforming = true;
  }

  onTransform = (index) => (e) => {
    const { props: { store: { annotation: { update, boxes } } } } = this;
    const copy = boxes.slice();
    const sx = e.currentTarget.scaleX();
    const sy = e.currentTarget.scaleY();
    if (copy[index].scaleX !== sx) copy[index].w = copy[index].w * sx;
    if (copy[index].scaleY !== sy) copy[index].h = copy[index].h * sy;
    copy[index].scaleX = sx;
    copy[index].scaleY = sy;
    copy[index].rotation = e.currentTarget.rotation();
    update('boxes', copy);
  }

  onLoad = (id) => () => {
    const { annotation: { update, boxes, haveScaled } } = this.props.store;
    const img = document.getElementById(`img-${id}`);
    const naturalHeight = img.naturalHeight;
    const naturalWidth = img.naturalWidth;
    let scaleFactor = 1;

    // roughly 50% of the screen.
    scaleFactor = (window.innerWidth * 0.50) / naturalWidth;
    const scaledWidth = naturalWidth * scaleFactor;
    const scaledHeight = naturalHeight * scaleFactor;

    // scale the boxes to this scale factor;
    let newBoxes = boxes.slice();
    if (scaleFactor && boxes.length > 0) {
      newBoxes = newBoxes.map((box) => {
        box = Object.assign({}, box); // copy;
        box.x = Math.round(box.x * scaleFactor);
        box.y = Math.round(box.y * scaleFactor);
        box.w = Math.round(box.w * scaleFactor);
        box.h = Math.round(box.h * scaleFactor);
        return box;
      });
      if (!haveScaled) update('boxes', newBoxes);
    }

    updateAsset({ id, width: naturalWidth, height: naturalHeight, scaleFactor });
    update('width', scaledWidth);
    update('height', scaledHeight);
    update('scaleFactor', scaleFactor);
    update('haveScaled', true);
    this.setState({ waiting: false });
  }

  render() {
    const {
      onMouseDown,
      onMouseUp,
      onMouseMove,
      annotationClick,
      isTransformingChange,
      crosshairs,
      transformEnd,
      dragEnd,
      onDragMove,
      onTransform,
      onLoad,
      state: { verticalPoints, horizontalPoints, snackbarMessage, waiting },
      props: {
        classes,
        store: {
          annotation: {
            src,
            width,
            height,
            boxes,
            active,
            editing,
            id
          },
        }
      }
    } = this;
    return (
      <div
        className={classes.labelerContainer}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ width: width + 1, height: height + 1 }}
      >
        <img
          src={src}
          id={`img-${id}`}
          className={classes.img}
          onLoad={onLoad(id)}
        />
        {!waiting && (
          <Stage
            width={width}
            height={height}
            style={styles.rectArea}
            onMouseDown={onMouseDown}
            onMouseMove={crosshairs(id)}
          >
            {editing === -1 && (
              <Layer>
                <Line
                  points={verticalPoints}
                  fill={'rgba(255, 0, 0, 0.4)'}
                  strokeWidth={1}
                  stroke={'rgba(255, 0, 0, 0.4)'}
                />
                <Line
                  points={horizontalPoints}
                  fill={'rgba(255, 0, 0, 0.4)'}
                  strokeWidth={1}
                  stroke={'rgba(255, 0, 0, 0.4)'}
                />
              </Layer>
            )}
            <Layer>
              <ColoredRect
                color={active.color}
                x={active.x}
                y={active.y}
                w={active.w}
                h={active.h}
                transformEnd={transformEnd}
              />
            </Layer>
            <Layer>
              {boxes && boxes.length > 0 && boxes.map((box, index) => {
                return (
                  <Group key={box.uuid}>
                    <ColoredRect
                      color={box.color || 'red'}
                      x={box.x}
                      y={box.y}
                      w={box.w}
                      h={box.h}
                      rotation={box.rotation || 0}
                      draggable
                      name={box.uuid}
                      onClick={annotationClick(index)}
                      onMouseEnter={annotationClick(index)}
                      onMouseLeave={annotationClick(index)}
                      onDragEnd={dragEnd(index)}
                      onDragMove={onDragMove(index)}
                      onTransform={onTransform(index)}
                    />
                    <Text
                      text={box.label || String(index + 1)}
                      fontFamily={'poppins'}
                      fontSize={15}
                      align="center"
                      fill="#fff"
                      x={box.x + 5}
                      y={box.y + 5}
                    />
                  </Group>
                );
              })}
              <TransformerComponent
                selectedShapeName={editing !== -1 && boxes[editing] && boxes[editing].uuid ? boxes[editing].uuid : ""}
                isTransformingChange={isTransformingChange}
                transformEnd={transformEnd}
              />
            </Layer>
          </Stage>
        )}
        <Snacky
          snackbarMessage={snackbarMessage}
        />
      </div>
    );
  }
}

Labeler.propTypes = {
  store: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
};

export default withStyles(styles)(Labeler);
