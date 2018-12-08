import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';

const styles = theme => ({
  root: {
    display: 'flex',
  //  'background-color': 'lightgreen',
  },
  formControl: {
    margin: theme.spacing.unit * 1,
  },
  label : {
    margin: -10,
  }
});


class OrderStageFilter extends React.Component {
  state = {
    value: 'purchase',
  };

  handleChange = event => {
    console.log('handle stage change to:',event.target.value)
    this.setState({ value: event.target.value });
    // call onChange handler on parent (order-dtail-page)
    if (typeof this.props.onChange === 'function') {
           this.props.onChange(event.target.value);
       }
  };

  render() {
    const { classes } = this.props;
    //const { purchase, track, arrive,pack, ship, deliver } = this.state;
    //  const error = [purchase, track, arrive, pack, ship, deliver].filter(v => v).length !== 2;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Next Stage</FormLabel>
          <RadioGroup
            aria-label="Stages"
            name="stage"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
            >
            <FormControlLabel
              value="all"
                className={classes.label}
              control={ <Radio  />}
              label="All Stages"
            />
            <FormControlLabel
              value="payment"
                className={classes.label}
              control={ <Radio  />}
              label="Payment"

            />
            <FormControlLabel
              value="purchase"
                className={classes.label}
              control={ <Radio  />}
              label="Purchase"
            />
            <FormControlLabel
            value="track"
              className={classes.label}
              control={ <Radio  />}
              label="Track"
            />
            <FormControlLabel
            value="arrive"
              className={classes.label}
              control={ <Radio  />}
              label="Arrive"
            />
            <FormControlLabel
            value="pack"
              className={classes.label}
              control={ <Radio  />}
              label="Pack"
            />
            <FormControlLabel
            value="ship"
              className={classes.label}
              control={ <Radio  />}
              label="Ship"
            />
            <FormControlLabel
            value="deliver"
  className={classes.label}
              control={ <Radio  />}
              label="Deliver"
            />
            <FormControlLabel
              value="close"
                className={classes.label}
              control={ <Radio  />}
              label="Include Closed"
            />
          </RadioGroup>
          <FormHelperText>---</FormHelperText>
        </FormControl>

      </div>
    );
  }
}

OrderStageFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange:   PropTypes.func,
};

export default withStyles(styles)(OrderStageFilter);
