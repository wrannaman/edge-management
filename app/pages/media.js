import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Router, { withRouter } from 'next/router';
import DragSelect from 'dragselect';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';

import Nav from '../components/Nav/Side';
import Upload from '../components/Media/Upload';
import AssetCard from '../components/Media/AssetCard';
import ChangeLabels from '../components/Media/ChangeLabels';
import MoveMedia from '../components/Media/MoveMedia';
import ApplyTagsToMedia from '../components/Media/ApplyTagsToMedia';
import ClassDistributions from '../components/Media/ClassDistributions';
import Search from '../components/Nav/Search';
import MediaBar from '../components/Media/MediaBar';

import { fetchProject } from '../src/apiCalls/project';
import { fetchMedia } from '../src/apiCalls/asset';

import Auth from '../src/Auth';

const styles = theme => ({
  root: {
  },
  media: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    // paddingTop: 55,
    width: '100%',
    paddingBottom: 75,
    paddingTop: 50,
    // background: 'blue'
  },
  collectionNoItems: {
    width: '60%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginTop: 25,
  },

  topNav: {
    position: 'absolute',
    top: 63,
    float: 'right',
    // zIndex: 100,
    width: '29%',
    right: 0,
    zIndex: 2,
  }
});

@inject('store')
@observer
class Media extends React.Component {
  state = {
    waiting: true,
    open: false,
    mediaSimple: [],
    showSelectAll: false,
    showApplyTag: false,
    showChangeLabel: false,
    showDetails: false,
    showAnnotations: false,
    cardWidth: 250,
    globalDragStart: false,
  };

  componentDidMount = async () => {
    this.init();
  }

  componentWillUpdate(nextProps, nextState) {
    const { router: { query } } = nextProps;
    if (this.props.router.query.projectID !== query.projectID) {
      this.init();
    }
  }

  init = async () => {
    const { props: { router: { query }, store: { auth: { checkTokenAndSetUser } } } } = this;
    this.auth = new Auth();
    const { projectID } = query;
    if (!this.auth.isAuthenticated()) {
      Router.push({ pathname: '/' });
    }
    if (!projectID) {
      Router.push({ pathname: '/dashboard' });
    }
    const { access_token, id_token } = this.auth.getSession();
    await checkTokenAndSetUser({ access_token, id_token });


    // const media = await fetchMedia(id);
    // this.setState({ mediaSimple: media.media });
    setTimeout(() => {
      this.fetchProject();
      this.fetchMediaWrap(false, true);
    }, 400);

    setTimeout(() => {
      this.setupDragSelect();
    }, 1000);
  }

  dragSelectCallback = (elements) => {
    if (!this.state.globalDragStart) return;
    const { props: { store: { media: { selectedMedia, update } }}} = this;
    const ids = [];
    elements.forEach((ele) => ids.push(ele.id.replace('card-', '')));
    let copy = selectedMedia.slice();

    // copies exist
    const toRemove = [];
    let toRemoveIndex = [];
    ids.forEach((id) => {
      if (copy.indexOf(id) !== -1) {
        toRemove.push(id);
        toRemoveIndex.push(copy.indexOf(id));
      }
    });

    copy = copy.concat(ids);
    copy = [...new Set(copy)];
    toRemoveIndex = toRemoveIndex.sort((a, b) => { return b - a; });
    for (let i = toRemoveIndex.length - 1; i >= 0; i--) {
      copy.splice(toRemoveIndex[i], 1);
    }

    update('selectedMedia', copy);
    this.setState({ globalDragStart: false });
  }

  dragStart = (element) => {
    this.setState({ globalDragStart: true });
  }

