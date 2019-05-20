import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import StepConnector from '@material-ui/core/StepConnector';
import { saveProfile } from '../../src/apiCalls/user';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    position: 'relative',
  },
  connectorActive: {
    '& $connectorLine': {
      borderColor: theme.palette.secondary.main,
    },
  },
  connectorCompleted: {
    '& $connectorLine': {
      borderColor: theme.palette.primary.main,
    },
  },
  connectorDisabled: {
    '& $connectorLine': {
      borderColor: theme.palette.grey[100],
    },
  },
  connectorLine: {
    transition: theme.transitions.create('border-color'),
  },
  bg: {
    width: '100%',
  },
  stepContainer: {
    position: 'absolute',
    top: 50,
  }
});

function getSteps() {
  return ['Welcome', 'How It Works', 'Get Started', 'Free Projects!'];
}

const totalSteps = getSteps().length

class HorizontalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
    skipped: new Set(),
    open: true,
  };

  isStepOptional = step => {
    return step === 1;
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped,
    });
    if (activeStep + 1 === totalSteps) {
      this.setState({ open: false });
      saveProfile({ introWalkthrough: true });
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  };

  getStepContent = (step) => {
    const { classes } = this.props;
    switch (step) {
      case 0:
        return (
          <div className={classes.stepContainer}>
            <Typography variant="h4" gutterBottom>
              Welcome to SugarKubes!
            </Typography>
            <Typography variant="h5" gutterBottom>
              Each project is either a git repository, or a docker container.
            </Typography>
            <Typography variant="body1" gutterBottom>
              For containers, you can simply pull the container and run it!
            </Typography>
            <Typography variant="body1" gutterBottom>
              For the git repositories, expect excellent documentation on how
              to get started quickly.
            </Typography>
          </div>
        );
      case 1:
        return (
          <div className={classes.stepContainer}>
            <Typography variant="h4" gutterBottom>Business Models</Typography>
            <Typography variant="body1" gutterBottom>
              Each project can have one of several business models.
            </Typography>
            <Typography variant="body1" gutterBottom>
              The project can either require a one time fee, a subscription, or a token to run.
            </Typography>
          </div>
        );
      case 2:
        return (
          <div className={classes.stepContainer}>
            <Typography variant="h4" gutterBottom>Searching and Purchasing</Typography>
            <Typography variant="body1" gutterBottom>
              This area is for searching and purchasing projects. You can find your account info, billing, and other account settings.
            </Typography>
            <Typography variant="body1" gutterBottom>
              When you purchase a project, head on over to the <Link href="https://git.sugarkubes.io"><strong> Git Repository </strong></Link>.
            </Typography>
          </div>
        );
      case 3:
        return (
          <div className={classes.stepContainer}>
            <Typography variant="h4" gutterBottom>Free Projects!</Typography>
            <Typography variant="body1" gutterBottom>
              Want access to a project for free? For each 10 people who you help join, we'll give you access to one project for free.
            </Typography>
            <Link href="/invite">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleNext}
                className={classes.button}
              >
                Invite someone now!
              </Button>
            </Link>
          </div>
        );
      default:
        return (
          <div className={classes.stepContainer}>
            <Typography variant="h5">
              Thank you!
            </Typography>
          </div>
        );
    }
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  render() {
    const { getStepContent } = this;
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    const connector = (
      <StepConnector
        classes={{
          active: classes.connectorActive,
          completed: classes.connectorCompleted,
          disabled: classes.connectorDisabled,
          line: classes.connectorLine,
        }}
      />
    );

    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        maxWidth={'md'}

      >
        <DialogTitle id="responsive-dialog-title">{"Welcome to SugarKubes!"}</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} connector={connector}>
            {steps.map((label, index) => {
              const props = {};
              const labelProps = {};

              if (this.isStepSkipped(index)) {
                props.completed = false;
              }
              return (
                <Step key={label} {...props}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <DialogContentText className={classes.instructions}>
            {getStepContent(activeStep)}
            <img
              src="/static/img/pattern-salvia.png"
              className={classes.bg}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&quot;re finished
                </Typography>
                <Button onClick={this.handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  {false && this.isStepOptional(activeStep) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSkip}
                      className={classes.button}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withMobileDialog()(withStyles(styles)(HorizontalLinearStepper));
