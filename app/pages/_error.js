import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '../components/Base/Paper';
import colors from '../utils/colors';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
    backgroundImage: 'url("/static/img/cool!.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh',
  },
  center: {
    position: 'absolute',
    width: 500,
    height: 500,
    top: 'calc(50% - 200px)',
    left: 'calc(50% - 250px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '60%',
    marginBottom: 15,
  }
});

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.center} elevation={24}>
          <img src="/static/img/error.png" className={classes.logo} />
          <Typography gutterBottom>
          </Typography>
          <Typography variant="h1" style={{ color: colors.primary }}>
            {this.props.statusCode
              ? `${this.props.statusCode} 🥺`
              : 'An error occurred on client'}
          </Typography>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(Error);
