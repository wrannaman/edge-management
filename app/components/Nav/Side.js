import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react'

// next
import Link from 'next/link';
import Router, { withRouter } from 'next/router';

// mui
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListIcon from '@material-ui/icons/List';
import ChartIcon from '@material-ui/icons/BarChart';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MemoryIcon from '@material-ui/icons/Memory';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';

import QuestionIcon from '@material-ui/icons/QuestionAnswer';
import BuildIcon from '@material-ui/icons/Build';

import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';

// apis
import { fetchTeams } from '../../src/apiCalls/team';
import { fetchDevices } from '../../src/apiCalls/device';


// ours
import Auth from '../../src/Auth';
import { white, black, primary, } from '../../utils/colors';

import CreateProjectForm from '../Project/CreateProjectForm';


const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: 'hidden',
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 0,
    // overflow: 'hidden',
    overflowX: 'scroll',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  grow: {
    flexGrow: 1,
  },
  logoWrap: {
    position: 'absolute',
    top: 6,
    left: 58,
    zIndex: 2,
    cursor: 'pointer',
  },
  logo: {
    width: 100,
  },
  jazzWrap: {
    position: 'absolute',
    zIndex: -1,
    width: drawerWidth,
    bottom: 0,
  },
  jazz: {
    width: drawerWidth * 1.5
  },
  logoIcon: {
    width: 25,
  },
  label: {
    marginLeft: 10
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  active: {
    color: primary,
  }
});

