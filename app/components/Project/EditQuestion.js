import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Router, { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '../Shared/Snackbar';

import { fetchReports, getReport, updateReport, deleteReport } from '../../src/apiCalls/report';

const styles = {
  avatar: {

  },
  padding: {
    padding: 25,
    // width: 200,
  },
  dialog: {
    padding: 50,
  },
  queryBuilder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // width: 300,
    justifyContent: 'center',
    margin: '0 auto',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  picker: {
    padding: 10,
  },
  query: {
    background: '#fff',
  },
  selectedTags: {
    marginTop: 10,
    marginBottom: 10,
  },
  divider: {
    // width: 350,
    marginBottom: 10,
    marginTop: 10,
  },
  groupByWrap: {
    marginTop: 10,
  },
  dialogActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  }
};

@inject('store')
@observer
class SimpleDialog extends React.Component {
  state = {
    snackbarMessage: "",
    disabled: false
  };

  componentDidMount() {
    const { question: { update } } = this.props.store;
    update('shouldDeleteQuestion', false);
  }

  snacky = (snackbarMessage) => {
    this.setState({ snackbarMessage });
    setTimeout(() => {
      this.setState({ snackbarMessage: "" });
    }, 3000);
  }

  onSubmit = async (e) => {
    const {
      report: { reportsResponse },
      question: { update, name, newTag, selectedTags, startTime, endTime, groupBy, minCount, id, type }
    } = this.props.store;
    const { query } = this.props.router;
    const { projectID } = query;
    if (e && e.preventDefault) e.preventDefault();
    if (newTag) {
      const slicedTags = selectedTags.slice();
      slicedTags.push(newTag);
      update('newTag', '');
      return update('selectedTags', slicedTags);
    }
    // updateReport('currentReport', "");

    const startTimeAsDateString = new Date(startTime.toDate()).toString();
    const endTimeAsDateString = new Date(endTime.toDate()).toString();

    Router.push({
      pathname: '/project',
      query: { ...query, search: "", startTime: startTimeAsDateString, endTime: endTimeAsDateString, selectedTags, groupBy, minCount }
    });

    const res = await updateReport({ reportID: id, type, projectID, startTime, endTime, selectedTags, groupBy, minCount, name });
    if (res && res.success) {
      this.snacky('saved!');
      update('currentQuery', { counts: res.counts, tags: res.tags });
      const reportsRes = await fetchReports({ ...query });
      if (reportsRes.reports) reportsResponse(reportsRes.reports);
      setTimeout(() => {
        update('editQuestionDialog', false);
      }, 2000);
    } else {
      this.snacky('There was an error with your query.');
    }
  }

  format = (tagCounts, sort = true) => {
    if (!tagCounts) return [];
    let data = [];
    Object.keys(tagCounts).forEach((tag) => {
      data.push({ name: tag, value: tagCounts[tag] });
    });
    if (sort) data = data.sort((a, b) => b.value - a.value);
    return data;
  }

  handleTagClick = (tag) => () => {
    const { question: { selectedTags, update } } = this.props.store;
    const sliced = selectedTags.slice();
    sliced.push(tag.name);
    update('selectedTags', sliced);
  }

  onDelete = (tag) => () => {
    const { question: { selectedTags, update } } = this.props.store;
    const sliced = selectedTags.slice();
    sliced.splice(sliced.indexOf(tag.name), 1);
    update('selectedTags', sliced);
  }

  setTimes = (num) => () => {
    const { question: { update } } = this.props.store;
    update('startTime', moment().subtract(num, 'd'));
    update('endTime', moment());
  }

  close = () => {
    const { question: { update }} = this.props.store;
    update('editQuestionDialog', false);
  }

  deleteQuestion = async () => {
    const { router: { query } } = this.props;
    const {
      report: { reportsResponse },
      question: { shouldDeleteQuestion, update, id }
    } = this.props.store;

    if (!shouldDeleteQuestion) return update('shouldDeleteQuestion', true);
    const res = await deleteReport({ id });
    if (res && res.success) {
      this.snacky('Question Deleted');
      const reportsRes = await fetchReports({ ...query });
      if (reportsRes.reports) reportsResponse(reportsRes.reports);
      setTimeout(() => {
        update('editQuestionDialog', false);
      }, 3000);
    } else {
      this.snacky('An error occurred.');
    }
  }

