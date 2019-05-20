import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core/utils/helpers';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ImageIcon from '@material-ui/icons/Image';
import BarChartIcon from '@material-ui/icons/BarChart';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

const styles = theme => ({
  root: {
    width: '100%',
  },
  controls: {
    margin: theme.spacing.unit * 3,
  },
  exampleWrapper: {
    position: 'relative',
    height: 380,
  },
  radioGroup: {
    margin: `${theme.spacing.unit}px 0`,
  },
  speedDial: {
    position: 'absolute',
    '&$directionUp, &$directionLeft': {
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 3,
    },
    '&$directionDown, &$directionRight': {
      top: theme.spacing.unit * 2,
      left: theme.spacing.unit * 3,
    },
  },
  directionUp: {},
  directionRight: {},
  directionDown: {},
  directionLeft: {},
});



class SpeedDials extends React.Component {
  state = {
    direction: 'left',
    open: false,
    hidden: false,
    deleteForReal: false,
  };

  componentDidMount() {
    this.setState({ deleteForReal: false });
  }

  getActions = () => {
    const { deleteForReal } = this.state;
    return [
      { icon: <ImageIcon />, name: 'Add Media' },
      { icon: <ViewModuleIcon />, name: 'View Media' },
      { icon: <BarChartIcon />, name: 'Ask A Question' },
      { icon: <ShareIcon />, name: 'Share' },
      { icon: <DeleteIcon color={deleteForReal ? 'error' : 'inherit'} />, name: 'Delete Project' },
    ];
  }

  handleClick = (action) => () => {
    const { deleteForReal } = this.state;
    if (action.name === 'Delete Project' && !deleteForReal) {
      setTimeout(() => {
        this.setState({ deleteForReal: false });
      }, 3000);
      return this.setState({ deleteForReal: true });
    }
    const { onClick } = this.props;
    onClick(action);
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleDirectionChange = (event, value) => {
    this.setState({
      direction: value,
    });
  };

  handleHiddenChange = (event, hidden) => {
    this.setState(state => ({
      hidden,
      // hidden implies !open
      open: hidden ? false : state.open,
    }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { getActions } = this;
    const { classes } = this.props;
    const { direction, hidden, open } = this.state;

    const speedDialClassName = classNames(
      classes.speedDial,
      classes[`direction${capitalize(direction)}`],
    );

    return (
      <div className={classes.root}>
        <div className={classes.exampleWrapper}>
          <SpeedDial
            ariaLabel="SpeedDial example"
            className={speedDialClassName}
            hidden={hidden}
            icon={<SpeedDialIcon />}
            onBlur={this.handleClose}
            onClick={this.handleClick}
            onClose={this.handleClose}
            onFocus={this.handleOpen}
            onMouseEnter={this.handleOpen}
            onMouseLeave={this.handleClose}
            open={open}
            direction={direction}
          >
            {getActions().map(action => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={this.handleClick(action)}
              />
            ))}
          </SpeedDial>
        </div>
      </div>
    );
  }
}

SpeedDials.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(SpeedDials);

// <div className={classes.controls}>
//   <FormControlLabel
//     control={
//       <Switch
//         checked={hidden}
//         onChange={this.handleHiddenChange}
//         value="hidden"
//         color="primary"
//       />
//     }
//     label="Hidden"
//   />
//   <FormLabel component="legend">Direction</FormLabel>
//   <RadioGroup
//     aria-label="Direction"
//     name="direction"
//     className={classes.radioGroup}
//     value={direction}
//     onChange={this.handleDirectionChange}
//     row
//   >
//     <FormControlLabel value="up" control={<Radio />} label="Up" />
//     <FormControlLabel value="right" control={<Radio />} label="Right" />
//     <FormControlLabel value="down" control={<Radio />} label="Down" />
//     <FormControlLabel value="left" control={<Radio />} label="Left" />
//   </RadioGroup>
// </div>
