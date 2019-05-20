import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelectable } from 'react-selectable-fast';

class Selectable extends Component {

  render() {
    const { key, selectableRef, selected, selecting } = this.props;
    return (
      <div
        key={key}
        ref={selectableRef}
        selected={selected}
        selecting={selecting}
      >
        {this.props.children}
      </div>
    )
  }
}

Selectable.propTypes = {

}
export default createSelectable(Selectable);
