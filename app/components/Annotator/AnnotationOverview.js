import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigatePrev from '@material-ui/icons/NavigateBefore';
import Snacky from '../Shared/Snackbar';
import Labeler from "./Labeler";
import Labels from "./Labels";

const styles = {
  card: {
    padding: 0,
    margin: 0,
    outline: 'none',
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    outline: 'none',
  },
  annotationArea: {
    outline: 'none',
  },
  imageWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'flex-start',
    outline: 'none',
  },
};

@inject('store')
@observer
class AssetCard extends Component {
  render() {
    const {
      props: {
        classes,
        save,
        navigate,
        filter,
        store: { collection: { total, limit, page, annotatingIndex } },
      }
    } = this;
    return (
        <Paper
          className={classes.card}
        >
          <div className={classes.annotationArea}>
            <div
              className={classes.action}
            >
              <IconButton
                onClick={navigate('prev')}
                color="primary"
              >
                <NavigatePrev />
              </IconButton>

              <div className={classes.counter}>
                <Typography>
                  {Number(page) * Number(limit) + Number(annotatingIndex) + 1} / {total}
                </Typography>
              </div>

              <IconButton
                onClick={navigate('next')}
                color="primary"
              >
                <NavigateNext />
              </IconButton>
            </div>

            <div className={classes.imageWrap}>
              <Labeler
                save={save}
              />
              <Labels
                save={save}
                filter={filter}
              />
            </div>
          </div>
        </Paper>
    );
  }

}

AssetCard.propTypes = {
  classes: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(AssetCard));
