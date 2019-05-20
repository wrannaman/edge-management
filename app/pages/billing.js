import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

// mui
import Button from '../components/Base/Button';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '../components/Shared/Snackbar';
import Paper from '../components/Base/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { StripeProvider, Elements } from 'react-stripe-elements';
// next
import Router, { withRouter } from 'next/router';

// ours
import Side from '../components/Nav/Side';
import Auth from '../src/Auth';
import { fetchStripeInfo, makeCardDefault, deleteCard, cancelSubscription, getBillingUsage } from '../src/apiCalls/billing';
import AddCardForm from '../components/Checkout/AddCardForm';
import { stripe } from '../config';
import Subscriptions from '../components/Billing/Subscriptions';

const prices = [
  { low: 0, high: 100, price: 0 },
  { low: 101, high: 5000, price: 0.05 },
  { low: 5001, high: 20000, price: 0.03 },
  { low: 20001, high: 2000000, price: 0.02 }
];

const findPriceByUsage = (assetCount) => {
  let tier = prices[0];
  prices.forEach((price) => {
    if (assetCount >= price.low && assetCount <= price.high) {
      tier = price;
    }
  });
  return assetCount * tier.price;
};

const styles = theme => ({
  root: {
    height: '100vh',
  },
  container: {
    flex: 1,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    maxWidth: '60%',
    marginTop: 25,
  },
  textField: {
    minWidth: 300,
  },
  error: {
    color: theme.palette.error.main,
  }
});

@inject('store')
@observer
class Profile extends React.Component {

  state = {
    waiting: true,
    snackbarMessage: '',
    submitDisabled: false,
    disabled: false,
    name: '',
    showCardModal: false,
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const {
      props: {
        store: {
          auth: { checkTokenAndSetUser, update }
        }
      }
    } = this;
    this.auth = new Auth();
    if (!this.auth.isAuthenticated()) {
      Router.push({ pathname: '/' });
    }
    const { access_token, id_token } = this.auth.getSession();
    await checkTokenAndSetUser({ access_token, id_token });
    const res = await fetchStripeInfo();
    const usage = await getBillingUsage();
    if (usage.assetCount) update('assetCount', usage.assetCount);
    if (res.customer) update('customer', res.customer);
    this.setState({ waiting: false });
  }

  handleChange = _name => event => {
    const { name, submitDisabled } = this.state;
    let value = event.target.value;
    if (_name === 'price') {
      value = Number(event.target.value);
    }
    this.setState({ [_name]: value });
    if (name && name.length > 3) this.setState({ submitDisabled: false });
    else if (submitDisabled === false) this.setState({ submitDisabled: true });
  }


  makeCardDefault = (card) => async () => {
    const { auth: { update } } = this.props.store;
    this.setState({ disabled: true, submitDisabled: true });
    const res = await makeCardDefault(card);
    if (res && res.success && res.customer) {
      update('customer', res.customer);
    }
    this.setState({ disabled: false, submitDisabled: false });
  }


  addCardModal = () => {
    this.setState({ showCardModal: !this.state.showCardModal });
  }

  saveCard = () => {
    this.addCardModal();
  }

  updateCustomer = (customer) => {
    this.setState({ customer });
    this.addCardModal();
  }

  deleteCard = (card) => async () => {
    const { auth: { update } } = this.props.store;
    this.setState({ disabled: true, submitDisabled: true });
    const res = await deleteCard(card);
    if (res && res.success && res.customer) update('customer', res.customer);
    this.setState({ disabled: false, submitDisabled: false });
  }

  cancelSubscription = async (sub) => {
    await cancelSubscription({ subID: sub.id });
    const res = await fetchStripeInfo();
    if (res && res.success && res.customer) {
      this.setState({ customer: res.customer, waiting: false });
    }
  }

  render() {
    const { handleChange, deleteCard, makeCardDefault, addCardModal, saveCard, updateCustomer, cancelSubscription } = this;
    const { classes, store: { auth: { customer, assetCount } } } = this.props;
    const { waiting, snackbarMessage, disabled, submitDisabled, showCardModal } = this.state;

    const noStripeCustomer = (
      <div>
        <Typography variant="body1" gutterBottom>
          Please enter your card to set up billing. You will not be charged at this time.
        </Typography>
      </div>
    );

    return (
      <div className={classes.root}>
        <Side
          showSearch={false}
          title={'Billing'}
        >
          <div className={classes.container}>
            <div className={classes.paper}>
              <Typography variant="h5">
                Month to date assets: {assetCount}
              </Typography>
              <Typography variant="overline">
                Estimated Cost: ${findPriceByUsage(assetCount).toFixed(2)}
              </Typography>

            </div>
            <div className={classes.paper}>
              <Typography variant="h5">
                Billing
              </Typography>
              <Paper elevation={1} style={{ padding: 10 }}>
                <div style={{ marginTop: 10 }}>
                  {!waiting && !customer && (noStripeCustomer)}
                  {!waiting && customer && (
                    <div>
                      {customer && customer.sources && customer.sources.data && customer.sources.data.map((card) => {
                        const isDefault = customer.default_source === card.id;
                        return (
                          <div
                            key={card.id}
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <TextField
                              disabled
                              label={card.brand}
                              defaultValue={`Ending In ${card.last4}`}
                              className={classes.textField}
                              margin="normal"
                              variant="outlined"
                            />
                            <Button
                              disabled={isDefault || disabled}
                              color="secondary"
                              className={classes.button}
                              type="submit"
                              onClick={makeCardDefault(card)}
                              style={{ marginLeft: 10, minWidth: 145 }}
                            >
                              { isDefault ? 'Default' : 'Make Default'}
                            </Button>
                            {!isDefault && (
                              <Button
                                disabled={disabled}
                                color="secondary"
                                className={classes.error}
                                type="submit"
                                onClick={deleteCard(card)}
                                style={{ marginLeft: 10, minWidth: 90 }}
                              >
                                Delete
                              </Button>
                            )}
                            {isDefault && (<div style={{ width: 90, marginLeft: 10 }}></div>)}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!waiting && (
                    <div style={{ minWidth: 500 }}>
                      <StripeProvider apiKey={stripe}>
                        <Elements>
                          <AddCardForm
                            onClose={addCardModal}
                            updateCustomer={updateCustomer}
                          />
                        </Elements>
                      </StripeProvider>
                    </div>
                  )}
                </div>
              </Paper>
            </div>
          </div>
          <div>
            <Subscriptions
              customer={customer}
              cancelSubscription={cancelSubscription}
            />
          </div>
        </Side>
        <Snackbar snackbarMessage={snackbarMessage} />
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Profile));
