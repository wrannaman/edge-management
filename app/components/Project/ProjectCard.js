import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Router, { withRouter } from 'next/router';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
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

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import DetailsIcon from '@material-ui/icons/Details';
import PageViewIcon from '@material-ui/icons/Pageview';

import { deleteAsset, updateAsset, chopVideo, replaceAssetImage } from '../../src/apiCalls/asset';
import { updateProject, deleteProject } from '../../src/apiCalls/project';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { getBase64, rotateBase64 } from '../../utils/asset';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const TEXT_FIELD_WIDTH = 200;

const styles = {
  card: {
    // maxWidth: 450, //
    // maxHeight: 550,
    // minWidth: 150, //
    padding: '10px 10px 0 10px',
    margin: 15,
    minHeight: 230,
    display: 'flex',
    flexDirection: "column",
    justifyContent: "space-between",
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
class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarMessage: "",
      showTags: {},
    };
  }

  toggleConvertVideoDialog = (id) => () => {
    const { project: { convertVideoDialogOpen, update } } = this.props.store;
    if (convertVideoDialogOpen === id) id = 0;
    update('convertVideoDialogOpen', id);
  }

  _deleteProject = () => {
    const { state: { deleteForReal }, props: { store: { project: { projects, update } }}} = this;
    this.setState({ deleteForReal: !deleteForReal });
    if (deleteForReal) {
      deleteProject(this.props.project.id);
      const cloned = projects.slice();

      let idx = -1;
      cloned.forEach((clone, _idx) => {
        if (clone.id === this.props.project.id) {
          idx = _idx;
        }
      });

      cloned.splice(idx, 1);
      update('projects', cloned);
    } else {
      setTimeout(() => {
        this.setState({ deleteForReal: false });
      }, 3000);
    }
  }

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  handleChange = (name) => (e) => {
    const { index, store: { project: { update, projects } } } = this.props;
    const sliced = projects.slice();
    sliced[index][name] = e.target.value;
    update('projects', sliced);
  }

  submitUpdateProject = (index) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    const {
      props: {
        project,
      },
      snacky
    } = this;
    const cloned = Object.assign({}, project);
    const ret = await updateProject({ id: cloned.id, name: cloned.name, tags: cloned.tags });
    if (ret.project) snacky('Saved', 1000);
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
    const { index, store: { project: { update, projects } } } = this.props;
    const cloned = projects.slice();
    const _tags = cloned[index].tags.slice();
    _tags.splice(chipIndex, 1);
    cloned[index].tags = _tags;
    update('projects', cloned);
  }

  addTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { index, store: { project: { update, projects } } } = this.props;
    const cloned = projects.slice();
    const _tags = cloned[index].tags.slice();
    _tags.push(cloned[index].tag);
    cloned[index].tags = _tags;
    cloned[index].tag = "";
    update('projects', cloned);
    setTimeout(() => {
      this.submitUpdateProject(index)(null);
    }, 300);
  }

  goToDashboard = (projectID) => () => {
    Router.push({
      pathname: '/media',
      query: { projectID },
    });
  }

  toggleTags = (id) => () => {
    const tagsCopy = Object.assign({}, this.state.showTags);
    if (typeof tagsCopy[id] === 'undefined') {
      tagsCopy[id] = true;
    } else if (tagsCopy[id]) {
      tagsCopy[id] = false;
    } else {
      tagsCopy[id] = true;
    }
    this.setState({ showTags: tagsCopy });
  }

  render() {
    const {
      _deleteProject,
      handleChange,
      submitUpdateProject,
      addTag,
      handleDeleteChip,
      onMouseEnter,
      goToDashboard,
      toggleTags,
      state: { deleteForReal, snackbarMessage, showTags },
      props: {
        project,
        classes,
        cardWidth
      }
    } = this;

    return (
      <Card
        className={classes.card}
        onMouseEnter={onMouseEnter}
        style={{ width: cardWidth * 1.14, overflow: 'hidden' }}
        classes={{
          root: 'selectable-nodes', // class name, e.g. `classes-nesting-root-x`
        }}
        id={`card-${project.id}`}
      >
        <CardContent
          style={{
            transition: 'all 0.25s',
            maxHeight: 4000,
            opacity: 1,
            padding: 'inherit',
            height: 'inherit',
          }}
        >
          <Typography variant="h5">
            {project.name}
          </Typography>
          <Typography variant="overline" color="textSecondary">
            {project.numAssets} assets
          </Typography>
          <form
            onSubmit={submitUpdateProject(project.id)}
          >
            {showTags[project.id] ? true : false && (
              <TextField
                id="outlined-with-placeholder"
                label="Asset Name"
                placeholder="Asset Name"
                value={project.name}
                className={classes.textField}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
              />
            )}
            <Tags
              addTag={addTag}
              handleChange={handleChange}
              tag={project.tag}
              tags={project.tags}
              showTags={showTags[project.id] ? true : false}
              textFieldWidth={TEXT_FIELD_WIDTH}
              save={submitUpdateProject(project.id)}
              handleDeleteChip={handleDeleteChip}
            />
          </form>
        </CardContent>
          <CardActions
            style={{
              // position: 'relative',
              // transition: 'all 0.5s',
              // maxHeight: 100,
              // opacity: 1,
              // padding: 'inherit',
              // height: 'inherit',
              display: 'flex',
              // flexDirection: 'column',
              // alignItems: 'flex-end'
            }}
          >
            <div className={classes.flexRow}>
              <Tooltip title={'Delete'}>
                <IconButton
                  aria-label="Delete"
                  onClick={_deleteProject}
                >
                  <DeleteIcon color={deleteForReal ? 'error' : 'inherit'} style={{ width: 25, height: 25 }} />
                </IconButton>
              </Tooltip>
              {showTags[project.id] ? true : false && (
                <Tooltip title={'Save'}>
                  <IconButton
                    aria-label="Save"
                    onClick={submitUpdateProject(project.id)}
                  >
                    <SaveIcon color={'inherit'} style={{ width: 25, height: 25 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={'Show Tags'}>
                <IconButton
                  aria-label="Show Tags"
                  onClick={toggleTags(project.id)}
                >
                  <EditIcon style={{ width: 25, height: 25 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={'View'}>
                <IconButton
                  aria-label="View"
                  onClick={goToDashboard(project.id)}
                >
                  <PageViewIcon style={{ width: 25, height: 25 }} />
                </IconButton>
              </Tooltip>
            </div>
          </CardActions>
        <Snacky
          snackbarMessage={snackbarMessage}
        />
      </Card>
    );
  }

}

ProjectCard.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  cardWidth: PropTypes.number.isRequired,
  router: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(ProjectCard));
