import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Router, { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { white, black } from '../../utils/colors';

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
  label: {
    marginLeft: 10
  }
});

@inject('store')
@observer
class Search extends React.Component {
  static defaultProps = {
    onSearch: () => { },
    query: {},
    route: "",
  }

  constructor(props) {
    super(props);
    this.state = {
      inProgress: false,
    };
  }

  componentWillUnmount() {
    // if (this.interval) clearInterval(this.interval);
  }

  async componentDidMount() {
    this.init();
  }

  handleSearchTextChange = (e) => {
    // const { type } = this.props;
    // const { store: { [type]: { update, search, limit, page } } } = this.props;
    // const { query } = this.props.router;
    // const { inProgress } = this.state;
    // if (inProgress) return;
  }

  init = async () => {
    const { type } = this.props;

    const {
      // handleSearchTextChange,
      props: {
        store: { [type]: { update, search } },
        router: {
          query
        }
      }
    } = this;

    if (query && query.search && query.search !== search) {
      update('search', query.search);
    }
    // this.interval = setInterval(handleSearchTextChange, 1000);
  }

  getRoute = () => {
    const { pathname } = this.props.router;
    return pathname;
  }

  prepareSearch = (e) => {
    const { type } = this.props;
    e.preventDefault();
    e.stopPropagation();
    const {
      props: {
        onSearch,
        store: { [type]: { update, search } },
      }
    } = this;
    return onSearch(e, search);
  }

  handleInputChange = (e) => {
    this.setState({ inProgress: true });
    const {
      props: {
        onSearch,
        type,
        route,
        store: { [type]: { update, search } },
        router: {
          query
        }
      }
    } = this;

    let { limit, page } = query;
    const { projectID } = query;
    let querySearch = query.search;

    if (!limit) limit = 10;
    if (!page) page = 0;
    if (!querySearch) querySearch = "";
    querySearch = e.target.value;
    if (querySearch !== search) {
      update('search', querySearch);
    }

    let updatedQueryPath = { search: querySearch, limit, page };

    if (type === 'Project') {
      updatedQueryPath = { search: querySearch, limit, page, projectID };
    }
    Router.push({
      pathname: `/${route}`,
      query: updatedQueryPath,
      shallow: true,
    });

    if (!e.target.value) {
      setTimeout(() => {
        onSearch(e, '');
      }, 300);
    }

    setTimeout(() => {
      this.setState({ inProgress: false });
    }, 3000);
  }

  render() {
    const { type } = this.props;
    const { prepareSearch, handleInputChange } = this;
    const { classes, store: { [type]: { search } } } = this.props;
    return (
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
              value={search}
              type="search"
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
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  query: PropTypes.object,
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  route: PropTypes.string,
};

export default withRouter(withStyles(styles, { withTheme: true })(Search));