  setupDragSelect = () => {
    if (this.ds) {
      this.ds.stop();
      this.ds = null;
    }
    this.ds = new DragSelect({
      selectables: document.getElementsByClassName('selectable-nodes'), // node/nodes that can be selected. This is also optional, you could just add them later with .addSelectables.
      selector: document.getElementById('rectangle'), // draggable element. By default one will be created.
      area: document.getElementById('area'), // area in which you can drag. If not provided it will be the whole document.
      customStyles: false, // If set to true, no styles (except for position absolute) will be applied by default.
      multiSelectKeys: ['ctrlKey', 'shiftKey', 'metaKey'], // special keys that allow multiselection.
      multiSelectMode: false, // If set to true, the multiselection behavior will be turned on by default without the need of modifier keys. Default: false
      autoScrollSpeed: 3,  // Speed in which the area scrolls while selecting (if available). Unit is pixel per movement. Set to 0 to disable autoscrolling. Default = 1
      onDragStart: () => {
        // console.log('start');
      }, // fired when the user clicks in the area. This callback gets the event object. Executed after DragSelect function code ran, befor the setup of event listeners.
      onDragMove: this.dragStart, // fired when the user drags. This callback gets the event object. Executed before DragSelect function code ran, after getting the current mouse position.
      onElementSelect: function(element) {}, // fired every time an element is selected. (element) = just selected node
      onElementUnselect: function(element) {}, // fired every time an element is de-selected. (element) = just de-selected node.
      callback: this.dragSelectCallback
    });

    // // if you add the function to a variable like we did, you have access to all its functions
    // // and can now use start() and stop() like so:
    // ds.getSelection();  // returns all currently selected nodes
    // ds.addSelectables(document.getElementsByClassName('selectable-node'));  // adds elements that can be selected. Intelligent algorithm never adds elements twice.
    // ds.break();  // used in callbacks to disable the execution of the upcoming code. It will not teardown the functionality.
    // ds.stop();  // will teardown/stop the whole functionality
    // ds.start();  // reset the functionality after a teardown
    // // and many more, see "methods" section in documentation
  }

  fetchProject = async () => {
    const { router: { query }, store: { project: { setProject } } } = this.props;
    const { projectID } = query;
    if (!projectID) {
      return setTimeout(() => {
        this.fetchProject();
      }, 200);
    }
    const projectRes = await fetchProject({ ...query });
    setProject(projectRes.project);
  }

  fetchMediaWrap = async (bypassCache = false, initialLoad = false) => {
    try {
      const { store: { media: { mediaResponse, limit, total, page, search, update } } } = this.props;
      const { query } = this.props.router;
      if (!query.projectID) return Router.push('/dashboard');
      const _page = query && query.page ? query.page : page;
      const _search = query && query.search ? query.search : '';
      let _limit = query && query.limit ? query.limit : null;
      if (query && typeof query.page !== 'undefined') update('page', Number(query.page));
      if (_limit !== limit) update('limit', Number(_limit));
      else _limit = limit;
      if (_search && _search !== search) update('search', _search);

      const mediaRes = await fetchMedia({ limit: _limit, page: typeof query.page !== 'undefined' ? query.page : page, search: _search, id: query.projectID });
      if (mediaRes.media) {
        mediaResponse(mediaRes.media);
        if (initialLoad && mediaRes.media.docs.length === 0) {
          this.setState({ open: true });
        }
      }
      this.setState({ waiting: false });

      Router.push({
        pathname: '/media',
        query: { search: _search, limit: _limit, page: _page, projectID: query.projectID },
        shallow: true,
      });
      this.setupDragSelect();
    } catch (e) {
      console.error('media ', e);
    }
  }

  close = async () => {
    const { fetchMediaWrap, state: { open }, props: { router: { query } } } = this;
    if (open === true) {
      this.setState({ waiting: true });
      // fetchMedia(query.projectID);
      // const mediaRes = await fetchMedia(query.projectID);
      // if (mediaRes.success) set(mediaRes.collection);
      await fetchMediaWrap();
      this.setState({ waiting: false });
    }
    this.setState({ open: !open });
    setTimeout(() => {
      const up = document.getElementsByClassName('uppy-DashboarAddFiles-info');
      if (up && up.length) up[0].remove();
    }, 100);
  };

  moveSelected = () => {
    const { state: { showSelectAll }} = this;
    this.setState({ showSelectAll: !showSelectAll });
  }

  applyTag = () => {
    const { state: { showApplyTag }} = this;
    this.setState({ showApplyTag: !showApplyTag });
  }

  closeApplyTag = () => {
    const { state: { showApplyTag }} = this;
    this.setState({ showApplyTag: !showApplyTag });
  }

  closeChangeLabel = () => {
    const { state: { showChangeLabel }} = this;
    this.setState({ showChangeLabel: !showChangeLabel });
  }

  selectAll = () => {
    const {
      props: { store: { media: { media, selectedMedia, update } } },
    } = this;
    if (selectedMedia.length > 0) {
      update('selectedMedia', []);
    } else {
      const ids = [];
      media.forEach((asset) => ids.push(asset.id));
      update('selectedMedia', ids);
    }
  }

  onSearch = async (e, text) => {
    const { store } = this.props;
    const { media: { update, search } } = store;
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const querySearch = text;
    if (querySearch !== search) update('search', querySearch);
    setTimeout(() => {
      this.fetchMediaWrap();
    }, 200);
  }