  render() {
    const { close, deleteQuestion, onSubmit, format, handleTagClick, onDelete } = this;
    const { snackbarMessage, disabled } = this.state;
    const { classes } = this.props;
    const {
      dashboard: { counts: { tagCounts } },
      question: { editQuestionDialog, shouldDeleteQuestion, type, groupBy, newTag, minCount, selectedTags, update, name }
    } = this.props.store;
    return (
      <Dialog
        open={editQuestionDialog}
        onClose={close}
        aria-labelledby="question editor dialog"
      >
        <div className={classes.query}>
          <form
            onSubmit={onSubmit}
            className={classes.queryBuilder}
            disabled={disabled}
          >
        <DialogTitle id="draggable-dialog-title">Edit Question</DialogTitle>
         <DialogContent>

            <div>
              <TextField
                id="outlined-with-placeholder"
                label="Query Name"
                placeholder="Query Name"
                value={name}
                className={classes.textField}
                onChange={(e) => update('name', e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </div>

            <div>
              <Tooltip title={"Auto run this report for the time periods. i.e. trailing 7 days, previous 24 hours, etc."}>
                <FormControl component="fieldset" className={classes.groupByWrap}>
                 <FormLabel component="legend">Report time</FormLabel>
                 <RadioGroup
                   aria-label="Report time"
                   name="Report time"
                   className={classes.group}
                   value={type}
                   onChange={(e) => update('type', e.target.value)}
                 >
                   <FormControlLabel value="7-days" control={<Radio />} label="7 days" />
                   <FormControlLabel value="30-days" control={<Radio />} label="30-days" />
                   <FormControlLabel value="24-hours" control={<Radio />} label="24-hours" />
                 </RadioGroup>
                </FormControl>
              </Tooltip>
            </div>

          <Divider className={classes.divider} />
          <div style={{ marginTop: 25 }}>
            <Tooltip title={"You can use this to reduce the total number of tags by filtering out infrequently seen items."}>
              <TextField
                id="outlined-with-placeholder"
                label="Mininum Count"
                placeholder="Mininum Count"
                value={minCount}
                className={classes.textField}
                onChange={(e) => update('minCount', e.target.value)}
                margin="normal"
                type="number"
              />
            </Tooltip>
          </div>
          <Divider className={classes.divider} />
          <div>
            <Tooltip title={"Quickly group by day, week and hour."}>
              <FormControl component="fieldset" className={classes.groupByWrap}>
               <FormLabel component="legend">Group By</FormLabel>
               <RadioGroup
                 aria-label="Group By"
                 name="group by"
                 className={classes.group}
                 value={groupBy}
                 onChange={(e) => update('groupBy', e.target.value)}
               >
                 <FormControlLabel value="week" control={<Radio />} label="Week" />
                 <FormControlLabel value="day" control={<Radio />} label="Day" />
                 <FormControlLabel value="hour" control={<Radio />} label="Hour" />
               </RadioGroup>
              </FormControl>
            </Tooltip>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.selectedTags}>
            <DialogContentText>
              You can explicitly search by tags
            </DialogContentText>
            <Typography variant="overline">
              {selectedTags.length} Selected Tags
            </Typography>
            {selectedTags.map((tag) => {
              const isSelected = selectedTags.indexOf(tag) === -1;
              if (isSelected) {
                return (null);
              }
              return (
                <Chip
                  key={`${tag}-unselected`}
                  label={tag}
                  onClick={handleTagClick({ name: tag })}
                  className={classes.chip}
                  color={'primary'}
                  onDelete={onDelete({ name: tag })}
                  variant={"outlined"}
                />
              );
            })}
          </div>
          <Divider className={classes.divider} />
          <div>
            <DialogContentText>
              Heare are your top 5 tags.
            </DialogContentText>
            {format(tagCounts, true).slice(0, 5).map((tag) => {
              const isSelected = selectedTags.indexOf(tag.name) === -1;
              if (!isSelected) {
                return (null);
              }
              return (
                <Chip
                  label={tag.name}
                  key={`${tag.name}-selected`}
                  onClick={handleTagClick(tag)}
                  className={classes.chip}
                  variant={"outlined"}
                />
              );
            })}
          </div>
          <div>
            <DialogContentText>
              Or add a tag yourself.
            </DialogContentText>
            <TextField
              id="outlined-with-placeholder"
              label="Add Tag"
              placeholder="Add Tag"
              value={newTag}
              className={classes.textField}
              onChange={(e) => update('newTag', e.target.value)}
              margin="normal"
            />
          </div>
         </DialogContent>
          <DialogActions style={{ width: '100%'}}>

          <div
            className={classes.dialogActions}
          >
            <Button onClick={close} color="secondary">
              close
            </Button>

            <Tooltip title={'Delete'}>
              <IconButton
                aria-label="Delete"
                onClick={deleteQuestion}
              >
                <DeleteIcon color={shouldDeleteQuestion ? 'error' : 'inherit'} style={{ width: 25, height: 25 }} />
              </IconButton>
            </Tooltip>

            <Button
              disabled={disabled}
              variant="contained"
              type="submit"
              color="primary"
            >
              Save
            </Button>
          </div>
          </DialogActions>

          </form>
        </div>
        <Snackbar snackbarMessage={snackbarMessage} />
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  store: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SimpleDialog));
