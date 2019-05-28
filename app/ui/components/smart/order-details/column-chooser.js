import React from "react";
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import Popover, {PopoverAnimationVertical} from '@material-ui/core/Popover';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from "@material-ui/core/styles";
import AlarmIcon from '@material-ui/icons/Reorder';
import  classes from "classnames";
import Tooltip from '@material-ui/core/Tooltip';
export const popoverStyles = {
    boxElementPad: {
        padding: "16px 24px 16px 24px",
        height:'auto'
    },

    formGroup: {
        marginTop: "8px",
    },
    formControl: {},
    checkbox: {
        width: "12px",
        height: "12px",
    },
    // checkboxColor: {
    //     "&$checked": {
    //         color: "#027cb5",
    //     },
    // },
    checked: {},
    label: {
        fontSize: "15px",
        marginLeft: "5px",
        color: "green",
        fontFamily: "seriff"
    },

};
class ColumnChooser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleClick = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };


    handleColChange = (index) => {
        this.props.onColumnUpdate(index,this.props.columns);
    };


    render() {
      //console.log('columnChooser props:',this.props)
        const { classes, columns } = this.props;
        console.log("columnChooser columns:",columns)
        const anchorOrigin={
             vertical: 'top',
             horizontal: 'left',
           }
        return (
            <div>
              <Tooltip id="tooltip-columns" title="Select Columns">
                <Button size="small" variant="outlined" onClick={this.handleClick} style={{backgroundColor:'white',height:'32px',padding:'2px',marginLeft:'5px'}} >
                    <AlarmIcon className={classes.icon} />
                </Button>
                </Tooltip>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={anchorOrigin}
                       transformOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left',
                       }}
                    onClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <FormControl component={"fieldset"} className={classes.boxElementPad} >
                        <FormGroup className={classes.formGroup}>
                            { columns.map((column, index) => {

                                return (
                                    column.id != "_selector" ?
                                    <FormControlLabel
                                        key={index}
                                        classes={{
                                            root: classes.formControl,
                                            label: classes.label,
                                        }}
                                        control={
                                            <Checkbox
                                                className={classes.checkbox}

                                                onChange={() => this.handleColChange(index)}
                                                checked={column.show}
                                                value={column.id}
                                            />
                                        }
                                        label={column.Header}
                                    />
                                    : null
                                );
                            })}
                        </FormGroup>
                    </FormControl>
                </Popover>
            </div>
        );
    }
}

export default withStyles(popoverStyles)(ColumnChooser);
