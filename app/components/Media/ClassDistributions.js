import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const styles = theme => {
  return ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 500,
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%'
    }
  });
};

const CustomTooltip = ({ classes, active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <Typography>
          {classes[label] ? classes[label] : label}: {(payload[0].value).toFixed(0)}%
        </Typography>
      </div>
    );
  }

  return null;
};

@inject('store')
@observer
class NewProjectForm extends React.Component {
  static defaultProps = {
    height: 100,
    tiny: true,
    widthFactor: 25,
    inverse: false,
  }

  state = {
  };
  componentDidMount() {}
  render() {
    const {
      props: {
        assetClasses,
        totalAssets,
        height,
        tiny,
        widthFactor,
        inverse,
      }
    } = this;

    const data = [];
    if (!assetClasses) return null;
    Object.keys(assetClasses).forEach(k => {
      data.push({
        name: k.length > 5 && tiny ? `${k.slice(0, 5)}...` : k,
        percent: (assetClasses[k] / totalAssets).toFixed(2) * 100
      });
    });

    if (tiny && Object.keys(assetClasses).length > 10) {
      return (
        <Typography>
          ...too long
        </Typography>
      );
    }

    let width = tiny ? data.length * widthFactor : window.innerWidth / 2;
    if (!tiny && inverse) {
      width = 700;
    }
    return (
      <div>
        <BarChart
          width={width}
          height={height}
          data={data}
          layout={inverse ? "vertical" : "horizontal"}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          {!tiny && (<XAxis dataKey={inverse ? "percent" : "name"} type={inverse ? "number" : "category"} />)}
          {!tiny && (<YAxis dataKey={inverse ? "name" : "percent"} type={inverse ? "category" : "number"} />)}
          {!tiny && (<Legend />)}
         <Tooltip content={<CustomTooltip classes={Object.keys(assetClasses)}/>} />
         <Bar dataKey="percent" fill="#8884d8" />
        </BarChart>
      </div>
    );
  }
}

NewProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
  assetClasses: PropTypes.object.isRequired,
  totalAssets: PropTypes.number.isRequired,
  height: PropTypes.number,
  tiny: PropTypes.bool,
  widthFactor: PropTypes.number,
  inverse: PropTypes.bool,
};

export default withStyles(styles)(NewProjectForm);
