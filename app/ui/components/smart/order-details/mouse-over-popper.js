import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";

const styles = theme => ({
  typography: {
    useNextVariants: true,
    margin: theme.spacing.unit * 2
  }
});

class SimplePopover extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const anchorOrigin={
      vertical: "top",
      horizontal: "left"
    }
    return (
      <div>
        <Button variant="contained" onClick={this.handleClick}>
          Open Popover
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={anchorOrigin}
          transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
          }}

        >
          <Typography className={classes.typography}>
            The content of the Popover.
          </Typography>
        </Popover>
      </div>
    );
  }
}

SimplePopover.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimplePopover);
