import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import MUITooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Loading from '../Shared/Loading';

import {
  PieChart, Pie, Legend, Tooltip,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Brush, ReferenceLine,
  LineChart, Line,
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
    minWidth: 150,
  },
  paperWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflowX: 'scroll',
    overflowY: 'hidden'
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 25,
    paddingLeft: 15,
  },
  section: {
    width: '80%',
    marginTop: 25,
    paddingBottom: 10,
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  chartsTogether: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  averages: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  marginRight: {
    marginRight: 15,
  },
  centered: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

@inject('store')
@observer
class TotalCharts extends React.Component {

  formatTotals = (totals, sort = true) => {
    if (!totals) return [];
    let data = [];
    Object.keys(totals).forEach((tag) => {
      data.push({ name: tag, count: totals[tag] });
    });
    if (sort) data = data.sort((a, b) => b.count - a.count);
    return data;
  }

  format = (tagCounts, sort = true) => {
    let tags = [];
    if (!tagCounts) return [];
    let data = [];
    const intermediate = {};
    Object.keys(tagCounts).forEach((date) => {
      Object.keys(tagCounts[date]).forEach((tag) => {
        tags.push(tag);
        const formattedDate = moment(new Date(date)).format('M/D/Y');
        if (!intermediate[formattedDate]) intermediate[formattedDate] = [];
        intermediate[formattedDate].push({ name: tag, count: tagCounts[date][tag] });
      });
    });
    if (sort) data = data.sort((a, b) => b.count - a.count);
    tags = [...new Set(tags)];
    Object.keys(intermediate).forEach((date) => {
      const point = { date };
      intermediate[date].forEach((obj) => {
        point[obj.name] = obj.count;
      });
      data.push(point);
    });
    return [data, tags];
  }

  formatAverages = (averages) => {
    const avg = [];
    if (averages && averages.age && averages.age.average) {
      avg.push({
        name: 'Average Age',
        count: averages.age.average.toFixed(2)
      });
    }
    if (averages && averages.gender && averages.gender.numMalesPerPhotoWithMales) {
      avg.push({
        name: 'Average number of males in photos containing males',
        count: averages.gender.numMalesPerPhotoWithMales.toFixed(2)
      });
    }
    if (averages && averages.gender && averages.gender.numFemalesPerPhotoWithFemales) {
      avg.push({
        name: 'Average number of females in photos containing females',
        count: averages.gender.numFemalesPerPhotoWithFemales.toFixed(2)
      });
    }
    if (averages && averages.gender && averages.gender.containsBothMaleAndFemaleIfAnyGender) {
      avg.push({
        name: 'Percent of assets containing both male and female when either a male or female was detected',
        count: averages.gender.containsBothMaleAndFemaleIfAnyGender.toFixed(2)
      });
    }
    return avg;
  }
  randcolor = () => "#xxxxxx".replace(/x/g, () => (Math.random() * 16 | 0).toString(16));

  handleMouseEnter = () => (o) => {
    const { dataKey } = o;
    // console.log('DATAKEY', dataKey)

  }

  handleMouseLeave = () => (o) => {
    const { dataKey } = o;
    // console.log('DATAKEY', dataKey)

  }

  render() {
    const { handleMouseLeave, handleMouseEnter, randcolor, format, formatTotals, formatAverages, props: { classes } } = this;
    const { dashboard: { currentQuery, loading } } = this.props.store;
    if (!currentQuery.counts) return null;
    const { counts: { tagCounts, totalCounts, globalAverages }} = currentQuery;
    if (!tagCounts || !totalCounts) return null;

    if (loading) {
      return (
        <Loading />
      );
    }

    return (
      <div className={classes.page}>
        <Paper className={classes.section}>
          <Typography variant="h5" className={classes.sectionTitle}>
            Totals
          </Typography>
          <div className={classes.paperWrapper}>
            <Paper
              className={classes.paperTotals}
            >
              <Typography>
                Top 5
              </Typography>
              <div>
                {formatTotals(totalCounts, true).slice(0, 5).map(tag => (
                  <Typography
                    key={`${tag.count}-${tag.name}-`}
                    variant="overline"
                    style={{ lineHeight: 1.6 }}
                  >
                    {tag.name} ({tag.count})
                  </Typography>
                ))}
              </div>
            </Paper>
            {formatTotals(totalCounts, true).map((tag) => (
              <Paper
                key={`${tag.name}-${tag.count}`}
                className={classes.paperTotals}
              >
                  <Typography variant="h4">
                    {tag.count}
                  </Typography>
                  <Typography variant="overline">
                    {tag.name}
                  </Typography>
              </Paper>
            ))}
          </div>
        </Paper>
        {formatAverages(globalAverages).length > 0 && (
          <Paper className={classes.section}>
            <div className={classes.averages}>
              <Typography variant="h5" className={[classes.sectionTitle, classes.marginRight].join(' ')}>
                Averages
              </Typography>
              <MUITooltip
                title={`Add average card to this report.`}
                placement="left"
              >
                <Fab
                  onClick={close}
                  size="medium"
                  color="primary"
                  aria-label="Add"
                  className={classes.margin}
                >
                  <AddIcon />
                </Fab>
              </MUITooltip>
            </div>
            <div className={classes.paperWrapper}>
              {formatAverages(globalAverages, true).map((tag) => (
                <Paper
                  key={`${tag.name}-${tag.count}`}
                  className={classes.paperTotals}
                >
                    <Typography variant="h4">
                      {tag.count}
                    </Typography>
                    <Typography
                      variant="overline"
                      style={{ lineHeight: 1, textAlign: 'center' }}
                    >
                      {tag.name}
                    </Typography>
                </Paper>
              ))}
            </div>
          </Paper>
        )}
        <Paper className={classes.section}>
          <Typography variant="h5" className={classes.sectionTitle}>
            Tags Over Time
          </Typography>
          <div className={classes.centered}>
            <LineChart
              width={600}
              height={500}
              data={format(tagCounts, true)[0]}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend onMouseEnter={handleMouseEnter()} onMouseLeave={handleMouseLeave()} />
              {format(tagCounts, true)[1].map((name) => (
                <Line key={name} type="monotone" dataKey={name} stroke={randcolor()} />
              ))}
            </LineChart>
          </div>
        </Paper>
        <Paper className={classes.section}>
          <Typography variant="h5" className={classes.sectionTitle}>
            Tags By Frequency
          </Typography>
          <div className={classes.chartsTogether}>
            <PieChart width={350} height={350}>
              <Pie
                dataKey="count"
                isAnimationActive={false}
                data={formatTotals(totalCounts, true)}
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
              data={formatTotals(totalCounts, true)}
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
        </Paper>
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
