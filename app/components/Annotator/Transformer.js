import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import { Transformer } from 'react-konva';

const styles = { };

@inject('store')
@observer
class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName, isTransformingChange, transformEnd } = this.props;

    const selectedNode = stage.findOne(`.${selectedShapeName}`);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      isTransformingChange(true);
      // attach to another node
      this.transformer.attachTo(selectedNode);

      // selectedNode.on('transform', () => {
      //   const rect = selectedNode.getClientRect({ skipTransform: true});
      //   console.log('RECT', rect)
      //   const obj = {
      //     x: selectedNode.x(),
      //     y: selectedNode.y(),
      //     scaleX: selectedNode.scaleX(),
      //     scaleY: selectedNode.scaleY(),
      //     rotation: selectedNode.rotation(),
      //     width: selectedNode.width(),
      //     height: selectedNode.height(),
      //     // rect,
      //     // abs: selectedNode.getAbsoluteScale(),
      //     // scale: selectedNode.getAbsoluteTransform(),
      //   };
      //   transformEnd(obj);
      // });

    } else {
      isTransformingChange(false);
      if (selectedNode) selectedNode.off('transform');
      // remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
        enabledAnchors={['bottom-center', 'bottom-right', 'middle-right']}
      />
    );
  }
}

TransformerComponent.propTypes = {
  selectedShapeName: PropTypes.string.isRequired,
  isTransformingChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(TransformerComponent);
