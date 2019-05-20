import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';
import Router, { withRouter } from 'next/router';

// mui
import Button from '@material-ui/core/Button';
import Snacky from '../Shared/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { exportCollection } from '../../src/apiCalls/collection';

const styles = theme => {
  return ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%'
    },
    root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing.unit * 3,

    },
    group: {
      margin: `${theme.spacing.unit}px 0`,
      display: 'flex',
      flexDirection: 'row',
    },
  });
};

@inject('store')
@observer
class ExportCollection extends React.Component {
  state = {
    snackbarMessage: "",
  };

  snacky = (snackbarMessage = "", timeout = 3000) => {
    this.setState({ snackbarMessage });
    setTimeout(() => this.setState({ snackbarMessage: "" }), timeout);
  }

  submit = async (e) => {
    e.preventDefault();
    const { query } = this.props.router;
    const { collection: { id, exportType, exportValue, exportAnnotation, percentValidation, yoloType } } = this.props.store;
    // console.log('submitted! => export ', id, ' as type ', exportType, ' with ', exportValue);
    const res = await exportCollection({ id, exportType, exportValue, exportAnnotation, percentValidation, yoloType });
    if (res.success) {
      this.snacky('Export initiated');
      this.props.handleClose();
      Router.push({ pathname: '/exports', query: { ...query }});
    }
  }

  handleChange = type => event => {
    const { collection: { update } } = this.props.store;
    update(type, event.target.value);
  };

  render() {
    const {
      submit,
      handleChange,
      state: {
        snackbarMessage
      },
      props: {
        classes,
        handleClose,
        open,
        store: {
          collection: {
            name,
            exportType,
            exportValue,
            exportAnnotation,
            percentValidation,
            yoloType,
          }
        },
      }
    } = this;
    if (!name) return null;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form
          className={classes.container}
          autoComplete="off"
          onSubmit={this.submit}
        >
        <DialogTitle id="form-dialog-title">Export {name}</DialogTitle>
        <DialogContent>
          <div>
            <FormControl component="fieldset" className={classes.formControl}>
             <FormLabel component="legend">Format</FormLabel>
             <RadioGroup
               aria-label="Export Type"
               name="exportType"
               className={classes.group}
               value={exportType}
               onChange={this.handleChange('exportType')}
             >
               <FormControlLabel value="yolo" control={<Radio />} label="Yolo" />
               <FormControlLabel value="tensorflow" control={<Radio />} label="Tensorflow" />
               <FormControlLabel value="other" control={<Radio />} label="Other" />
             </RadioGroup>
            </FormControl>
          </div>
          {exportType === "yolo" && (
            <div>
              <FormControl component="fieldset" className={classes.formControl}>
               <FormLabel component="legend">Format</FormLabel>
               <RadioGroup
                 aria-label="Yolo Type"
                 name="yoloType"
                 className={classes.group}
                 value={yoloType}
                 onChange={this.handleChange('yoloType')}
               >
                 <FormControlLabel value="fast" control={<Radio />} label="Fast" />
                 <FormControlLabel value="accurate" control={<Radio />} label="Accurate" />
               </RadioGroup>
              </FormControl>
            </div>
          )}
          <div>
            <FormControl component="fieldset" className={classes.formControl}>
             <FormLabel component="legend">Include</FormLabel>
             <RadioGroup
               aria-label="Include"
               name="include"
               className={classes.group}
               value={exportValue}
               onChange={this.handleChange('exportValue')}
             >
               <FormControlLabel value="annotated" control={<Radio />} label="Annotated images only" />
               <FormControlLabel value="all" control={<Radio />} label="All images" />
             </RadioGroup>
            </FormControl>
          </div>
          <div>
            <FormControl component="fieldset" className={classes.formControl}>
             <FormLabel component="legend">Annotation</FormLabel>
             <RadioGroup
               aria-label="Annotation"
               name="exportAnnotation"
               className={classes.group}
               value={exportAnnotation}
               onChange={this.handleChange('exportAnnotation')}
             >
               <FormControlLabel value="box" control={<Radio />} label="Boxes as annotation" />
               <FormControlLabel value="tag" control={<Radio />} label="Tags as annotation" />
             </RadioGroup>
            </FormControl>
          </div>
          <div className={classes.textField}>
            <TextField
              id="outlined-with-placeholder"
              label="Percent Validation"
              placeholder="Percent Validation"
              value={percentValidation}
              className={classes.textField}
              onChange={handleChange('percentValidation')}
              margin="normal"
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button
            onClick={submit}
            color="primary"
            type="submit"
            variant="contained"
          >
            Export
          </Button>

        </DialogActions>
        </form>
        <Snacky
          snackbarMessage={snackbarMessage}
        />
      </Dialog>
    );
  }
}

ExportCollection.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(ExportCollection));
