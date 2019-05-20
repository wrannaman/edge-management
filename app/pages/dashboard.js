import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

// mui
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import ProjectCard from '../components/Project/ProjectCard';

// next
import Router, { withRouter } from 'next/router';

// ours
import Side from '../components/Nav/Side';

import Intro from '../components/Walkthrough/Intro';

import Auth from '../src/Auth';
import { flex_row } from '../utils/styles';
import { primary } from '../utils/colors';
import { fetchProjects } from '../src/apiCalls/project';

// other
import Joyride from 'react-joyride';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  container: {
    overflowX: 'scroll',
    padding: 0,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
  step1: {

  },
  nostep: {},
  addProjectButton: {
    marginTop: 10,
    marginLeft: 10,
    position: 'absolute',
    bottom: 25,
    zIndex: 9999,
    right: 15,
  },
  projectCards: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

@inject('store')
@observer
class Index extends React.Component {

  state = {
    open: false,
    page: 0,
    limit: 10,
    totalDocs: 0,
    projects: [],
    waiting: true,
    snackbarMessage: '',
    run: false,
    joyState: {},
    createProjectFormOpen: false,
    steps: [
      {
        target: '.step1',
        content: (
          <div>
            <Typography variant="body1" gutterBottom>
              {'Welcome to Sugar Analytics!'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {'This is a project. Each project has its own data sources and reports.'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {'You can click on a tag to search for that tag.'}
            </Typography>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.step2',
        content: (
          <div>
            <Typography variant="body1" gutterBottom>
              {'This is a search bar. Type titles, tags, or pricing in here to search, sort and filter to find what you\'re looking for.'}
            </Typography>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.step3',
        content: (
          <div>
            <Typography variant="body1" gutterBottom>
              {'After you purchase a token for a project, you can find instructions and documentation for the project here.'}
            </Typography>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.step4',
        content: (
          <div>
            <Typography variant="body1" gutterBottom>
              {'If you ask any questions about a project, they will show up here. They are private by default, but you can make them public so everyone can benefit from the answer.'}
            </Typography>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.step5',
        content: (
          <div>
            <Typography variant="body1" gutterBottom>
              {'Interested in selling projects on the platform? Click here to get started.'}
            </Typography>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.step6',
        content: (
          <div>
            <Typography variant="body1" gutterBottom>
              {'Click on your avatar to make billing changes or change your profile information.'}
            </Typography>
          </div>
        ),
        placement: 'bottom',
      },
    ],
  };

  async componentDidMount() {
    document.title = `Dashboard`;
    const { init, props: { store: { auth: { checkTokenAndSetUser } } } } = this;
    this.auth = new Auth();

    if (!this.auth.isAuthenticated()) {
      Router.push({ pathname: '/' });
    }
    const { access_token, id_token } = this.auth.getSession();
    await checkTokenAndSetUser({ access_token, id_token });
    setTimeout(() => init(), 1000);
  }

  init = async () => {
    this.onSearch(null, null);
    // console.log('this props ', this.props);

    // const user = getState('user');
    // const { query } = this.props.router;
    // const search = query && query.search ? query.search : '';
    // let { page, limit } = this.state;
    // if (query && query.page) page = Number(query.page);
    // if (query && query.limit) limit = Number(query.limit);
    //
    // const res = await fetchProjects({ limit, page, search });
    // if (res.error) {
    //   this.setState({ snackbarMessage: res.error });
    //   return setTimeout(() => this.setState({ snackbarMessage: '' }), 3000);
    // }
    // Router.push({
    //   pathname: '/dashboard',
    //   query: { search, limit, page },
    //   shallow: true,
    // });
    // this.setState({
    //   run: user && user.walkthroughs && user.walkthroughs.dashboard ? false : true,
    //   projects: res.docs,
    //   totalDocs: res.totalDocs,
    //   user: getState('user'),
    //   page,
    //   limit,
    //   waiting: false
    // });
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.auth.login();
  };

  handleChangePage = async (a, page) => {
    // this.setState({ page });
    // const { query } = this.props.router;
    // const search = query && query.search ? query.search : '';
    // const { limit } = this.state;
    // const res = await fetchProjects({ limit, page, search });
    // if (res.error) {
    //   this.setState({ snackbarMessage: res.error });
    //   return setTimeout(() => this.setState({ snackbarMessage: '' }), 3000);
    // }
    // Router.push({
    //   pathname: '/dashboard',
    //   query: { search, limit, page },
    //   shallow: true,
    // });
    // this.setState({ projects: res.docs, totalDocs: res.totalDocs });
  }

  handleChangeRowsPerPage = async (rows) => {
    // const limit = Number(rows.target.value);
    // const { query } = this.props.router;
    // const search = query && query.search ? query.search : '';
    // this.setState({ limit, page: 0 });
    // const res = await fetchProjects({ limit, page: 0, search });
    // if (res.error) {
    //   this.setState({ snackbarMessage: res.error });
    //   return setTimeout(() => this.setState({ snackbarMessage: '' }), 3000);
    // }
    // Router.push({
    //   pathname: '/dashboard',
    //   query: { search, limit, page: 0 },
    //   shallow: true,
    // })
    // this.setState({ projects: res.docs, totalDocs: res.totalDocs });
  }

  onSearch = async (e, text = "") => {
    if (e && e.preventDefault) e.preventDefault();
    const { project: { update } } = this.props.store;
    const { query } = this.props.router;
    const projectRes = await fetchProjects({ ...query, search: text });
    if (projectRes && projectRes.projects) {
      update('projects', projectRes.projects);
      if (projectRes.projects.length === 0) {
        this.createProjectOpen();
      }
    }
    this.setState({ waiting: false });

    // const limit = 10;
    // const page = 0;
    // const search = text;
    // let waiting = true;
    // this.setState({ limit, page, search, waiting });
    // const res = await fetchProjects({ limit, page, search });
    // if (res.error) {
    //   this.setState({ snackbarMessage: res.error });
    //   return setTimeout(() => this.setState({ snackbarMessage: '' }), 3000);
    // }
    // this.setState({ projects: res.docs, totalDocs: res.totalDocs, waiting: false });
    //
    // Router.push({
    //   pathname: '/dashboard',
    //   query: { search: text, limit, page },
    //   shallow: true,
    // });
  }

  chipClick = (text) => {
    this.onSearch(null, text);
  }

  priceClick = (price) => {
    this.onSearch(null, `Price <= ${price}`);
  }

  handleJoyrideCallback = async (joyState) => {
    const prevJoyState = this.state.joyState;
    // if (prevJoyState.index === 3 && joyState.index === 4) {
    //   this.sideNavBinding({ target: { checked: true } });
    // }
    this.setState({ joyState });
    if (joyState.status === 'finished') {
      this.sideNavBinding({ target: { checked: false } });
      const savedWalkthrough = await saveProfile({ dashboardWalkthrough: true });
      if (savedWalkthrough.success && savedWalkthrough.user) setState('user', savedWalkthrough.user);
    }
  }

  bindSideInputChange = (change) => {
    this.sideNavBinding = change;
  };

  toggleDialog = (which) => () => {
    // const { store: { collection: { reset }, collections: { update } } } = this.props;
    // if (which === 'createCollectionDialogOpen' && this.state[which]) {
    //   console.log('should reset');
    //   // update('selectedIndex', -1);
    //   reset();
    // }
    // console.log('resetting');
    this.setState({ [which]: !this.state[which] })
  };

  createProjectOpen = () => {
    const { project: { update} } = this.props.store;
    update('createProjectModalOpen', true);
  }

  render() {
    const { createProjectOpen, projectCards, onSearch, chipClick, priceClick, handleJoyrideCallback, bindSideInputChange, toggleDialog } = this;
    const { classes, store: { auth: { user }, project: { projects } } } = this.props;
    const { open, limit, page, waiting, totalDocs, snackbarMessage, run, steps, createProjectFormOpen } = this.state;
    const noProjectText = "No sources found. To begin, create a source"
    const waitingView = (
      <div style={Object.assign({}, flex_row, { marginTop: 100 })}>
        <CircularProgress className={classes.progress} color="secondary" size={50} />
      </div>
    );

    return (
      <div className={classes.root}>
        <Side
          showSearch={true}
          onSearch={onSearch}
          title={'Dashboard'}
          bindInputChange={bindSideInputChange}
        >
          <div className={classes.container}>
            {waiting && (waitingView)}
            <div className={classes.projectCards}>
              {!waiting && projects.length > 0 && projects.map((project, index) => (
                <ProjectCard
                  project={project}
                  key={`project-card-${project.id}`}
                  index={index}
                />
              ))}
            </div>
          </div>
          <div
            className={classes.addProjectButton}
          >
            <Tooltip
              title="Create Project"
              placement="left"
            >
              <Fab
                onClick={createProjectOpen}
                size="large"
                color="primary"
                aria-label="Add"
                className={classes.margin}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </div>
        </Side>
        <Snackbar
          open={snackbarMessage.length > 0 ? true : false}
          onClose={this.handleClose}
          TransitionComponent={TransitionUp}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackbarMessage}</span>}
        />
        <Joyride
          continuous
          scrollToFirstStep
          showProgress
          showSkipButton
          run={run}
          steps={steps}
          callback={handleJoyrideCallback}
          styles={{ options: { primaryColor: primary }}}
        />
        {user && user.walkthroughs && !user.walkthroughs.intro && (<Intro />)}
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  // client: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Index));
