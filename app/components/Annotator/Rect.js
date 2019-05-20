import React, { Component } from 'react';
import { Rect } from 'react-konva';
import PropTypes from 'prop-types';

export default class ColoredRect extends Component {

  static defaultProps = {
    onTransform: () => {},
    onDragMove: () => {},
    onDragEnd: () => {},
    draggable: false,
    onClick: () => {},
    rotation: 0,
    color: 'red'
  }
  render() {
    const { x, y, w, h, rotation, color, onClick, draggable, name, onDragEnd, onDragMove, onTransform } = this.props;
    return (
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        name={name}
        rotation={rotation}
        draggable={draggable}
        fill={color}
        onClick={onClick}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        onTransform={onTransform}
      />
    );
  }
}

ColoredRect.propTypes = {
  onTransform: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  draggable: PropTypes.bool,
  onClick: PropTypes.func,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  rotation: PropTypes.number,
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
};
