import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import colors from '../../utils/colors';

import moment from 'moment';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: 25,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  error: {
    color: theme.palette.error.main,
  }
});

class Subscription extends PureComponent {
  static defaultProps = {
    subscription: {},
    classes: {},
    cancel: () => {}
  }
  static propTypes = {
    subscription: PropTypes.object,
    classes: PropTypes.object,
    cancel: PropTypes.func,
  }
  state = {
    cancelForReal: false,
    hover: false,
  }
  static displayName = 'Subscription';

  handleCancel = () => {
    const { cancelForReal } = this.state;
    const { subscription, cancel} = this.props;
    if (cancelForReal) {
      return cancel(subscription);
    }
    this.setState({ cancelForReal: true });
  }
  toggleHover = (hover) => () => {
    this.setState({ hover });
  }
  render() {
    const { handleCancel, toggleHover } = this;
    const { subscription, classes } = this.props;
    const { cancelForReal, hover } = this.state;
    return (
      <Card
        onMouseEnter={toggleHover(true)}
        onMouseLeave={toggleHover(false)}
        className={classes.card}
        style={{ backgroundColor: subscription.cancel_at_period_end ? colors.slightly_dark : colors.white }}
      >
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Subscription to
          </Typography>
          <Typography variant="h5" component="h2">
            {subscription.items.data[0].plan.nickname}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            ${subscription.items.data[0].plan.amount / 100} / {subscription.items.data[0].plan.interval}
          </Typography>
          <Typography component="p">
            Start Date: {moment(subscription.start * 1000).format('MM/DD/YY')}
            <br />
            {!subscription.cancel_at_period_end && (
              <div>
                Next Billing Date: {moment(subscription.start * 1000).add(1, subscription.items.data[0].plan.interval).format('MM/DD/YY')}
              </div>
            )}
            {subscription.cancel_at_period_end && (
              <div>
                Cancelled on {moment(subscription.canceled_at * 1000).format('MM/DD/YY')}
              </div>
            )}
          </Typography>
        </CardContent>
          <CardActions>
            { hover && !subscription.cancel_at_period_end && (
              <Button
                size="small"
                color="error"
                onClick={handleCancel}
                className={cancelForReal ? classes.error : classes.none}
              >
                {cancelForReal ? 'Cancel For Real' : 'Cancel'}
              </Button>
            )}
            {!hover && !subscription.cancel_at_period_end && (<div style={{ height: 31 }} />)}
          </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Subscription);