  handleChangePage = async (a, nextPage) => {
    const { query } = this.props.router;
    const { store: { media: { page, limit, update, mediaResponse, search }, project: { id } } } = this.props;
    const _search = query && query.search ? query.search : search;
    if (_search !== search) update('search', _search);
    if (nextPage !== page) update('page', nextPage);
    const mediaRes = await fetchMedia({ limit, page: nextPage, search: _search, id });
    if (mediaRes.media) mediaResponse(mediaRes.media);
    this.setupDragSelect();
    Router.push({
      pathname: '/media',
      query: { search: _search, limit, page: nextPage, projectID: id },
      shallow: true,
    });
  }

  handleChangeRowsPerPage = async (rows) => {
    const { store: { media: { page, limit, update, search, mediaResponse }, project: { id } } } = this.props;

    const _limit = Number(rows.target.value);
    if (_limit !== limit) update('limit', _limit);

    const mediaRes = await fetchMedia({ limit: _limit, page, search, id });
    if (mediaRes.media) mediaResponse(mediaRes.media);

    Router.push({
      pathname: '/media',
      query: { search, limit: _limit, page, projectID: id },
      shallow: true,
    });
    this.setupDragSelect()
  }

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails, showAnnotations: !this.state.showAnnotations });
  }

  zoom = (direction) => () => {
    const prevState = Object.assign({}, this.state);
    if (prevState.showAnnotations) this.setState({ showAnnotations: false });
    let { state: { cardWidth }} = this;
    if (direction === 'in') cardWidth += 25;
    else cardWidth -= 25;

    if (cardWidth < 175) cardWidth = 175;
    if (cardWidth > 500) cardWidth = 500;


    this.setState({ cardWidth });
    if (prevState.showAnnotations) {
      setTimeout(() => {
        this.setState({ showAnnotations: true });
      }, 300);
    }

  }

  render() {
    const {
      close,
      moveSelected,
      selectAll,
      fetchMediaWrap,
      onSearch,
      handleChangePage,
      handleChangeRowsPerPage,
      applyTag,
      closeApplyTag,
      toggleDetails,
      zoom,
      closeChangeLabel,
      props: {
        classes,
        store: {
          project: { name },
          media: { media, total, limit, page, assetClasses }
        }
      },
      state: { globalDragStart, showChangeLabel, showAnnotations, waiting, open, showSelectAll, mediaSimple, showApplyTag, showDetails, cardWidth },
    } = this;
    // if (waiting) return ('...');

    return (
      <div className={classes.root}>
        <Nav
          title={`${name} - Media`}
          search={(
            <Search
              type="Project"
              onSearch={onSearch}
              route="media"
            />
          )}
          route="media"
          onSearch={onSearch}
          showSearch={true}
        >

          <div className={classes.topNav}>
            <Upload
              close={close}
              open={open}
              fetch={fetchMediaWrap}
            />

            <TablePagination
              component="div"
              count={total}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              rowsPerPage={limit}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
          <div
            className={classes.media}
            id="area"
          >
            {!waiting && media && media.length > 0 && (
              media.map((asset, index) => (
                <AssetCard
                  className={'selectable-nodes'}
                  key={`${asset.id}`}
                  media={asset}
                  index={index}
                  showDetails={showDetails}
                  showAnnotations={showAnnotations}
                  cardWidth={cardWidth}
                  globalDragStart={globalDragStart}
                  refetch={fetchMediaWrap}
                />
              ))
            )}
          </div>

          {media && media.length === 0 && (
            <div className={classes.collectionNoItems}>
              <Typography variant="caption">
                This project doesnt have any images. Add some with the plus button.
              </Typography>
            </div>
          )}

          <MediaBar
            zoom={zoom}
            toggleDetails={toggleDetails}
            applyTag={applyTag}
            showDetails={showDetails}
            selectAll={selectAll}
            closeChangeLabel={closeChangeLabel}
            close={close}
            moveSelected={moveSelected}
            fetchMedia={fetchMediaWrap}
          />
          {showSelectAll && (
            <MoveMedia
              media={mediaSimple}
              open={showSelectAll}
              handleClose={moveSelected}
              fetchMedia={fetchMediaWrap}
            />
          )}
          {showApplyTag && (
            <ApplyTagsToMedia
              open={showApplyTag}
              handleClose={closeApplyTag}
              fetchMedia={fetchMediaWrap}
            />
          )}
          {showChangeLabel && (
            <ChangeLabels
              open={showChangeLabel}
              handleClose={closeChangeLabel}
              fetchMedia={fetchMediaWrap}
            />
          )}
          {showDetails && (
            <div className={classes.media}>
              <ClassDistributions
                assetClasses={assetClasses}
                totalAssets={total}
                tiny={false}
                widthFactor={75}
                height={400}
              />
            </div>
          )}
        </Nav>
      </div>
    );
  }
}

Media.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Media));
