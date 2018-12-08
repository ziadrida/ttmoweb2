import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
    'background-color': 'green',
    float: 'left',
    width: '20%',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

class OrderStageCBGroup extends React.Component {
  state = {
    purchase: true,
    track: false,
    arrive: false,
    pack: false,
    ship: false,
    deliver: false,

  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { purchase, track, arrive,pack, ship, deliver } = this.state;
    const error = [purchase, track, arrive, pack, ship, deliver].filter(v => v).length !== 2;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Assign1 responsibility</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                checked={purchase}
                onChange={this.handleChange('purchase')}
                value="purchase" />
              }
              label="Purchase"
            />
            <FormControlLabel
              control={
                <Checkbox
                checked={track}
                onChange={this.handleChange('track')}
                value="track" />
              }
              label="Track"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={arrive}
                  onChange={this.handleChange('arrive')}
                  value="arrive"
                />
              }
              label="Arrive"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={pack}
                  onChange={this.handleChange('pack')}
                  value="pack"
                />
              }
              label="Pack"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ship}
                  onChange={this.handleChange('ship')}
                  value="ship"
                />
              }
              label="Ship"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={deliver}
                  onChange={this.handleChange('deliver')}
                  value="deliver"
                />
              }
              label="Deliver"
            />
          </FormGroup>
          <FormHelperText>---</FormHelperText>
        </FormControl>

      </div>
    );
  }
}

OrderStageCBGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderStageCBGroup);
