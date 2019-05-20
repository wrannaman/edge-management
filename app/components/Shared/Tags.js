import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { inject, observer } from 'mobx-react';
import Router from 'next/router';

// mui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

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
      // width: 500,
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%'
    },
    chip: {
      margin: 1,
    }
  });
};

@inject('store')
@observer
class Tags extends React.Component {

  static defaultProps = {
    textFieldWidth: 500,
    tagName: "",
    tags: [],
    showTags: true,
  }

  componentDidMount() {}

  renderChip = (chip, index) => {
    const { classes, handleDeleteChip, showTags } = this.props;

    if (showTags) {
      return (
        <Chip
          key={`${chip}-${index}`}
          color="primary"
          label={chip}
          onDelete={handleDeleteChip(index)}
          className={classes.chip}
          variant="outlined"
        />
      )
    }
    return (
      <Chip
        key={`${chip}-${index}`}
        color="primary"
        label={chip}
        className={classes.chip}
        variant="outlined"
      />
    );
  }

  render() {
    const {
      renderChip,
      props: {
        classes,
        textFieldWidth,
        addTag,
        handleChange,
        tags,
        tag,
        tagName,
        showTags,
      }
    } = this;
    return (
      <form onSubmit={addTag}>
        <div>
          {tags.length > 0 ? (
            <div>
              {tags.map(renderChip)}
            </div>
          ) : (null)}
        </div>
        {showTags && (
          <div>
            <div className={classes.textField}>
              <TextField
                label="Tags"
                className={classes.textField}
                value={tag}
                onChange={handleChange(tagName || 'tag')}
                margin="normal"
                style={{ width: textFieldWidth }}
              />
            </div>
            <div className={classes.textField}>
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                className={classes.textField}
                onClick={addTag}
                style={{ marginBottom: 25 }}
              >
                Add Tag
              </Button>
            </div>
          </div>
        )}
      </form>
    );
  }
}

Tags.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  // type: PropTypes.string.isRequired,
  // index: PropTypes.number,
  textFieldWidth: PropTypes.number,
  // save: PropTypes.func.isRequired.isRequired,
  handleDeleteChip: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  tags: PropTypes.array,
  tag: PropTypes.string.isRequired,
  tagName: PropTypes.string,
  showTags: PropTypes.bool,
};

export default withStyles(styles)(Tags);