@inject('store')
@observer
class MiniDrawer extends React.Component {
  static defaultProps = {
    showSearch: false,
    onSearch: () => { },
    children: null,
    query: {},
    title: '...',
    bindInputChange: () => {},
    route: "",
  }
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      anchorEl: null,
      auth: false,
      user: null,
      projectsExpanded: {},
    };
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  async componentDidMount() {
    this.auth = new Auth();
    const { props: { router: { query }, store: { auth, project: { update } } } } = this;
    const { checkTokenAndSetUser } = auth;
    const { access_token, id_token } = this.auth.getSession();

    if (query && query.search) {
      this.setState({ search: query.search });
    }

    if (this.auth.isAuthenticated()) {
      this.setState({ auth: true });
    }

    await checkTokenAndSetUser({ access_token, id_token });
    const deviceRes = await fetchDevices();

    // const teamRes = await fetchTeams()
    // console.log('TEAMS', teamRes)
    if (deviceRes.devicees) update('projects', deviceRes.devicees);

    // const user = getState('user');
    // this.setState({ user, open: user.walkthroughs.explore ? false : true });
    //
    // // @HAX
    // this.interval = setInterval(handleSearchTextChange, 1000);
    if (this.props.title) document.title = this.props.title;
  }

  // handleSearchTextChange = () => {
  //   const { search, inProgress } = this.state;
  //   if (query.search && query.search !== search && !inProgress) {
  //     this.setState({ search: query.search });
  //   }
  // }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  logout = () => {
    this.auth.logout(Router);
  }

  prepareSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { onSearch } = this.props;
    onSearch(e, this.state.search);
  }

  handleInputChange = (e) => {
    this.setState({ inProgress: true });
    const { onSearch, route } = this.props;
    const { query } = this.props.router;
    let { search, limit, page } = query;
    if (!limit) limit = 10;
    if (!page) page = 0;
    if (!search) search = "";
    search = e.target.value;

    if (!e.target.value) {
      onSearch(e, '');
    }
    this.setState({ [e.target.name]: e.target.value });

    delete query.search;
    Router.push({
      pathname: `/${route ? route : 'dashboard'}`,
      query: { ...query, search, limit, page },
      // shallow: true,
    });
    setTimeout(() => {
      this.setState({ inProgress: false });
    }, 3000);
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = (route) => {
    Router.push({ pathname: route });
    this.setState({ anchorEl: null });
  };

  getRoute = () => {
    const { pathname } = this.props.router;
    return pathname;
  }

  activated = r => {
    const route = this.getRoute();
    return route === r ? true : false;
  }

  activatedProject = (id, route) => {
    const { pathname, query } = this.props.router;
    if (pathname.indexOf(route) !== -1) {
      if (query.id === id || query.projectID === id) {
        return true;
      }
    }
    return false;
  }

  goToProject = (project, route) => () => {
    const { query } = this.props.router;

    return Router.push({
      pathname: `/${route}`,
      query: { projectID: project._id, search: query.search },
      // shallow: false,
    });
  }

  toggleProjectsExpanded = (id) => () => {
    const { projectsExpanded } = this.state;
    if (projectsExpanded[id]) projectsExpanded[id] = false;
    else projectsExpanded[id] = true;
    this.setState({ projectsExpanded });
  };

  createProject = () => {
    const { project: { update, createProjectModalOpen } } = this.props.store;
    update('createProjectModalOpen', true);
  }

  goToDashboard = () => {
    Router.push({ pathname: '/dashboard' });
  }

  createDevice = () => {
    console.log('create device');
  }

  render() {
    const { goToDashboard, createProject, prepareSearch, handleInputChange, activated, goToProject, activatedProject } = this;
    const { classes, theme, title, showSearch, bindInputChange } = this.props;
    const { anchorEl, auth, search, user, hasQuestions, projectsExpanded } = this.state;
    const { project: { projects } } = this.props.store;
    const open = Boolean(anchorEl);
    const userNav = (
      <div>
          <List component="div" disablePadding>
            <ListItem
              className={classes.nested}
              button
              onClick={goToDashboard}
            >
              <ListItemText
                primary="Dashboard"
                classes={{
                  primary: activated('/dashboard') ? classes.active : classes.inactive
                }}
              />
            </ListItem>
            <Divider />
            <ListItem
              className={classes.nested}
            >
              <ListItemText
                primary="Apps"
              />
              <ListItemSecondaryAction>
                <Button
                  onClick={createProject}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  New
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem
              className={classes.nested}
            >
              <ListItemText
                primary="Devices"
              />
              <ListItemSecondaryAction>
                <Button
                  onClick={this.createDevice}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  New
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem
              className={classes.nested}
            >
              <ListItemText
                primary="Devices"
              />
              <ListItemSecondaryAction>
                <Button
                  onClick={this.createDevice}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  New
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </List>
      </div>
    );

    const display = userNav;

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.state.open && classes.hide)}
              >
                <MenuIcon style={{ color: white }} />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap style={{ color: white }}>
                {title || 'Explore'}
              </Typography>
            </div>
            {auth && showSearch && (
              <div className="step2" >
                <div className={classes.grow} />
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon style={{ color: white }} />
                  </div>
                  <form
                    className={classes.container}
                    autoComplete="off"
                    onSubmit={prepareSearch}
                  >
                    <InputBase
                      placeholder="Search…"
                      name={"search"}
                      value={search || ''}
                      style={{ color: white }}
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      onChange={handleInputChange}
                    />
                  </form>
                </div>
              </div>
            )}
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                  className="step6"
                >
                  <AccountCircle style={{ color: white }} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose.bind(this, '/team')}>Team</MenuItem>
                  <MenuItem onClick={this.handleClose.bind(this, '/billing')}>Billing</MenuItem>
                  <MenuItem onClick={this.handleClose.bind(this, '/profile')}>Profile</MenuItem>
                  <MenuItem onClick={this.logout}>Log Out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          anchor="left"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose} >
              {theme.direction === 'rtl' ? <ChevronRightIcon style={{ color: black }}/> : <ChevronLeftIcon style={{ color: black }} />}
            </IconButton>
          </div>
          <div
            onClick={goToDashboard}
            className={classes.logoWrap}
          >
            <div>
              <img src="/static/img/logo.png" className={classes.logo}/>
            </div>
          </div>
          <div className={classes.jazzWrap}>
            <img src="/static/img/mask-line-a-double.png" className={classes.jazz}/>
          </div>
          <Divider />
          <List>
            <div>
              {display}
            </div>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
          <CreateProjectForm />
        </main>
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  query: PropTypes.object,
  children: PropTypes.object,
  title: PropTypes.string,
  route: PropTypes.string,
  router: PropTypes.object.isRequired,
  bindInputChange: PropTypes.func,
  store: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(MiniDrawer));
