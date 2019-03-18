import React from 'react';
// Import React Table
import ReactTable,{ReactTableDefaults} from "react-table";
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import ListSubheader from '@material-ui/core/ListSubheader';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {  graphql } from 'react-apollo';
import { compose } from "recompose";

import gql from 'graphql-tag';
import { onError } from "apollo-link-error";
import {DatePicker} from 'material-ui-pickers';
//import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import Loading from '/app/ui/components/dumb/loading';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';

import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';

import Checkbox from "@material-ui/core/Checkbox";
//import ReactSelect from '/app/ui/components/smart/ReactSelect';
import UserSelect from '/app/ui/components/smart/UserSelect';

import quotationsQuery from '/app/ui/apollo-client/quotation/query/quotations';

import categoriesQuery from '/app/ui/apollo-client/category/query/categories.js';
// withStyles takes the styles and change them to classes props
import { Query } from 'react-apollo'
import {calculatePrice,validateItem} from './helper'


import classNames from 'classnames';
import ReactSelect from 'react-select';

import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';

import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';


import { emphasize } from '@material-ui/core/styles/colorManipulator';

//import axios from 'axios';
// const usersQueryx = gql`
//
// query users ($search: String,$searchField: String) {
// getUsers(username: $username,userId:$userId, search: $search, searchField: $searchField) {
//    name
//    userId
// }
// }
// `;
const styles = theme => ({
  fab: {
  margin: theme.spacing.unit,

},
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 100,
    font: 'bold',
  },
  datePickers: {
    display: 'flex',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    'justify-content': 'space-around',
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 19,
    width: 120,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  dense: {
    marginTop: 10,
  },
  menu: {
    width: 300,
  },
  boxElementPad: {
      padding: "16px 24px 16px 24px",
      height:'auto'
  },

  formGroup: {
      marginTop: "8px",
  },

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
    root: {
      flexGrow: 1,
      height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    selectValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 600 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SelectValue(props) {
  console.log("SelectValue:",props)
  return (
    <Typography className={props.selectProps.classes.selectValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  console.log("ValueContainer:",props)
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}



function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SelectValue,
  ValueContainer,
};


class QuoteForm extends React.Component {
  constructor(props) {
    console.log("<QuoteForm> constructor props:",props)
  super(props);
  this.state = {
    pricingNow:null,

    categorySearch: {},
    copySuccess: '',
    bulkUpdate: false,
    validBulkUpdate: false,
    refresh: false,
    selectedQuoteList: [],
    allowSave: false,
    message: '',
  formEditInfo: {

  },

  quoteInfo: {
    _id:'',
    quote_no:'',
    senderId:'',
    sales_person:'',
    date_created:'',
    created_by:'',

    quotation :{
      quote_no:'',
      quote_date:'',
      ownderId:'',
      url:'',
      thumbnailImage:'',
      source:'',
      price:'',
      qty:'',
      shipping:'',
      category:'',
      title:'',
      weight:'',
      height:'',
      length:'',
      width:'',
      username:'',
      chargeableWeight:'',
      final:'',
      requestor:'',
      price_selection:'',
      notes:'',
      final:'',
      active:'',
      po_no:'',

      sales_person:'',
      message:'',
      reason:'',

      item :{
        recipientID:'',
        ownderId:'',
        title:'',
        MPN:'',
        asin:'',
        url:'',
        thumbnailImage:'',
        source:'',
        price:'',
        qty:'',
        shipping:'',
        category:'',
        condition:'',
        weight:'',
        height:'',
        length:'',
        width:'',
        language:'',
        username:'',
        chargeableWeight:'',
        final:'',
        requestor:'',
        quote_no:'',
        recipentID:'',

      },
      prices: {
        amm_exp: {
          destination:'',
          type:'',
          delivery:'',
          price:'',
        },
        amm_std :{
          destination:'',
          type:'',
          delivery:'',
          price:'',
        },
        aq_std :{
          destination:'',
          type:'',
          delivery:'',
          price:'',
        },

      }
    }
  }
}
    // TODO: add errors field
    this.mutateAction = this.mutateAction.bind(this)
    this.handleCatgChange = this.handleCatgChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
}
componentDidUpdate() {
  console.log("<componentDidUpdate> <QuoteForm> \nprops",this.props, "\nstate",this.state)
  //console.log("<componentDidUpdate> <QuoteForm> call calculatePrice for state.formEditInfo:",this.state.formEditInfo)


}

componentDidMount() {
  console.log("<componentDidMount> <QuoteForm> \nprops",this.props, "\nstate",this.state)
}

static  getDerivedStateFromProps(props, state) {
  console.log("<getDerivedStateFromProps> <QuoteForm> \nprops",props, "\nstate",state)
  const {selection,getRow} = props
  const bulkUpdate = selection && selection.length > 1

  var tmpselectedQuoteList = []
  var changedList = false;


  var returnState = {}

    if (state.refresh ) {
      returnState =  {
        ...returnState,
        refresh: false,

      }
    }
    if (props.quoteInfo && state.quoteInfo && props.quoteInfo._id !== state.quoteInfo._id && !bulkUpdate) {
      console.log("<getDerivedStateFromProps> <QuoteForm> ************ Quote _id changed => Update state")
      const { quotation  } = props.quoteInfo
      var {item} = quotation
      if (item!= null) {
        // dimensions cleanup

        item.height = item.height !=null ? !isNaN(item.height) && item.height>=0? parseFloat(item.height.toFixed(2)):0:0;

        item.length = item.length !=null ? !isNaN(item.length) && item.length>=0? parseFloat(item.length.toFixed(2)):0:0;
        item.width = item.width !=null ? !isNaN(item.width)&& item.width>=0 ? parseFloat(item.width.toFixed(2)):0:0;
        item.weight = item.weight !=null ? !isNaN(item.weight)&& item.weight>=0? parseFloat(item.weight.toFixed(2)):0:0;
        item.shipping = item.shipping !=null ? !isNaN(item.shipping)&& item.shipping>=0? parseFloat(item.shipping.toFixed(2)):0:0;
        item.qty = item.qty !=null ? !isNaN(item.qty)&& item.qty>=1? parseFloat(item.qty.toFixed(2)):1:1;
        item.price = item.price !=null ? !isNaN(item.price)&& item.price>=0? parseFloat(item.price.toFixed(2)):0:0;

      }
      console.log("<getDerivedStateFromProps> <QuoteForm>   items preset",item)
      try {
      returnState =  {
        ...returnState,
        userSearch: {
          userId:quotation.ownerId? quotation.ownerId:item.ownderId? item.ownderId:props.quoteInfo.senderId,
        },
        message:props.quoteInfo.quote_no?'Loaded Quote#'+props.quoteInfo.quote_no:'',
        quoteInfo: props.quoteInfo ,
        categorySearch: {
          category_name: item.category && item.category.length>0? item.category[0]:'',

        },

        formEditInfo: {
          userInfo: {
            username: quotation.username,
            userId: quotation.ownerId? quotation.ownerId:item.ownderId? item.ownderId:props.quoteInfo.senderId,
          },
          quote_no:props.quoteInfo.quote_no,
          edit_senderId:props.quoteInfo.senderId,
          edit_ownderId: quotation.ownerId? quotation.ownerId:item.ownerId? item.ownerId:'',
          edit_notes:props.quoteInfo.notes? props.quoteInfo.notes:'',
          edit_options: props.quoteInfo.options?props.quoteInfo.options:'',
          edit_title: quotation.title? quotation.title:   item.title?item.title:'',
          edit_url: quotation.url? quotation.url:
              item.url?item.url:'',
          edit_price_selection: quotation.price_selection,
          edit_priceType: quotation.prices && quotation.price_selection?
            quotation.prices[quotation.price_selection].type:'',
          edit_destination: quotation.prices && quotation.price_selection?
            quotation.prices[quotation.price_selection].destination:'',

          edit_username:
            {value:quotation.ownerId? quotation.ownerId:item.ownderId? item.ownderId:props.quoteInfo.senderId,// yes ownderId is misspelled!
            label: item.username? item.username:quotation.username? quotation.username:''},

          edit_MPN: item.MPM? item.MPN:'',
          edit_asin: item.asin? item.asin:'',
          edit_category:
            {value: item.category_info && item.category_info.category_name?
                item.category_info.category_name:'',
             label:item.category_info && item.category_info.category_name?
                 item.category_info.category_name + '/'+item.category_info.category_name_ar:'',
               },
          edit_category_info: item.category_info,
          edit_chargeableWeight: item.chargeableWeight!=null? item.chargeableWeight:'',
          edit_condition: item.condition? item.condition:'',
          edit_send_action: '',
          // edit_active: quotation.active!=null? quotation.active:false,
          // edit_final: quotation.final!=null? quotation.final:false,
          edit_reason: quotation.reason!=null? quotation.reason:false,
          edit_height_inch: item.height,
          edit_length_inch: item.length,
          edit_width_inch: item.width,
          edit_weight_lb: item.weight,
          edit_dimensions_inch:  item.length.toFixed(2) +' x '+ item.width.toFixed(2) + ' x ' +  item.height.toFixed(2) ,

          edit_height_cm: parseFloat((item.height*2.54).toFixed(2)),
          edit_length_cm:  parseFloat((item.length*2.54).toFixed(2)),
          edit_width_cm: parseFloat((item.width*2.54).toFixed(2)),
          edit_dimensions_cm: (item.length*2.54).toFixed(2) + ' x ' +
                                (item.width*2.54).toFixed(2)  + ' x ' +
                                (item.height*2.54).toFixed(2),

          edit_weight_kg:  parseFloat((item.weight/2.2).toFixed(2)),

          edit_language: item.language? item.language:'en',

          edit_ownderId: item.ownderId? item.ownderId:'',
          edit_price: item.price,
          edit_qty: item.qty,

          edit_recipientID: item.recipientID? item.recipientID:'',
          edit_requestor: item.requestor? item.requestor:'',
          edit_shipping: item.shipping!=null && !isNaN(item.shipping)? parseFloat(item.shipping):0,
          edit_source: item.source? item.source:'',
          edit_condition: item.condition? item.condition:'New',
          edit_send_action: '',
          edit_thumbnailImage: item.thumbnailImage? item.thumbnailImage:null,
        },

      } } catch(err) {
        console.log("<getDerivedStateFromProps> <QuoteForm> error setting State err:",err)
      }
      console.log("<getDerivedStateFromProps> <QuoteForm> handled quoteInfo change")
    } else {
      console.log("<getDerivedStateFromProps> <QuoteForm> no change in quoteInfo - same quotation#")
    }


    console.log("<getDerivedStateFromProps>  <QuoteForm> set finalState returnState:",returnState)
    var finalState = returnState!={}? returnState: null
    console.log('<getDerivedStateFromProps> <QuoteForm> finalState:',finalState)
    // Return null to indicate no change to state.
    return finalState;
  }

handleDateChange = date => {

      this.setState({
          formEditInfo: {
          ...this.state.formEditInfo,
          edit_customer_delivery_date: date
        },
        allowSave: false

      });
  };



  handleUserInputChange = (userInput) => {
    console.log("========**** <QuoteForm> handleUserInputChange userInput",userInput)
  // this.setState({ userInput });
   this.setState(
         {
         userSearch: {
           userId: null,
           username: null,
           search: userInput,
           searchField: 'all' ,

         },
         // formEditInfo: {
         //    ...this.state.formEditInfo,
         //   edit_username: null,
         // },
       allowSave: false
     });
   console.log(`<QuoteForm> handleUserInputChange newState::`, this.state);

  }

  handleUserSelection = (username, userInfo) => {
    console.log("<QuoteForm> handleUserSelection username",username)
    console.log("<QuoteForm> handleUserSelection userInfo",userInfo)

    this.setState(
          {
          formEditInfo: {
          ...this.state.formEditInfo,
            edit_username: username, // has name and userId and label and value
            userInfo: userInfo,
        },
        allowSave: true,

      });

  }
  // handleChange function

  //  handleChange = name => value => {
  handleChange = ({ target }) => {

    console.log('in quoteForm handlesChange ',target)
    const { value, name } = target;


    console.log('<><>quoteForm in handleChange ')
    console.log("name:",name,"  value:",value)
    this.setState(
          {
          formEditInfo: {
          ...this.state.formEditInfo,
            [name]: value
        },
        allowSave: true,

      });

    console.log('<QuoteForm> handleChange state:',this.state)

  }


    handleCatgChange = name => value => {
      console.log("handleCatgChange name:value",name,":",value)
      console.log('<handleCatgChange> props:',this.props)
      const {getCategories} = this.props.categoriesQuery
      // find new category_info
      var catIdx=-1;
      var category_info;
      if (value && value.value !=null && getCategories && getCategories.length>0) {
        catIdx =getCategories.findIndex(
       x=>  x.category_name == value.value)
       console.log("<handleCatgChange><>   catIdx:",catIdx)
       if (catIdx>=0) {
        category_info = getCategories[catIdx]
       }
       console.log("<handleCatgChange> category_info:",category_info)
     }
      this.setState(
            {
            formEditInfo: {
            ...this.state.formEditInfo,
              [name]: value,
              edit_category_info: category_info,

          },
          allowSave: true,

        });

    }

  handleCostingChange = async ({ target }) => {
    console.log('in <handleCostingChange> <QuoteForm> ',target)
      console.log('<handleCostingChange> props:',this.props)

    if (!target) return;
    const { value, name } = target;
    console.log("<handleCostingChange> <QuoteForm> name:",name,"  value:",value)
    // recompute chargeableWeight
    // reject negative values

    var newState = {
      formEditInfo: {
        ...this.state.formEditInfo,
        [name]: value
      },
      quoteInfo: {
        ...this.state.quoteInfo,
      }

    }

      const dimRegEx = /^[ |\t]*\d+(\.\d+)?[ |\t]*x[ |\t]*\d+(\.\d+)?[ |\t]*x[ |\t]*\d+(\.\d+)?[ |\t]*$/
      var dim=[]
    switch (name) {

      case 'edit_category':
        console.log("<handleCostingChange> category changed")

        const {getCategories} = this.props.categoriesQuery
        // find new category_info
        var catIdx=-1;
        var category_info;
        if (value && value.value !=null && getCategories && getCategories.length>0) {
          catIdx =getCategories.findIndex(
         x=>  x.category_name == value.value)
         console.log("<handleCostingChange><>   catIdx:",catIdx)
         if (catIdx>=0) {
          category_info = getCategories[catIdx]
         }
         console.log("<handleCostingChange> category_info:",category_info)
       }

        newState.formEditInfo.edit_category_info = category_info

      break
      case 'edit_price':

        break;
      case 'edit_shipping':

        break;
      case 'edit_dimensions_cm':

      console.log('<QuoteForm> valid dimensions format:',  new RegExp(dimRegEx).test(value));
        newState.formEditInfo.edit_dimensions_cm=value;
      if ( new RegExp(dimRegEx).test(value)) {

         dim = value.split('x');
          console.log('<QuoteForm> dims:',dim)

        if (dim && dim.length>0) {
          newState.formEditInfo.edit_length_cm =  parseFloat(dim[0].trim())
          newState.formEditInfo.edit_width_cm =  parseFloat(dim[1].trim())
          newState.formEditInfo.edit_height_cm =  parseFloat(dim[2].trim())

          newState.formEditInfo.edit_length_inch =parseFloat((newState.formEditInfo.edit_length_cm/2.54).toFixed(2))
          newState.formEditInfo.edit_width_inch =parseFloat((newState.formEditInfo.edit_width_cm/2.54).toFixed(2))
          newState.formEditInfo.edit_height_inch =parseFloat((newState.formEditInfo.edit_height_cm/2.54).toFixed(2))
          newState.formEditInfo.edit_dimensions_inch =
            parseFloat(newState.formEditInfo.edit_length_inch).toFixed(2) + ' x ' +
            parseFloat(newState.formEditInfo.edit_width_inch).toFixed(2) + ' x ' +
            parseFloat(newState.formEditInfo.edit_height_inch).toFixed(2) ;
        }
      }

        break;
      case 'edit_dimensions_inch':

      console.log('<QuoteForm> valid dimensions format:',  new RegExp(dimRegEx).test(value));
        newState.formEditInfo.edit_dimensions_inch=value;
      if ( new RegExp(dimRegEx).test(value)) {

         dim = value.split('x');
          console.log('<QuoteForm> dims:',dim)

        if (dim && dim.length>0) {
          newState.formEditInfo.edit_length_inch =  parseFloat(dim[0].trim())
          newState.formEditInfo.edit_width_inch =  parseFloat(dim[1].trim())
          newState.formEditInfo.edit_height_inch =  parseFloat(dim[2].trim())

          newState.formEditInfo.edit_length_cm =parseFloat((newState.formEditInfo.edit_length_inch*2.54).toFixed(2))
          newState.formEditInfo.edit_width_cm =parseFloat((newState.formEditInfo.edit_width_inch*2.54).toFixed(2))
          newState.formEditInfo.edit_height_cm =parseFloat((newState.formEditInfo.edit_height_inch*2.54).toFixed(2))

          newState.formEditInfo.edit_dimensions_cm =
          parseFloat(newState.formEditInfo.edit_length_cm).toFixed(2) + ' x ' +
          parseFloat(newState.formEditInfo.edit_width_cm).toFixed(2) + ' x ' +
          parseFloat(newState.formEditInfo.edit_height_cm).toFixed(2) ;
        }
      }
        break;
      // weight
      case 'edit_weight_lb':
        if (isNaN(value) || value<0) return;
        newState.formEditInfo.
          edit_weight_kg = parseFloat((value/2.2).toFixed(2))

        break;
        case 'edit_weight_kg':
          if (isNaN(value) || value<0) return;
            newState.formEditInfo.
            edit_weight_lb = parseFloat((value*2.2).toFixed(2))

            break;
        //length
        case 'edit_length_cm':
          if (isNaN(value) || value<0) return;
            newState.formEditInfo.
              edit_length_inch =parseFloat((value/2.54).toFixed(2))

          break;
        case 'edit_length_inch':
          if (isNaN(value) || value<0) return;
                  newState.formEditInfo.
                  edit_length_cm =parseFloat((value*2.54).toFixed(2))

        break;

        // width
        case 'edit_width_cm':
          if (isNaN(value) || value<0) return;
            newState.formEditInfo.
              edit_width_inch = parseFloat((value/2.54).toFixed(2))

          break;
        case 'edit_width_inch':
          if (isNaN(value) || value<0) return;
                newState.formEditInfo.
                  edit_width_cm= parseFloat((value*2.54).toFixed(2))

          break;

        // height
        case 'edit_height_cm':
          if (isNaN(value) || value<0) return;
              newState.formEditInfo.
              edit_height_inch = parseFloat((value/2.54).toFixed(2))

          break;
        case 'edit_height_inch':
          if (isNaN(value) || value<0) return;
                  newState.formEditInfo.
                  edit_height_cm= parseFloat((value*2.54).toFixed(2))

          break;

      default:
        console.log("<handleCostingChange>  unknown field name")
    }


    switch(name) {
        case 'edit_length_cm':
        case 'edit_width_cm':
        case 'edit_height_cm':
        case 'edit_length_inch':
        case 'edit_width_inch':
        case 'edit_height_inch':
        case 'edit_weight_lb':
        case 'edit_weight_kg':
        newState.formEditInfo.edit_chargeableWeight =
            Math.max(
              parseFloat(((newState.formEditInfo.edit_width_cm *
                newState.formEditInfo.edit_length_cm *
                newState.formEditInfo.edit_height_cm) / 5000).toFixed(2)),
            parseFloat(newState.formEditInfo.edit_weight_kg))
          newState.formEditInfo.edit_dimensions_cm =
          parseFloat(newState.formEditInfo.edit_length_cm).toFixed(2) + ' x ' +
          parseFloat(newState.formEditInfo.edit_width_cm).toFixed(2) + ' x ' +
          parseFloat(newState.formEditInfo.edit_height_cm).toFixed(2) ;

          newState.formEditInfo.edit_dimensions_inch =
            parseFloat(newState.formEditInfo.edit_length_inch).toFixed(2) + ' x ' +
            parseFloat(newState.formEditInfo.edit_width_inch).toFixed(2) + ' x ' +
          parseFloat(newState.formEditInfo.edit_height_inch).toFixed(2) ;
      break;
      default:
        console.log("<QuoteForm>  not a weight or dimensions field")
    }



     console.log('<handleCostingChange> <QuoteForm> newState:',newState)

     if (newState.formEditInfo.edit_chargeableWeight <=0) {
       //if (newState.quoteInfo && newState.quoteInfo.quotation) {
        //newState.quoteInfo.quotation.prices = null;
        newState.formEditInfo.edit_price_selection = null;
      //}
       var quotation =this.state.quoteInfo? this.state.quoteInfo.quotation:null;

       newState = {
         ...newState,
         message:"Weight and/or dimensions are required"
       }
       await this.setStateAsync(newState)
       return;
     } else {
       newState = {
         ...newState,
         message:"Recomputing price ..."
       }
      await this.setStateAsync(newState);
    // if (this.state.pricingNow != null &&this.state.pricingNow  ) {
    //     console.log("<handleCostingChange> <QuoteForm> !!! waiting for pricing to complete")
    //   return
    // }
      var quoteObj = null ;
    try {
        console.log("<handleCostingChange> <QuoteForm> >>>> Call doCalculate:")
       quoteObj = await doCalculate(this.state.formEditInfo) //.then( quoteObj=> {
        console.log("<handleCostingChange> <QuoteForm> >>>> After doCalculate then.quoteObj:",quoteObj)
      //  quote_obj.active = true; // active = should load in customer cart when final
      //  quote_obj.final = true; // final = pricing complete

        this.setState ( {
          formEditInfo: {
            ...this.state.formEditInfo,
            edit_price_selection: quoteObj.price_selection?quoteObj.price_selection:'amm_exp',
          },
          quoteInfo: {
            ...this.props.quoteInfo,
             quotation: quoteObj, // setting for active and final is included

        },
        message:quoteObj.message,
        pricingNow: false,
        allowSave: quoteObj!=null,
      })
    } catch(err)  {
        console.log("<handleCostingChange> <QuoteForm> then.catch Error thrown by doCalculate:",err)
        var quotation =this.state.quoteInfo? this.state.quoteInfo.quotation:null;
        quotation = {
          ...quotation,
          active: true, // active = should load in customer cart when final
          final: false, // final = is pricing correct and complete?
        //  valid: false,
          prices: null,
          price_selection:null,
        }
        console.log("<handleCostingChange> <QuoteForm> quotation:",quotation)
       this.setState(
        {
          message:err && err.message? err.message:
                  err? err:'Error calculating price. Check input fields',
          pricingNow:null,
          allowSave: false,

         // invalidate pricing
         quoteInfo: {
           ...this.state.quoteInfo,
           quotation:quotation,
         }
       })
     }

    console.log("<handleCostingChange> <QuoteForm> >>> After   calculatePrice Continue")

    console.log('updateQuotation handleChange',this.state)
  }

  }




    handleCheckbox = name => event => {

      console.log('>handleCheckbox name:',name)
      console.log('>handleCheckbox  event.target:',event.target)
      console.log('>handleCheckbox  event.target.checked:',event.target.checked)
      this.setState({
        formEditInfo: {
        ...this.state.formEditInfo,
         [name]: event.target.checked },
       allowSave:false
     });
    };

    setStateAsync(state) {
        return new Promise((resolve) => {
          this.setState(state, resolve)
        });
    }

    handleSendQuotation = async (evt) => {
      console.log('<handleSendQuotation> <QuoteForm> :',evt)
       console.log('<handleSendQuotation> <QuoteForm> state:',this.state)
       const userId = this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null;
       if(!userId) {
         this.setState({
           message:"Invalid user ID"
         })
         return;
       }
      var quoteMsgPayload = {action: '*quote', quote_no: this.state.formEditInfo.quote_no,
        userId:this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null

      }
      console.log("'<handleSendQuotation> <QuoteForm> quoteMsgPayload:",quoteMsgPayload)
     //  axios.post('https://protected-thicket-49120.herokuapp.com/webhook', { quoteMsgPayload })
     // .then(res => {
     //   console.log("<handleSendQuotation> <QuoteForm> res:",res);
     //   console.log("<handleSendQuotation> <QuoteForm> res.data:" ,res.data);
     // })
     this.setState({
       message:"Sent quotation to user"
     })
    }

   handleAction = async (evt) => {
    evt.preventDefault();
    console.log('<handleAction> <QuoteForm> :',evt)
    console.log('<handleAction> => <QuoteForm>  props==>\n',this.props)
    console.log('<handleAction> => <QuoteForm>   state\n',this.state)
    const { closePopup } = this.props;
    await this.setStateAsync({
        message:"Saving quotation ...",
       allowSave: false
    })


     const {  bulkUpdate,  validBulkUpdate } = this.state
     var newselectedQuoteList = []
     var selectedQuoteList = this.state.selectedQuoteList;

     if (bulkUpdate) {
       // creating multiple quotes
       console.log("--> Do bulkUpdate - selectedQuoteList:",selectedQuoteList);
        selectedQuoteList = selectedQuoteList.map(async quoteInfo => {
         console.log("call mutateAction for quoteInfo:",quoteInfo)
        //console.log('update=>',quoteInfo)
          await this.mutateAction(quoteInfo).then(response => {

           console.log("=======>  After bulkUpdate line mutateAction response:",response)



         })
       })
          this.setState({
          //    refresh: true,
              message:  "Check messages in list table above for update results" ,
          })

     } else {
        try {
           var resp = await this.mutateAction(this.state.quoteInfo); // .then(resp => {
            console.log("=======>  After single mutateAction resp:",resp)
            if (resp) {
              this.setState(
                { message:  resp.message ,
                  refresh: true,
                  quoteInfo: {
                  ...this.state.quoteInfo,
                 },
              formEditInfo: {
                ...this.state.formEditInfo,
                 edit_status: resp.status,
               },
              allowSave: false
              }
            );
          } else {
            console.log("<handleAction> <QuoteForm> null response from mutateAction")
            this.setState(
              { message:  'Internal error during quotation update (null!)' ,
                refresh: false,
                allowSave: false
              })
          }
         }
          catch(err) {
            console.log("<handleAction> <QuoteForm> Error updating quotation error:",err)
            this.setState(
              { message:  err&& err.message? err.message:'Internal error during quotation update' ,
                refresh: false,
                allowSave: false
              })
          }
     }


  }

  async mutateAction (selectedRow)  {
    console.log('<mutateAction> <QuoteForm> selectedRow:', selectedRow)
    var message =  ""
    var sucess = false
    var rtnquoteInfo = selectedRow;
    const { updateQuotation, setRow} = this.props
    if (updateQuotation) {

      console.log("<mutateAction> <QuoteForm>  +>>>selectedRow:",selectedRow)
      var updateInfo ;
      try {
      //  updateInfo = this.state.bulkUpdate?
      //  {
      //    // fiels that come from the list of PO to be changed
      //   po_no: selectedRow.po_no,
      //   delivered:selectedRow.delivered!= null? selectedRow.delivered:null,
      //   delivered_qty:
      //         // can set delivered_qty in bulk only if setting status to delivered
      //         selectedRow.edit_delivered_qty != null && this.state.formEditInfo.edit_status == 'delivered'  ?
      //          selectedRow.edit_delivered_qty:null,
      //
      // }:
      updateInfo = {
        title: this.state.formEditInfo.title,


      }
     }  catch(err) {
        console.log("!!!ERROR setting updateInfo")

          throw new Error("Internal Error. Error setting bulk update")
      }
      console.log('***** updateInfo:',updateInfo)
      console.log("+++ before calling props.mutate ")
      var quoteObj =  this.state.quoteInfo;
      if (this.state.quoteInfo == null || this.state.quoteInfo.quotation == null ||
        this.state.quoteInfo.quotation.item == null ||
        this.state.quoteInfo.quotation.prices == null ) {
          throw new Error("Pricing not  ready. ")
      } else if (!this.state.formEditInfo.userInfo ||  !this.state.formEditInfo.userInfo.userId) {
          throw new Error("UserId not specified!")
      }

      var categoryArray =  [];
        if(
        this.state.formEditInfo.edit_category && this.state.formEditInfo.edit_category.value) {
          categoryArray.push(this.state.formEditInfo.edit_category.value)
        }

        var quotation = quoteObj.quotation
          var prices = quotation.prices;
        delete prices.__typename

        Object.keys(prices).map(priceSelection => {
            delete  prices[priceSelection].__typename

          })
        console.log("prices:",prices)
      const response = await updateQuotation({
         variables: {
           "quoteInput": {
            quote_no: this.state.formEditInfo.quote_no,
            senderId: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null, // should be quotation owner
            sales_person: this.state.quoteInfo.sales_person,
            userInfo: {
                username: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.name:null,
                userId: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null,
                phone_no: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.phone_no:null,
            },
            quotation: {
              quote_no: this.state.formEditInfo.quote_no,
              quote_date: moment().format('x'),
              price_selection:
              this.state.formEditInfo.edit_price_selection? this.state.formEditInfo.edit_price_selection:'amm_exp',
              notes: this.state.formEditInfo.edit_notes,

              active:  quotation.active!=null? quotation.active:false, // active = should load in customer cart when final
              final:  quotation.final!=null?  quotation.final:false, // final = pricing complete
              po_no: null, // cannot change PO
              //sales_person: this.state.formEditInfo.sales_person,
            //  message: null,
              //reason: null,
              ownderId: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null,
              // url:null,
              // title: null,
              // thumbnailImage: null,
              // source: null,
              // price: null,
              // qty: null,
              // shipping: null,
              // category: null,
              // weight: null,
              // height: null,
              // length: null,
              // width: null,
              // username: null,
              // chargeableWeight: null,

              requestor: null,
              item: {
                recipientID: null,
                ownderId: null,
                url: this.state.formEditInfo.edit_url,
                title: this.state.formEditInfo.edit_title,
                MPN: null,
                asin: null,
                thumbnailImage: null,
                source: this.state.formEditInfo.edit_source,
                price: parseFloat(this.state.formEditInfo.edit_price),
                qty: parseInt(this.state.formEditInfo.edit_qty),
                shipping: parseFloat(this.state.formEditInfo.edit_shipping),
                category: categoryArray,
                condition: this.state.formEditInfo.edit_condition,
                availability: null,
                weight: parseFloat(this.state.formEditInfo.edit_weight_lb),
                height: parseFloat(this.state.formEditInfo.edit_height_inch),
                length: parseFloat(this.state.formEditInfo.edit_length_inch),
                width: parseFloat(this.state.formEditInfo.edit_width_inch),
                language: null,
                username: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.name:null,
                chargeableWeight: parseFloat(this.state.formEditInfo.edit_chargeableWeight),
                final: this.state.formEditInfo.edit_final,
                requestor: null,
              //  quote_no: this.state.formEditInfo.quote_no,
                category_info: {
                  _id:   this.state.formEditInfo.edit_category_info._id,
                  category_name: this.state.formEditInfo.edit_category_info.category_name,
                  category_name_ar: this.state.formEditInfo.edit_category_info.category_name_ar,
                  customs: this.state.formEditInfo.edit_category_info.customs,
                  tax_aqaba: this.state.formEditInfo.edit_category_info.tax_aqaba,
                  tax_amm: this.state.formEditInfo.edit_category_info.tax_amm,
                  margin_amm: this.state.formEditInfo.edit_category_info.margin_amm,
                  margin_aqaba: this.state.formEditInfo.edit_category_info.margin_aqaba,
                  special_tax: this.state.formEditInfo.edit_category_info.special_tax,
                  us_tax: this.state.formEditInfo.edit_category_info.us_tax,
                  cap_aqaba: this.state.formEditInfo.edit_category_info.cap_aqaba,
                  cap_amm: this.state.formEditInfo.edit_category_info.cap_amm,
                  min_side_length: this.state.formEditInfo.edit_category_info.min_side_length,
                  keywords: this.state.formEditInfo.edit_category_info.keywords,
                  min_lonng_side: this.state.formEditInfo.edit_category_info.min_lonng_side,

                },

                recipentID: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null,
              },
              prices: {
                ...prices
              },
                // amm_exp: {
                //   destination: this.state.quoteIno.prices,
                //   type: null,
                //   delivery: null,
                //   price: null,
                // },
                // amm_std: {
                //   destination: null,
                //   type: null,
                //   delivery: null,
                //   price: null,
                // },
                // aq_std: {
                //   destination: null,
                //   type: null,
                //   delivery: null,
                //   price: null,

            //  }
            }

          }
        },
        refetchQueries: [
                {
          query: quotationsQuery,
          variables:this.props.variables
        }],
     }).then( res => {
       console.log("OK <QuoteForm> ==> MUTATION result:",res)
       if (!res || !res.data || !res.data.updateQuotation) {
            throw new Error("DB Error")
       }   else     {
         console.log("<QuoteForm> OK=>got response from mutation - set state and message response")
         console.log("<QuoteForm> +++++=>res:",res&&res.data)

         rtnquoteInfo.message = rtnquoteInfo.message==""? rtnquoteInfo.message:rtnquoteInfo.message+'\n'+
                     res.data.updateQuotation.message;
        //  rtnquoteInfo.status=res.data.updateQuotation.status;
          rtnquoteInfo = res.data.updateQuotation;
          console.log("<QuoteForm> OK > Return rtnquoteInfo:",rtnquoteInfo)
        return rtnquoteInfo;
     }

     }).catch((err) => {
       console.log('!!!<QuoteForm> mutation err:',JSON.stringify(err))
       const { graphQLErrors, networkError } = err
       var errMsg = '';
       if (graphQLErrors) {

       graphQLErrors.map(({ message, locations, path }) =>{
         console.log(
           `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
           )  ,
          errMsg = errMsg==""? message:errMsg + ' ' + message
        }

         );
       }

         if (networkError) {
           console.log(`[Network error]: ${networkError}`);
            errMsg = errMsg==""? networkError:errMsg + ' ' + networkError

         }

       if (err && err.errmsg) {
          errMsg = errMsg==""? err.errmsg:errMsg + '\n'+  err.errmsg
       }
       // rtnquoteInfo.message = rtnquoteInfo.message==""? rtnquoteInfo.message:rtnquoteInfo.message+'\n'+
       //          errMsg
       console.log("errMsg:",errMsg)

        throw new Error(errMsg && errMsg !=''? errMsg: "Internal Error. call your administrator!" )
     });
      console.log("<QuoteForm> ?? MUTATION response:",response)
      return response;
   } else {
     console.log("<QuoteForm> ERROR - No mutate funtion!!!")
       throw new Error("Internal Error. <QuoteForm>  - No mutate funtion!" )
   }

  }

  copyToClipboard = (e,val) => {
    console.log(e);
      console.log('val:',val)
    var textField = document.createElement('textarea')
    textField.innerText = val
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    };

  render() {
//     console.log("<><><> TEST Scraper")
//     scraper.init('http://www.amazon.com/gp/product/B00X4WHP5E/', function(data){
//     console.log(data);
// });
    console.log('<render> <QuoteForm> props:',this.props)
    console.log('<render> <QuoteForm> state:',this.state)
    const columnDefaults = { ...ReactTableDefaults.column, headerClassName: 'wordwrap' }
    const { classes,theme, history, selection, getRow, categoriesQuery} = this.props;
    console.log("<render> <QuoteForm> categoriesQuery:",categoriesQuery)

    const {getCategories} = categoriesQuery


    const { created_by, date_created, quotation,quote_no,sales_person, senderId, _id} =  this.state.quoteInfo;
    // const {title,url,quotation, active, category, chargeableWeight, final, height, item, length, message, notes,
    //   ownderId, po_no, price, price_selection, prices, qty, quote_date, reason, requestor, sales_person, shipping,
    //   source, thumbnailImage, username, weight, width, senderId } = quotation;
    const {item, prices, quote_date, qSenderId, ownderId,po_no} = quotation;

    console.log("<render> <QuoteForm> senderId/ownderId:",qSenderId,"/", ownderId)
  //  const category = item? item.category:null;
    //const username = item? item.username:null;
    //const {category,username} = item;
    //console.log('<render> <QuoteForm> username:',username)
    console.log('<render> <QuoteForm> qSenderId:',qSenderId)
    //const { amm_exp, amm_std, aq_std} = prices

    // const rowSelection =  this.props.getRow(_id)
    // console.log("rowSelection:",rowSelection)
     const { edit_title, edit_url, edit_username,edit_ownderId,edit_senderId,
        edit_weight_kg, edit_height_cm, edit_length_cm, edit_width_cm,edit_dimensions_cm,
        edit_weight_lb, edit_height_inch, edit_length_inch, edit_width_inch,edit_dimensions_inch,
           edit_category,
        edit_price,edit_shipping, edit_chargeableWeight,edit_qty, edit_source,edit_condition,edit_send_action, edit_user_message, edit_notes,
      edit_destination, edit_priceType, edit_options,edit_price_selection} = this.state.formEditInfo
  console.log("<render> <QuoteForm> edit_price_selection:",edit_price_selection)
      console.log('<render> <QuoteForm> edit_destination:',edit_destination)
        console.log('<render> <QuoteForm> edit_priceType:',edit_priceType)
      const {message, bulkUpdate,validBulkUpdate,selectedQuoteList} = this.state
     console.log("<render> <QuoteForm>  render  message:",message)
     const selectStyles = {
       input: base => ({
         ...base,
        padding: '1em',
         width:400,
         color: theme.palette.text.primary,
         '& input': {
           font: 'inherit',
         },
       }),
     };

     console.log("<render> <QuoteForm> categoriesQuery.loading:",categoriesQuery.loading)

     const listOfCategories = !categoriesQuery.loading? getCategories && getCategories.map(selection => ({
       label: selection.category_name+"/"+selection.category_name_ar ,
       value: selection.category_name,
     })):
     null;
     console.log('<render> <QuoteForm> listOfCategories:',listOfCategories)
     console.log("<render> <QuoteForm> edit_category:",edit_category)
     var catIdx=-1;
     if (edit_category!=null && getCategories && getCategories.length>0) {
       catIdx =getCategories.findIndex(
      x=>  x.category_name === edit_category.value)
      console.log("<render> <QuoteForm>   catIdx:",catIdx)
      if (catIdx>=0) {
        edit_category.label = catIdx >=0? getCategories[catIdx].category_name + '/' +
          getCategories[catIdx].category_name_ar:''
      }
    }

    const tax_amm = catIdx >=0? getCategories[catIdx].tax_amm*100:  null
    const tax_aqaba =  catIdx >=0? getCategories[catIdx].tax_aqaba*100:null
    const special_tax =  catIdx >=0? getCategories[catIdx].special_tax*100:null
    const customs =  catIdx >=0? getCategories[catIdx].customs*100:null

// console.log("usersQuery.loading:",usersQuery.loading)
//
//     const listOfUsers = !usersQuery.loading? getUsers && getUsers.map(selection => ({
//       label: selection.name+"/"+selection.userId ,
//       value: selection.userId,
//     })):
//     null;
//     console.log('listOfUsers:',listOfUsers)
//     var userIdx=-1;
//     if (getUsers && getUsers.length>0) {
//       userIdx =getUsers.findIndex(
//      x=>  x.userId === edit_username.value)
//    }
//     console.log('edit_username:',edit_username)
//    console.log("<><>   userIdx:",userIdx)
//    if (userIdx>=0) {
//      edit_username.label = userIdx >=0? getUsers[userIdx].name + '/' +
//        getUsers[userIdx].userId:''
//    } else {
//      edit_username.label = username?username+'/':''+ownderId? ownderId:senderId?SenderId:qSenderId?qSenderId:'';
//    }
   console.log('<render> <QuoteForm> edit_username:',edit_username)
   console.log("<render> <QuoteForm> prices:",prices)




    return (
    <div className="popup">
      <div className="popup_inner">

        <div className=" flex flex-wrap  p1 m1 border">
        <form  className="ml2" onSubmit={this.handleAction} autoComplete="off">
          <div className="flex flex-column  ml2">
            <div className="flex flex-row  ml2">
            <TextField
              disabled={bulkUpdate}
              name="quote_no"
              type="String"
              label="Quote#"
              value={quote_no}
              onClick={(e) => {this.copyToClipboard(e, quote_no)}}
              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '12px' ,
                 'fontWeight':'bold',
                'width' : '8em',
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={quotation.active!=null?quotation.active:false}
                  value="quotation.active"
                  color="primary"
                />
              }
              label="Active"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={quotation.final!=null?quotation.final:false}
                  value="quotation.final"
                  color="primary"
                />
              }
              label="Final"
            />
            <TextField
              disabled={bulkUpdate}
              name="po_no"
              type="String"
              label="PO#"
              value={po_no}
              onClick={(e) => {this.copyToClipboard(e, po_no)}}
              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '12px' ,
                 'fontWeight':'bold',
                'width' : '8em',
              }}
            />

            <TextField
              disabled={bulkUpdate}
              name="quote_date"
              type="String"
              label="Date"
                value={quote_date? moment(parseInt(quote_date)).format('DD-MMM-YYYY'):moment(parseInt(date_created)).format('DD-MMM-YYYY')}

              margin="dense"
              className={classes.textField}
              />
            <TextField
              disabled={bulkUpdate}
              name="sales_person"
              type="String"
              label="Sales Person"
              value={sales_person}

              margin="dense"
              className={classes.textField}
              />
            </div>
            <UserSelect
                username={edit_username}
                userSearch={this.state.userSearch}
                onChange={this.handleUserSelection}
                onInputChange={this.handleUserInputChange}
            />
            <div className="flex flex-row border">
            <FormControl  className={classes.formControl}>
            <InputLabel htmlFor="edit_send_action">Send Quote or saved Message</InputLabel>
            <Select
              disabled={false}
              value={edit_send_action}
              onChange={this.handleChange}
              name="edit_send_action"
              inputProps={{
                id: 'edit_send_action',
              }}
              className={classes.selectEmpty}
            >
              <MenuItem value={""}>Not Selected</MenuItem>
              <MenuItem value={"PricingNow"}>Pricing Now</MenuItem>
              <MenuItem value={"Wait"}>Please wait</MenuItem>
              <MenuItem value={"SendQuote"}>Send Text Quote</MenuItem>
              <MenuItem value={"UpdateCart"}>Update Cart</MenuItem>
              <MenuItem value={"Buy"}>Would you like to buy?</MenuItem>
              <MenuItem value={"Thanks"}>Thank You</MenuItem>
              <MenuItem value={"ThumbsUp"}>Thumbs Up!</MenuItem>
            </Select>
            <FormHelperText>Send quote or saved message to User</FormHelperText>
          </FormControl>
          <TextField
            disabled={bulkUpdate}
            name="edit_user_message"
            type="String"
            label="Enter user message"
            value={edit_user_message}
            onChange={this.handleChange}

            margin="dense"
            className={classes.textField}
            style={{
              //backgroundColor:'pink',
              'whiteSpace': 'unset',
               'fontSize': '10px' ,

              'width' : '42em',
            }}
          />
            <Button size="medium"  variant="contained"
              disabled={true}
              color="primary"
              margin="dense" onClick={this.handleSendQuotation}>
              Send
            </Button>
            </div>
            <div className="flex flex-row">

            <TextField
              disabled={bulkUpdate}
              name="edit_url"
              type="String"
              label="URL"
              value={edit_url}
              onChange={this.handleChange}

              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '10px' ,

                'width' : '42em',
              }}
            />
            <div className="flex py2"
              style={{'overflowX': 'hidden',

              'fontSize': '12px' ,
               width:'10em',height:'2em'}}>
            {  <a href = { edit_url } target = "_blank" > {'URL link'  } </a>}
            </div>

            <TextField
              disabled={bulkUpdate}
              name="edit_title"
              type="String"
              label="Title"
              value={edit_title}
              onChange={this.handleChange}

              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '10px' ,
                 'fontWeight':'bold',
                'width' : '42em',
              }}
            />

            </div>
            <div className="flex flex-wrap">
            <TextField
              disabled={bulkUpdate}
              name="edit_options"
              type="String"
              label="Options Color, Size ..."
              value={edit_options}
              onChange={this.handleChange}
              margin="dense"
              variant="outlined"
              style={{
                backgroundColor:'lightgreen',
                'whiteSpace': 'unset',
                 'fontSize': '12px' ,
                 'fontWeight':'bold',
                'width' : '400px',
              }}
              className={classes.textField}
              />
              <FormControl  className={classes.formControl}>
              <InputLabel htmlFor="edit_condition-required">Item Condition</InputLabel>
              <Select
                disabled={false}
                value={edit_condition}
                onChange={this.handleChange}
                name="edit_condition"
                inputProps={{
                  id: 'edit_condition-required',
                }}
                className={classes.selectEmpty}
              >
                <MenuItem value={""}>Not Selected</MenuItem>
                <MenuItem value={"New"}>New</MenuItem>
                <MenuItem value={"New No Box/Tags"}>New No Box/Tags</MenuItem>
                <MenuItem value={"Manufacturer refurbished"}>Manufacturer refurbished</MenuItem>
                <MenuItem value={"Seller refurbished"}>Seller refurbished</MenuItem>
                <MenuItem value={"Used"}>Used</MenuItem>
                <MenuItem value={"For parts or not working"}>For parts or not working</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          <TextField
            disabled={bulkUpdate}
            name="edit_source"
            type="String"
            label="Source"
            value={edit_source}
            onChange={this.handleChange}
            margin="dense"
            style={{
              'whiteSpace': 'unset',
               'fontSize': '12px' ,
              'width' : '200px',
            }}
            className={classes.textField}
            />
            </div>
          </div>


                {categoriesQuery.loading? <Loading />:categoriesQuery!=null?
                <div className="flex flex-wrap">
                <NoSsr>
                  <ReactSelect
                    classes={classes}
                    styles={selectStyles}
                    options={listOfCategories}
                    components={components}
                    required={true}
                    value={edit_category}
                    onChange={(val)=> {this.handleCostingChange({target: { name:'edit_category', value: val }})}}
                    placeholder="Enter Categories"
                    isClearable={false}
                    isSearchable={true}
                  />
                </NoSsr>

                <TextField
                    disabled={bulkUpdate}
                    name="tax_amm"
                    type="number"
                    label="Amm Tax"
                    value={tax_amm !=null ?tax_amm.toFixed(2):''}
                    style={{
                       backgroundColor: 'lightblue',

                      //backgroundColor:'pink',
                       //'whiteSpace': 'unset',
                        fontSize: '12px' ,
                        font: 'bold',
                    }}

                    margin="dense"
                    className={classes.textField}
                    />
                    <TextField
                        disabled={bulkUpdate}
                        name="special_tax"
                        type="number"
                        label="Amm Special Tax"
                        value={special_tax !=null ?special_tax.toFixed(2):''}

                        style={{
                           backgroundColor: 'lightblue',
                            fontSize: '12px' ,
                            font: 'bold',
                        }}
                        margin="dense"
                        className={classes.textField}
                    />
                    <TextField
                        disabled={bulkUpdate}
                        name="customs"
                        type="number"
                        label="Amm Customs"
                        value={customs !=null ?customs.toFixed(2):''}

                        style={{
                           backgroundColor: 'lightblue',
                            fontSize: '12px' ,
                            font: 'bold',
                        }}
                        margin="dense"
                        className={classes.textField}
                        />
                    <TextField
                        disabled={bulkUpdate}
                        name="tax_aqaba"
                        type="Number"
                        label="Aqaba Tax"
                        value={tax_aqaba!=null ? tax_aqaba.toFixed(1):''}
                        margin="dense"
                        style={{

                            backgroundColor: 'lightblue',

                            fontSize: '12px' ,
                            font: 'bold',
                        }}
                        className={classes.textField}
                      />

                </div>
                :null  }
                  <TextField
                      disabled={bulkUpdate}
                      required
                      error={isNaN(edit_price) || parseFloat(edit_price) <= 0}
                      name="edit_price"
                      type="Number"
                      label="Price"
                      value={edit_price && !isNaN(edit_price)? parseFloat(edit_price):0}
                      variant="outlined"
                      onChange={this.handleCostingChange}
                      InputProps={{
                            startAdornment: <InputAdornment position="start">USD</InputAdornment>,

                      }}
                      style={{
                        width: '150px'
                      }}
                      className={classes.textField}
                      />
                      <TextField
                        disabled={bulkUpdate}
                        required
                        error={isNaN(edit_shipping) || parseFloat(edit_shipping) < 0}
                        name="edit_shipping"
                        type="Number"
                        label="Shipping"

                        value={edit_shipping && !isNaN(edit_shipping)? parseFloat(edit_shipping):0}
                        onChange={this.handleCostingChange}
                        margin="dense"
                        variant="outlined"
                        InputProps={{
                              startAdornment: <InputAdornment position="start">USD</InputAdornment>,

                        }}
                        style={{
                          width: '120px'
                        }}
                        className={classes.textField}
                        />
                        <TextField
                          disabled={bulkUpdate}
                          required
                          error={isNaN(edit_qty) || parseFloat(edit_qty) <= 0}
                          name="edit_qty"
                          type="Number"
                          label="Quantity"
                          value={edit_qty}
                          onChange={this.handleCostingChange}
                          margin="dense"
                          variant="outlined"
                          style={{
                            width: '80px'
                          }}
                          className={classes.textField}
                          />

                          <div className="flex flex-wrap">
                          <TextField
                            disabled={bulkUpdate}
                            name="edit_weight_lb"
                            required={false}
                            error={isNaN(edit_weight_lb) || parseFloat(edit_weight_lb) < 0}
                            type="Number"
                            label="Weigh"
                            onChange={this.handleCostingChange}
                            value={edit_weight_lb}
                            variant="outlined"
                          InputProps={{
                              startAdornment: <InputAdornment position="start">Lb</InputAdornment>,
                            }}
                            style={{
                              width: '120px'
                            }}
                            margin="dense"
                            className={classes.textField}
                            />
                            <TextField
                                disabled={bulkUpdate}
                                name="edit_length_inch"
                                type="Number"
                                label="length"
                                value={edit_length_inch}
                                variant="outlined"
                              InputProps={{
                                  startAdornment: <InputAdornment position="start">Inch</InputAdornment>,
                                }}
                                style={{
                                  width: '120px'
                                }}
                                  onChange={this.handleCostingChange}
                                margin="dense"
                                className={classes.textField}
                                />
                              <TextField
                                disabled={bulkUpdate}
                                name="edit_width_inch"
                                type="Number"
                                label="width"
                                value={edit_width_inch}
                                variant="outlined"
                              InputProps={{
                                  startAdornment: <InputAdornment position="start">Inch</InputAdornment>,
                                }}
                                style={{
                                  width: '120px'
                                }}
                                  onChange={this.handleCostingChange}
                                margin="dense"
                                className={classes.textField}
                                />
                                <TextField
                                  disabled={bulkUpdate}
                                  name="edit_height_inch"
                                  type="Number"
                                  label="height"
                                  variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Inch</InputAdornment>,
                                  }}
                                  value={edit_height_inch}
                                  onChange={this.handleCostingChange}
                                  margin="dense"
                                  className={classes.textField}
                                  />
                                  <TextField
                                    disabled={bulkUpdate}
                                    name="edit_dimensions_inch"
                                    onChange={this.handleCostingChange}
                                    type="String"
                                    label="Dimensions"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">L x W x H (inch)</InputAdornment>,
                                      }}
                                      style={{
                                        width: '300px'
                                      }}
                                    value={edit_dimensions_inch}
                                    margin="dense"
                                    className={classes.textField}
                                    />


                                </div>
                                <div className="flex flex-wrap">
                                <TextField
                                  disabled={bulkUpdate}
                                  required={false}
                                  error={isNaN(edit_weight_kg) || parseFloat(edit_weight_kg) < 0}
                                  name="edit_weight_kg"
                                  type="Number"
                                  label="Weigh"
                                  variant="outlined"
                                  InputProps={{
                                      startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                                    }}
                                    style={{
                                      width: '120px'
                                    }}
                                  onChange={this.handleCostingChange}
                                  value={edit_weight_kg}
                                  margin="dense"
                                  className={classes.textField}
                                  />
                                  <TextField
                                      disabled={bulkUpdate}
                                      name="edit_length_cm"
                                      type="Number"
                                      variant="outlined"
                                      label="length"
                                        variant="outlined"
                                      InputProps={{
                                          startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                        }}
                                      value={edit_length_cm}
                                        onChange={this.handleCostingChange}
                                      margin="dense"
                                      className={classes.textField}
                                      />
                                    <TextField
                                      disabled={bulkUpdate}
                                      name="edit_width_cm"
                                      type="Number"
                                      label="width"
                                      value={edit_width_cm}
                                      variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                      }}
                                      style={{
                                        width: '120px'
                                      }}
                                        onChange={this.handleCostingChange}
                                      margin="dense"
                                      className={classes.textField}
                                      />
                                      <TextField
                                        disabled={bulkUpdate}
                                        name="edit_height_cm"
                                        type="Number"
                                        label="height"
                                        value={edit_height_cm}
                                        variant="outlined"
                                        InputProps={{
                                          startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                        }}
                                        style={{
                                          width: '120px'
                                        }}
                                        onChange={this.handleCostingChange}
                                        margin="dense"
                                        className={classes.textField}
                                        />
                                        <TextField
                                          disabled={bulkUpdate}
                                          name="edit_dimensions_cm"
                                          type="String"
                                          label="Dimensions"
                                          variant="outlined"
                                          InputProps={{
                                              startAdornment: <InputAdornment position="start">L x W x H (cm)</InputAdornment>,
                                            }}
                                          style={{
                                            width: '300px'
                                          }}
                                          value={edit_dimensions_cm}
                                          onChange={this.handleCostingChange}
                                          margin="dense"
                                          className={classes.textField}
                                          />
                                          <TextField
                                            disabled={bulkUpdate}
                                            required
                                            error={isNaN(edit_chargeableWeight) || parseFloat(edit_chargeableWeight) <= 0}
                                            name="edit_chargeableWeight"
                                            type="Number"
                                            label="Chargable Weight"
                                            value={edit_chargeableWeight}
                                            variant="outlined"
                                          InputProps={{

                                              startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                                              readOnly: true,

                                            }}
                                            style={{
                                              backgroundColor: 'lightblue',
                                              'fontSize': '12px' ,
                                              'font': 'bold',
                                              width: '200px'
                                            }}
                                              onChange={this.handleChange}
                                            margin="dense"
                                            className={classes.textField}
                                            />
                                      </div>
                                    <FormControl  className={classes.formControl}>
                                    <InputLabel htmlFor="destination-required">Destination</InputLabel>
                                    <Select
                                      disabled={true}
                                      value={edit_destination}
                                      onChange={this.handleChange}
                                      name="edit_destination"
                                      inputProps={{
                                        id: 'destination-required',
                                      }}
                                      className={classes.selectEmpty}
                                    >
                                      <MenuItem value={""}>Not Selected</MenuItem>
                                      <MenuItem value={"amman"}>Amman</MenuItem>
                                      <MenuItem value={"aqaba"}>Aqaba</MenuItem>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                  </FormControl>

                                  <FormControl  className={classes.formControl}>
                                  <InputLabel htmlFor="priceType-required">Price Type</InputLabel>
                                  <Select
                                    disabled={true}
                                    value={edit_priceType}
                                    onChange={this.handleChange}
                                    name="edit_priceType"
                                    inputProps={{
                                      id: 'priceType-required',
                                    }}
                                    className={classes.selectEmpty}
                                  >
                                    <MenuItem value={""}>Not Selected</MenuItem>
                                    <MenuItem value={"reg"}>Regular</MenuItem>
                                    <MenuItem value={"exp"}>Express</MenuItem>
                                  </Select>
                                  <FormHelperText>Required</FormHelperText>
                                </FormControl>

                                { prices != null  && edit_price_selection != null && edit_price_selection != ''?
                                <div className="flex flex-wrap">
                                <FormControl  className={classes.formControl}>
                                <InputLabel htmlFor="price_selection-required">Sale Price Options</InputLabel>
                                <Select
                                  disabled={false}
                                  value={edit_price_selection}
                                  onChange={this.handleChange}
                                  name="edit_price_selection"
                                  inputProps={{
                                    id: 'price_selection-required',
                                  }}
                                  className={classes.selectEmpty}
                                >
                                { Object.keys(prices).map(priceSelection => {
                                  return  prices[priceSelection].price!= null?
                                  <MenuItem key={priceSelection} value={priceSelection}>
                                    {prices[priceSelection].destination + " "+
                                          prices[priceSelection].type + " " +
                                          prices[priceSelection].price + " JD"
                                    }
                                  </MenuItem>
                                    :  ''
                                    }
                                )}
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                              </FormControl>

                              <TextField
                                disabled={bulkUpdate}
                                name="sale_price"
                                type="Number"
                                label="Sale Price"
                                value={prices? prices[edit_price_selection].price:''}

                                margin="dense"
                                className={classes.textField}
                                />
                                </div>
                              :null}
                              {this.state.pricingNow != null && this.state.pricingNow?
                              <Loading />:null }

            <Button
              disabled={po_no!=null? true:this.state.allowSave? (bulkUpdate &&  !validBulkUpdate)? true:false :true}
              size="medium"
              type="submit"
              variant="contained"
              color="primary"
              margin="dense"
              className="col-1 ml2"
            >   Save
            </Button>

          </form>
          </div> {/* end of form div*/}

          <div className="flex flex-wrap col3 ml2">
                  <TextField
                    name="message"
                    error
                    label="message"
                    value={bulkUpdate && !validBulkUpdate? "No updates allowed when selected statuses are not the same":
                      message? message:''}
                    multiline
                    rowsMax="2"
                    variant="outlined"
                    InputProps={{
                     readOnly: true,
                   }}
                    style={{
                      //backgroundColor:'pink',
                       //'whiteSpace': 'unset',
                        'fontSize': '12px' ,
                        'font': 'bold',
                      'width' : 800,
                    }}

                    margin="dense"

            />
            <Button size="medium"  variant="contained"
              color="primary"
              margin="dense" onClick={this.props.closePopup}>
              Close
            </Button>

        </div> {/* close div which includes Fabs, form and message */}
      </div>  {/* popup_inner */}

    </div>  // close div popup



    );
  }
}

QuoteForm.propTypes = {
  onSubmit: PropTypes.func,

};

QuoteForm.defaultProps = {
  onSubmit: () => {},
};
//
// const withUsers = graphql(usersQuery, {
//   name: 'usersQuery',
//   options: ({ userSearch }) => ({
//     variables: {
//       userId: (userSearch && Number(userSearch.userId)),
//       username: (userSearch && userSearch.username),
//       search: (userSearch && userSearch.search),
//       searchField: (userSearch && userSearch.searchField),
//     },
//   //  pollInterval: 1000*60*5
//   }),
// });
const withCategories = graphql(categoriesQuery, {
  name: 'categoriesQuery',
  options: ({ categorySearch }) => ({
    variables: {
      category_name: (categorySearch && Number(categorySearch.category_name)),

      search: (categorySearch && categorySearch.search),
      searchField: (categorySearch && categorySearch.searchField),
    },
  //  pollInterval: 1000*60*5
  }),
});

const updateQuotation = gql`
  mutation updateQuotation($quoteInput: QuoteInput!) {
    updateQuotation (input: $quoteInput) {
      quote_no
      message
    }
  }

`;
const sendQuotation = gql`
  mutation sendQuotation($quoteInput: QuoteInput!) {
    sendQuotation (input: $quoteInput) {
      quote_no
      message
    }
  }
`;


// const QuoteWithMutation =
// graphql( updateQuotation)
// (QuoteForm);

const QuoteWithMutation = compose(
  graphql( updateQuotation,{ name: 'updateQuotation' }),
  graphql( sendQuotation,{ name: 'sendQuotation' })
)(QuoteForm);


//export default withUsers(withCategories(withStyles(styles, { withTheme: true })(QuoteWithMutation)))
export default withCategories(withStyles(styles, { withTheme: true })(QuoteWithMutation))
