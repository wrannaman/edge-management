import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Router, { withRouter } from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Snacky from '../Shared/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import RedoIcon from '@material-ui/icons/Redo';
import FilterListIcon from '@material-ui/icons/FilterList';

import { updateAsset } from '../../src/api/asset';

const styles = {
  labels: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'scroll',
  },
  list: {
    borderRadius: 5,
    background: '#f9f8f8',
    padding: 25,
    minWidth: 200,
  },
  bottomNav: {
    // top: 'auto',
    top: 0,
    width: 200,
    zIndex: 9999,
    position: 'absolute',
    right: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

@inject('store')
@observer
class AssetCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarMessage: "",
    };
  }

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  navigate = (direction) => async () => {
    const {
      props: {
        router: { query },
        handleChangePage,
        store: {
          collection: { page, limit, update, annotatingIndex, assets },
          annotation: { setupAnnotation }
        }
      }
    } = this;
    // annotation index
    let newIndex = annotatingIndex;
    if (direction === 'next') newIndex++;
    else newIndex--;

    let newPage = page;

    if (newIndex > assets.length - 1 || !assets[newIndex]) {
      if (direction === 'next') {
        newPage = page + 1;
        newIndex = 0;
      } else {
        newPage = page - 1;
        newIndex = limit - 1;

      }
      if (newPage < 0) {
        newPage = 0;
        newIndex = 0;
      }
      return setTimeout(() => {
        update('annotatingIndex', newIndex);
        return handleChangePage(null, newPage);
      }, 350);
    }
    if (newIndex < 0) {
      newIndex = 0;
    }
    setupAnnotation(assets[newIndex]);
    Router.push({
      pathname: '/annotate',
      query: { ...query, annotation: newIndex },
      shallow: true,
    });
    update('annotatingIndex', newIndex);
  }

  labelChange = (index) => (e) => {
    const {
      props: {
        store: {
          annotation: { boxes, update }
        }
      }
    } = this;

    const copy = boxes.slice();
    copy[index].label = e.target.value;
    update('boxes', copy);
  }

  setColorAndEditing = (color = '#fff', index, editing = -1) => {
    const { props: { store: { annotation: { boxes, update } } } } = this;
    const copy = boxes.slice();
    if (copy[index]) copy[index].color = color;
    update('editing', editing);
    update('boxes', copy);
  }

  activateBox = (index) => () => {
    const { props: { store: { annotation: { COLOR_EDITING } } } } = this;
    this.setColorAndEditing(COLOR_EDITING, index, index);
  }

  blur = (index) => (save = true) => {
    const { props: { store: { annotation: { COLOR_DEFAULT } } } } = this;
    this.setColorAndEditing(COLOR_DEFAULT, index, -1);
    if (save) this.props.save();
  }

  submit = (e) => {
    e.preventDefault();
  }

  deleteBox = (index) => () => {
    const { props: { store: { annotation: { update, boxes } } } } = this;
    const copy = boxes.slice();
    copy.splice(index, 1);
    update('boxes', copy);
  }

  save = () => {
    const { props: { store: {
      annotation: { boxes, scaleFactor },
      collection: { annotatingIndex, assets },
    } } } = this;

    const payload = { boxes: boxes.slice(), id: assets[annotatingIndex].id, scaleFactor };
    updateAsset(payload);
    this.snacky('Saved!');
  }

  applyPrevious = () => {
    const { props: { store: { annotation: { prevBoxes, update } } } } = this;
    if (!prevBoxes.length) return this.snacky('No Previous Boxes');
    update('boxes', prevBoxes.slice());
  }

  blurAll = () => {
    const { blur, props: { store: { annotation: { boxes } } } } = this;
    boxes.forEach((box, index) => blur(index)(false));
  }

  filterIconColor = () => {
    const { query } = this.props.router;
    if (query.unannotated === "true") return "#505050";
    return "#fff";
  }

  filterIconText = () => {
    const { query } = this.props.router;
    if (query.unannotated === "true") return "Show all images";
    return 'Show images without annotations only';

  }

  render() {
    const {
      labelChange,
      activateBox,
      blur,
      submit,
      deleteBox,
      applyPrevious,
      save,
      blurAll,
      state: { snackbarMessage },
      props: {
        classes,
        filter,
        store: {
          annotation: { boxes, width, height }
        }
      }
    } = this;
    return (
      <div
        className={classes.labels}
        style={{  height }}
        onClick={blurAll}
      >
        <List dense={true} className={classes.list}>
          {boxes && boxes.length > 0 && (
            boxes.map((box, index) => (
              <div key={box.uuid}>
                <ListItem
                  onClick={activateBox(index)}
                  key={`label-${box.uuid}`}
                >
                  <ListItemText
                    primary={box.label}
                    secondary={index + 1}
                  />
                  <form
                    className={classes.container}
                    noValidate
                    autoComplete="off"
                    onSubmit={submit}
                  >
                    <TextField
                      label="Label"
                      placeholder="Label"
                      className={classes.textField}
                      value={box.label}
                      onChange={labelChange(index)}
                      margin="normal"
                      onBlur={blur(index)}
                    />
                  </form>
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Delete"
                      onClick={deleteBox(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))
          )}
        </List>
        <div className={classes.bottomNav}>
            <Toolbar className={classes.toolbar}>
              <div>
                <Tooltip title={'Save'}>
                  <IconButton style={{ color: '#fff' }} onClick={save}>
                    <SaveIcon  />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Apply Previous Bounding Boxes'}>
                  <IconButton style={{ color: '#fff' }} onClick={applyPrevious}>
                    <RedoIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={this.filterIconText()}>
                  <IconButton style={{ color: this.filterIconColor() }} onClick={filter({ exclude: 'annotations' })}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Toolbar>
        </div>
        <Snacky
          snackbarMessage={snackbarMessage}
          handleClose={this.handleClose}
        />
      </div>
    );
  }

}

AssetCard.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  router: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,

};

export default withRouter(withStyles(styles)(AssetCard));
