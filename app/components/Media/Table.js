import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import EnhancedTableHead from './TableHeader';
import ClassDistributions from './ClassDistributions';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import ViewGridIcon from '@material-ui/icons/ViewModule';
import { inject, observer } from 'mobx-react';
const queryString = require('query-string');

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import Tooltip from '@material-ui/core/Tooltip';
import '../../static/css/fix.sass';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
    maxWidth: '90%',
    margin: '0 auto',
    marginTop: 25,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      } : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  action: {
    display: 'flex',
    justifyContent: 'space-evenly',
    minWidth: 100,
  },
  fab: {
    margin: 0,
    padding: 0,
  },
});


@inject('store')
@observer
class EnhancedTable extends React.Component {
  static defaultProps = {
    collections: [],
  }
  state = {
    order: 'desc',
    orderBy: 'name',
    selected: [],
    page: 0,
    rowsPerPage: 5,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  dontPropagateAction = (which) => (collection, index) => (e) => {
    const { props: { action }} = this;
    e.preventDefault();
    e.stopPropagation();
    action(which)(collection, index);
  }

  dontPropagateLink = link => event => {
    this.inProgress = true;
    event.stopPropagation();
    event.preventDefault();
    Router.replace(link);
    setTimeout(() => this.inProgress = false, 300);
  }

  rowClick = (event, collection) => {
    setTimeout(() => {
      if (this.inProgress) return;
      event.stopPropagation();
      event.preventDefault();
      const stringified = queryString.stringify({ id: collection.id, limit: 10, page: 0 });
      window.location = `/collection?${stringified}`;
    }, 150);
  }
  render() {
    const {
      dontPropagateAction,
      dontPropagateLink,
      rowClick,
      props: { classes, collections },
      state: { order, orderBy, selected, rowsPerPage, page }
    } = this;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, collections.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={collections.length}
            />
            <TableBody>
              {collections.map((collection, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={collection.id}
                    style={{ cursor: 'pointer' }}
                    onClick={event => rowClick(event, collection, index)}
                  >
                    {/* <TableCell align="left">{collection.id}</TableCell> */}
                    <TableCell align="left">{collection.name}</TableCell>
                    <TableCell align="left">{collection.tags.join(', ')}</TableCell>
                    <TableCell align="left">{collection.assetCount}</TableCell>
                    <TableCell align="left">{collection.annotatedCount}</TableCell>
                    <TableCell align="left">{collection.assetClassesCount}</TableCell>
                    <TableCell align="left">
                      <ClassDistributions
                        assetClasses={collection.assetClasses}
                        totalAssets={collection.annotatedCount}
                      />
                    </TableCell>
                    <TableCell align="left">{moment(collection.createdAt).format('MM/DD/YYYY h:mm a')}</TableCell>
                    <TableCell align="right">
                      <div className={classes.action}>
                        <Tooltip title="Edit">
                          <IconButton
                            color="secondary"
                            aria-label="Edit"
                            className={classes.fab}
                            onClick={dontPropagateAction('createCollectionDialogOpen')(collection, index)}
                          >
                            <EditIcon
                              style={{ fontSize: 25 }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Annotate">
                          <IconButton
                            color="primary"
                            aria-label="Edit"
                            className={classes.fab}
                            onClick={dontPropagateLink({ pathname: `/annotate`, query: { id: collection.id }}, index)}
                          >
                            <ArrowRightIcon style={{ fontSize: 35 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            aria-label="View"
                            className={classes.fab}
                            onClick={dontPropagateLink({ pathname: `/collection`, query: { id: collection.id, search: "", limit: 10, page: 0 }})}
                          >
                            <ViewGridIcon style={{ fontSize: 25 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Export">
                          <IconButton
                            color="primary"
                            aria-label="Export"
                            className={classes.fab}
                            onClick={dontPropagateAction('exportDialogOpen')(collection, index)}
                          >
                            <ImportExportIcon style={{ fontSize: 25 }} />
                          </IconButton>
                        </Tooltip>

                      </div>
                    </TableCell>
                  </TableRow>

                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  collections: PropTypes.array,
  action: PropTypes.func.isRequired
};

export default withStyles(styles)(EnhancedTable);
