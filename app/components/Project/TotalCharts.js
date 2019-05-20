import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { inject, observer } from 'mobx-react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import {
  PieChart, Pie, Legend, Tooltip,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Brush, ReferenceLine
} from 'recharts';

const styles = {
  paperTotals: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    margin: 10,
  },
  paperWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

@inject('store')
@observer
class TotalCharts extends React.Component {

  format = (tagCounts, sort = true) => {
    if (!tagCounts) return [];
    let data = [];
    Object.keys(tagCounts).forEach((tag) => {
      data.push({ name: tag, count: tagCounts[tag] });
    });
    if (sort) data = data.sort((a, b) => b.count - a.count);
    return data;
  }

  render() {
    const { format, props: { classes } } = this;
    const { dashboard: { counts } } = this.props.store;
    const { tagCounts, totalCounts } = counts;

    if (!tagCounts || !Object.keys(tagCounts).length) return null;

    return (
      <div>
        <div className={classes.paperWrapper}>
          {Object.keys(totalCounts).map((key) => (
            <Paper
              key={`${totalCounts[key]}-${key}`}
              className={classes.paperTotals}
            >
              <div>
                <Typography variant="h4">
                  {totalCounts[key]}
                </Typography>
              </div>
              <div>
                <Typography variant="overline">
                  {key}
                </Typography>
              </div>
            </Paper>
          ))}
          <Paper
            className={classes.paperTotals}
          >
            <Typography>
              Top 5
            </Typography>
            <div>
              {format(tagCounts, true).slice(0, 5).map(tag => (
                <Typography
                  key={tag.name}
                  variant="caption"
                >
                  {tag.name} ({tag.count})
                </Typography>
              ))}
            </div>
          </Paper>
        </div>
        <PieChart width={350} height={350}>
          <Pie
            dataKey="count"
            isAnimationActive={false}
            data={format(tagCounts)}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
        <BarChart
          width={500}
          height={300}
          data={format(tagCounts, true)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
        </BarChart>
      </div>
    );
  }
}

TotalCharts.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  store: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default withStyles(styles)(TotalCharts);
