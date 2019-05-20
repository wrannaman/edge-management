import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '../Base/Paper';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
  },
  button: {
    margin: theme.spacing.unit,
  },
});

@inject('store')
@observer
class SimpleTable extends Component {
  render() {
    const { classes } = this.props;
    const { auth: { user: { teams } } } = this.props.store;

    let teamUsers = [];
    if (teams && teams.length && typeof teams[0].users !== 'undefined') teamUsers = teams[0].users;
    if (teamUsers.length === 0) return null;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamUsers.map(user => (
              <TableRow key={user.email}>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                {false && (
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={false || user.status === 'joined'}
                    >
                      {user.status === 'joined' ? '🤗' : 'resend'}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }

}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  invited: PropTypes.array.isRequired,
  resendInvite: PropTypes.func.isRequired,
};

export default withStyles(styles)(SimpleTable);
