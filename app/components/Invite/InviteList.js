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
    // minWidth: 700,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

@inject('store')
@observer
class SimpleTable extends Component {
  render() {
    const { classes, resendInvite } = this.props;
    const { invite: { invited, counts } } = this.props.store;
    if (!invited || !invited.length) return null;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invited.map(invite => (
              <TableRow key={invite.email}>
                <TableCell component="th" scope="row">
                  {invite.email}
                </TableCell>
                <TableCell align="right">{`${invite.status[0].toUpperCase()}${invite.status.slice(1, invite.status.length)}`}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={resendInvite(invite)}
                    disabled={false || invite.status === 'joined'}
                  >
                    {invite.status === 'joined' ? '🤗' : 'resend'}
                  </Button>
                </TableCell>
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
