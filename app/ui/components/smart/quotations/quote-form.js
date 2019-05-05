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
// import { ActivityIndicator } from 'react-native';
// import { Image } from 'react-native-elements';

import classNames from 'classnames';
import ReactSelect from 'react-select';

import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';

import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';


import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Avatar from '@material-ui/core/Avatar';

import matchSorter from 'match-sorter'
import Fuse from 'fuse.js';
import URL from 'url-parse';
var fuse = null;
const dimRegEx = /^[ |\t]*\d+(\.\d+)?[ |\t]*x[ |\t]*\d+(\.\d+)?[ |\t]*x[ |\t]*\d+(\.\d+)?[ |\t]*$/
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
    minWidth: 200,
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
    allowSendQuote: false,
    quoteReady: false,
    allowScraping: true,
    allowSendMessage: true,
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
      deleted:'',
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
    this.doCalculate = this.doCalculate.bind(this)
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
        var useUrl = quotation.url?quotation.url:            item.url?item.url:''
        var scrape = false;
        if (useUrl != '') {
          var parse = new URL(useUrl);
          console.log("<getDerivedStateFromProps> parse:",parse.host)
          switch(parse && parse.host?parse.host: '') {
            case 'www.ebay.com':

            case 'www.aliexpress.com':
            case 'ar.aliexpress.com':
            case 's.click.aliexpress.com':
            case 'www.amazon.com':
            case 'www.walmart.com':
            scrape = true;
            break;
            default:


          }
        }
      returnState =  {
        ...returnState,
        userSearch: {
          userId:props.quoteInfo.senderId,
        },
        message:props.quoteInfo.quote_no?'Loaded Quote#'+props.quoteInfo.quote_no:'',
        quoteInfo: props.quoteInfo ,
        quoteReady: props.quoteInfo? true:false,
        allowSendQuote: props.quoteInfo? true:false,
        categorySearch: {
          category_name: item.category && item.category.length>0? item.category[0]:'',

        },

        formEditInfo: {
          userInfo: {
            username: quotation.username,
            name: quotation.username,
            userId: props.quoteInfo.senderId,
          },
          quote_no:props.quoteInfo.quote_no,
          edit_senderId:props.quoteInfo.senderId,
          edit_ownderId: props.quoteInfo.senderId,
          edit_notes:props.quoteInfo.notes? props.quoteInfo.notes:'',
          edit_options: props.quoteInfo.options?props.quoteInfo.options:'',
          edit_title: quotation.title? quotation.title:   item.title?item.title:'',
          edit_thumbnailImage: item.thumbnailImage,
          edit_url: useUrl,
          edit_price_selection: quotation.price_selection,
          edit_priceType: quotation.prices && quotation.price_selection?
            quotation.prices[quotation.price_selection].type:'',
          edit_destination: quotation.prices && quotation.price_selection?
            quotation.prices[quotation.price_selection].destination:'',

          edit_username:
            {
              value: props.quoteInfo.senderId,
              label: quotation.username
            },

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
          edit_volumeWeight: item.volumeWeight!=null? item.volumeWeight:'',
          edit_condition: item.condition? item.condition:'',
          edit_canned_message_selection: '',
          edit_send_action_options: '',
          edit_deleted: quotation.deleted!=null? quotation.deleted:false,
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

          edit_ownderId: props.quoteInfo.senderId,
          edit_price: item.price,
          edit_qty: item.qty,

          edit_recipientID: item.recipientID? item.recipientID:'',
          edit_requestor: item.requestor? item.requestor:'',
          edit_shipping: item.shipping!=null && !isNaN(item.shipping)? parseFloat(item.shipping):0,
          edit_source: item.source? item.source: quotation.source? quotation.source:'',
          edit_condition: item.condition? item.condition:'New',
          edit_canned_message_selection: '',
          edit_send_action_options:'',
          edit_thumbnailImage: item.thumbnailImage? item.thumbnailImage:'',
        },
        allowScraping: scrape,

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
      //  allowSave: false,

      });

  }
  // handleChange function
handleCannedMessage = ({target}) => {
    console.log('<handleCannedMessage><QuoteForm>  ',target)
    const { quotation} =  this.state.quoteInfo;

    const {edit_price_selection} = this.state.formEditInfo
    const { value, name } = target;
    var text = "..."
    var options = "message"
    switch (value) {

      case 'pleaseWait':
        options ='message'
        text = "Please wait الرجاء الأنتظار"
        break;
      case 'pricingNow':
        options= 'message'
        text = "Pricing now  يتم التسعير الأن"
        break;
      case 'doesNotShip':
          options= 'message'
          text = (this.state.formEditInfo.edit_title? this.state.formEditInfo.edit_title + "\n" :'')+
            "Seller does not ship to USA or Jordan البائع لا يشحن لامريكا او الأردن"
          break;
      case 'notRelible':
              options= 'message'
              text = (this.state.formEditInfo.edit_title? this.state.formEditInfo.edit_title + "\n" :'')+
                "Seller is not reliable. الباثع غير موثوق"
              break;
      case 'textQuote':
        options= 'quote'
        if (this.state.quoteReady && quotation && quotation.prices) {
          text =
          this.state.formEditInfo.edit_title + "\n" + "Price is "+ quotation.prices[edit_price_selection].price +" JD"+
        ( edit_price_selection == 'aq_std'? '':"\nPrice in Aqaba "+ quotation.prices['aq_std'].price + " JD")
      } else text = 'Pricing not ready or not saved yet!'
        break;

      case 'buy':
        options ='message'
        text = "Would you like to confirm the order? هل ترغب بتثبيت الطلب؟"
        break;
      case 'thanks':
        options ='message'
        text = "Thank you! شكرا "
        break;
      case 'thumbsup':
        options ='message'
        text = "(Y)"
        break;
      case 'phoneAddress':
          options ='message'
          text = "(Y)"
          break;
      case 'notAllowed':
      options ='message'
      text = (this.state.formEditInfo.edit_title? this.state.formEditInfo.edit_title + "\n" :'')+
        "Sorry: This item is not allowed by Customs. غير مسموح به من فبل الجمارك"
      break;
      case 'needsApproval':
      options ='message'
      text = (this.state.formEditInfo.edit_title? this.state.formEditInfo.edit_title + "\n" :'')+
        "Needs approval before ordering. هذا المنتج يحتاج الى موافقة قبل الطلب من الجهة المختصة"
      break;
      case 'sendLink':
      options ='message'
      text = "ارسل الرابط للمنتح please send link to the item"
      break;
      default:
    }
    this.setState(
          {
          allowSendMessage: true,
          formEditInfo: {
            ...this.state.formEditInfo,
            [name]: value,
            edit_canned_message: text,
            edit_send_action_options: options
        },


      });
    }

  //  handleChange = name => value => {
  handleChange = ({ target }) => {

    console.log('in quoteForm handlesChange ',target)
    const { value, name } = target;

    console.log('<handleChange> <quoteForm> ')
    console.log("name:",name,"  value:",value)
    var scrape = this.state.allowScraping!= null? this.state.allowScraping:false;
    if (name == 'edit_url') {
      var parse = new URL(value);
      console.log("<handleChange> parse:",parse.host)
      switch(parse && parse.host?parse.host: '') {
        case 'www.ebay.com':

        case 'www.aliexpress.com':
        case 's.click.aliexpress.com':
        case 'ar.aliexpress.com':
        case 'www.amazon.com':
        case 'www.walmart.com':
        scrape = true;
        break;
        default:
          scrape = false;

      }
    }
    this.setState(
          {

          formEditInfo: {
          ...this.state.formEditInfo,
            [name]: value
         },
      //  allowSave: true
      // change made
        quoteReady: false,
        allowSendQuote: false,
        allowSendMessage:true,
        allowScraping: scrape,
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
        //  allowSave: true,
        // change made
          allowSendMessage:true,
          allowSendQuote:false,
          quoteReady: false,

        });

    }

  doCalculate = async () => {
    var quoteObj = null ;
    try {
        console.log("<doCalculate> <QuoteForm> >>>> Call doCalculate:")
       quoteObj = await doCalculate(this.state.formEditInfo) //.then( quoteObj=> {
        console.log("<doCalculate> <QuoteForm> >>>> After doCalculate then.quoteObj:",quoteObj)
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

        //allowSave: quoteObj!=null,
        // price calculated but not saved yet
        allowSendMessage:true,
        allowSendQuote:false,
        quoteReady: false,
      })
    } catch(err)  {
        console.log("<doCalculate> <QuoteForm> then.catch Error thrown by doCalculate:",err)
        var quotation =this.state.quoteInfo? this.state.quoteInfo.quotation:null;
        quotation = {
          ...quotation,
          active: true, // active = should load in customer cart when final
          final: false, // final = is pricing correct and complete?

        //  valid: false,
          prices: null,
          price_selection:null,
        }
        console.log("<doCalculate> <QuoteForm> quotation:",quotation)
       this.setState(
        {
          message:err && err.message? err.message:
                  err? err:'Error calculating price. Check input fields',

          allowSave: false,
          allowSendQuote: false,
          quoteReady: false,

         // invalidate pricing
         quoteInfo: {
           ...this.state.quoteInfo,
           quotation:quotation,
         }
       })
     }
  }

  handleCostingChange = async ({ target }) => {
    console.log('in <handleCostingChange> <QuoteForm> target:',target)
      console.log('<handleCostingChange> props:',this.props)

    if (!target) return;
    const { value, name } = target;
    console.log("<handleCostingChange> <QuoteForm> name:",name,"  value:{",value,"}")


    var newState = {
      formEditInfo: {
        ...this.state.formEditInfo,
        [name]: value
      },
      quoteInfo: {
        ...this.state.quoteInfo,
      }

    }


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
      console.log("newState.formEditInfo.edit_shipping:",newState.formEditInfo.edit_shipping)
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
        case 'edit_dimensions_cm':
        case 'edit_dimensions_inch':
        console.log("*UPDATE edit_chargeableWeight")
        newState.formEditInfo.edit_volumeWeight = parseFloat(((newState.formEditInfo.edit_width_cm *
          newState.formEditInfo.edit_length_cm *
          newState.formEditInfo.edit_height_cm) / 5000).toFixed(2));

        newState.formEditInfo.edit_chargeableWeight =
            Math.max(newState.formEditInfo.edit_volumeWeight,parseFloat(newState.formEditInfo.edit_weight_kg))
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
   this.doCalculate();

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
         [name]: event.target.checked
       },
       allowSave:true,
       quoteChanged: true,
     });
    };

    setStateAsync(state) {
        return new Promise((resolve) => {
          this.setState(state, resolve)
        });
    }

    // handleSendQuotation = async (evt) => {
    //   console.log('<handleSendQuotation> <QuoteForm> :',evt)
    //    console.log('<handleSendQuotation> <QuoteForm> state:',this.state)
    //    const userId = this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null;
    //    if(!userId) {
    //      this.setState({
    //        message:"Invalid user ID"
    //      })
    //      return;
    //    }
    //   var quoteMsgPayload = {action: '*quote', quote_no: this.state.formEditInfo.quote_no,
    //     userId:this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null
    //
    //   }
    //   console.log("'<handleSendQuotation> <QuoteForm> quoteMsgPayload:",quoteMsgPayload)
    //  //  axios.post('https://protected-thicket-49120.herokuapp.com/webhook', { quoteMsgPayload })
    //  // .then(res => {
    //  //   console.log("<handleSendQuotation> <QuoteForm> res:",res);
    //  //   console.log("<handleSendQuotation> <QuoteForm> res.data:" ,res.data);
    //  // })
    //  this.setState({
    //    message:"Sent quotation to user",
    //    allowSendQuote: false,
    //  })
    // }

    handleSendQuotation = async (evt) => {
        console.log('<handleSendQuotation> <QuoteForm> :',evt)
        console.log('<handleSendQuotation> => <QuoteForm>  props==>\n',this.props)
        console.log('<handleSendQuotation> => <QuoteForm>   state\n',this.state)
        await this.setStateAsync({
            message:"Sending Quotation to user cart ...",
            allowSendQuote:false,
        })
      this.sendFbAction('sendQuotation')

    }

    handleScrapeAction = async (evt) => {
        console.log('<handleScrapeAction> <QuoteForm> :',evt)
        console.log('<handleScrapeAction> => <QuoteForm>  props==>\n',this.props)
        console.log('<handleScrapeAction> => <QuoteForm>   state\n',this.state)
        if (!this.state.formEditInfo.edit_url || this.state.formEditInfo.edit_url=='') {
          await this.setStateAsync({
              message:"Enter product URL",
              allowScraping: true,

          })
          return;
        }
        await this.setStateAsync({
            message:"Getting product information",
            allowScraping: false,

        })
        const { productScraper,categoriesQuery} = this.props
        const {getCategories} = categoriesQuery

        console.log("<handleScrapeAction> <QuoteForm> categoriesQuery:",categoriesQuery)


        if (productScraper) {
            try {
              console.log("<handleScrapeAction> <QuoteForm> call productScraper")
              const response = await productScraper({
               variables: {
                 "url":this.state.formEditInfo.edit_url,
              }
            })
            if (response && response.data && response.data.productScraper) {
              var prod = response.data.productScraper
              console.log("<handleScrapeAction> <QuoteForm> Got valid prod:",prod)
              var newState = {
                formEditInfo: {
                  ...this.state.formEditInfo,

                },
              }
              var value  = prod.dimensions?prod.dimensions:'0 x 0 x 0';


              newState.formEditInfo.edit_weight_lb = prod.weight!=null &&!isNaN(prod.weight)? prod.weight:-1;
              newState.formEditInfo.edit_weight_kg = prod.weight!= null && !isNaN(prod.weight)?
              (parseFloat(prod.weight)/2.2).toFixed(2):-1;

              var dim = [];
              if ( new RegExp(dimRegEx).test(value)) {

                 dim = value.split('x');
                  console.log('<QuoteForm> <after scraper> dims:',dim)

                if (dim && dim.length>=3) {
                  newState.formEditInfo.edit_dimensions_inch = value;
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

                  newState.formEditInfo.edit_volumeWeight =
                        parseFloat(((newState.formEditInfo.edit_width_cm *
                            newState.formEditInfo.edit_length_cm *
                            newState.formEditInfo.edit_height_cm) / 5000).toFixed(2));
                  newState.formEditInfo.edit_chargeableWeight =
                    Math.max(newState.formEditInfo.edit_volumeWeight,
                      parseFloat(newState.formEditInfo.edit_weight_kg))
                }
              }
              // find category
              var useCategory = {
                label: 'Accessories (General)',
                value:'Accessories (General)'
              } ;
              const fuseOptions = {

                shouldSort: true,
                  tokenize: true,
                  matchAllTokens: true,
                  includeScore: true,
                  threshold: 0.1,
                  location: 0,
                  distance: 100,
                  maxPatternLength: 100,
                  minMatchCharLength: 5,
                  tokenSeparator: /[\|\,|\/|;|\&|]/,
                    keys: [{
                      name: 'category_name',
                      weight: 0.2
                    }, {
                      name: 'keywords',
                      weight: 0.8
                    }],
              }
              if ((prod.category || prod.title) && !categoriesQuery.loading ) {

                if (!fuse) {
                  console.log("<handleScrapeAction> configure fuse")
                  fuse = new Fuse(getCategories,fuseOptions)
                }
              //  organic  (H: 0.03, V: .9) cotton (C: 0.02, H: 0.4)
                console.log("<handleScrapeAction> All Categories:",JSON.stringify(getCategories))
                console.log("<handleScrapeAction>fuse.search  look for category:",prod.category)
              //  var catList = matchSorter(getCategories, prod.category, { keys: ["category_name","keywords"] });
              // split the category and title into individual keywords
              var searchStr = (prod.category?prod.category:'')+" "+(prod.title?prod.title:'')
              searchStr = searchStr.replace(/\/|\&|\.|\[|\]|,/gi,' ')
              console.log("searchStr:",searchStr)
             var searchPattern = searchStr.split(' ')
             var matchCat = {}; // keep match cats keys and score
             var cats; // result from fuse
             // search for the whole cat then whole title and by token
             if (prod.title && prod.title != '') searchPattern.push(prod.title);
             if (prod.catgory && prod.catgory != '') searchPattern.push(prod.category)

             var bestMatch = {
               item: {
                 category_name: 'Accessories (General)',
                 category_name_ar:'Accessories (General)'

               },
               score: 1
             } ;

             searchPattern.map(sp => {
               if (sp.length<3) { console.log("skip search patters:", sp) ; return;}
               cats = fuse.search(sp);
               console.log("<handleScrapeAction>  Search results for ",sp , " =>:" , cats)

               cats.map(cat => {
                 console.log("<handleScrapeAction>  matched category:",cat.item ,' with score:',cat.score)
                  matchCat[cat.item.category_name] = matchCat[cat.item.category_name]? matchCat[cat.item.category_name] * cat.score: cat.score
                   console.log('<handleScrapeAction>  new matchCat:', JSON.stringify(matchCat))
                  if (matchCat[cat.item.category_name] < bestMatch.score) {
                    bestMatch.item = cat.item;
                    bestMatch.score = matchCat[cat.item.category_name]
                    console.log("<handleScrapeAction> best matched catgory so far:",bestMatch)
                  }


              })
             })
                // var catList  = fuse.search(prod.category?prod.category:prod.title)
                // console.log("<handleScrapeAction> from fuse.search catList:",JSON.stringify(catList))
                // determine best match
                  console.log("<handleScrapeAction> final bestMatch Cat:",bestMatch)
                if (bestMatch) {

                  useCategory.value = bestMatch.item.category_name;
                  useCategory.label = bestMatch.item.category_name + "/" + bestMatch.item.category_name_ar;
                  console.log("<handleScrapeAction> useCategory:",useCategory)

                  newState.formEditInfo.edit_category_info=  bestMatch.item;

                }
              }

              console.log("<handleScrapeAction> final useCategory:",useCategory)
              await this.setStateAsync({
                  message:"Got product information",
                  allowScraping: false,
                  formEditInfo: {
                    ...newState.formEditInfo,
                    edit_source: prod.domain? prod.domain:'',
                    edit_title: prod.title?prod.title:'',
                    edit_price: prod.price!= null && prod.price > 0 ?prod.price:-1,
                    edit_shipping: prod.shipping!=null ? prod.shipping:-1,
                    edit_thumbnailImage: prod.thumbnailImage?prod.thumbnailImage:'',          //  edit_dimensions_inch: prod.dimensions?prod.dimensions:'0 x 0 x 0',
                    edit_category:useCategory,
                    edit_condition: prod.condition? prod.condition:'',
                    edit_options: prod.options? prod.options:'',

                  }
              })
              this.doCalculate();
            } else {
              console.log("<handleScrapeAction> <QuoteForm> Got null response:")
              await this.setStateAsync({
                  message:"Could not get product info",
                  allowScraping: true,
              })
            }
          } catch(err) {
            console.log("<handleSendQuotation> <QuoteForm> Error from scrapeProduct err:",err)
            await this.setStateAsync({
                message:"Could not get product info. "+err
            })
          }
        }
    }


    handleSendMessage = async (evt) => {
        console.log('<handleSendMessage> <QuoteForm> :',evt)
        console.log('<handleSendMessage> => <QuoteForm>  props==>\n',this.props)
        console.log('<handleSendMessage> => <QuoteForm>   state\n',this.state)
        await this.setStateAsync({
            message:"Sending Message ...",
            allowSendMessage: false,

        })
        this.sendFbAction('sendMessage')
    }

    sendFbAction = async (action) => {
      console.log('<sendFbAction> => <QuoteForm>  Action==>\n',action)
      console.log('<sendFbAction> => <QuoteForm>  props==>\n',this.props)
      console.log('<sendFbAction> => <QuoteForm>   state\n',this.state)
      const { sendFBQuoteAction} = this.props
      if (sendFBQuoteAction) {
          try {
            console.log("<handleSendQuotation> <QuoteForm> call sendFBQuoteAction")
            const response = await sendFBQuoteAction({
             variables: {
               "sendAction":action,
               "actionInput": {
                quote_no: this.state.formEditInfo.quote_no,
                options: this.state.formEditInfo.edit_send_action_options,
                senderId: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null, // should be quotation owner
                text: this.state.formEditInfo.edit_canned_message,

              }
            }
          })
          if (response) {
            console.log("<handleSendQuotation> <QuoteForm> Got valid response:",response)
            await this.setStateAsync({
                message:"Message sent to user",
                formEditInfo: {
                  ...this.state.formEditInfo,
                  edit_canned_message:'',
                }
            })
          } else {
            console.log("<handleSendQuotation> <QuoteForm> Got null response:")
            await this.setStateAsync({
                message:"Could not send message to user",
                allowSendQuote:true,
            })
          }
        } catch(err) {
          console.log("<handleSendQuotation> <QuoteForm> Error from sendFBQuoteAction err:",err)
          await this.setStateAsync({
              message:"Could not send message. "+err,
              allowSendQuote:true,
          })
        }
      }
    }

   handleAction = async (evt) => {
    evt.preventDefault();
    console.log('<handleAction> <QuoteForm> :',evt)
    console.log('<handleAction> => <QuoteForm>  props==>\n',this.props)
    console.log('<handleAction> => <QuoteForm>   state\n',this.state)
    const { closePopup } = this.props;
    await this.setStateAsync({
        allowSendMessage: true,
        allowSendQuote: false,
        quoteReady: false,
        message:"Saving quotation ...",
       allowSave: false,

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
             // after saving quotation
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
              allowSave: false,
              quoteChanged: false,
              allowSendMessage: true,
              allowSendQuote: true,
              quoteReady: true,
              }
            );
          } else {
            console.log("<handleAction> <QuoteForm> null response from mutateAction")
            this.setState(
              { message:  'Internal error during quotation update (null!)' ,
                refresh: false,
                allowSave: false,
                allowSendMessage: true,
                allowSendQuote: false,
                quoteReady: false,
              })
          }
         }
          catch(err) {
            console.log("<handleAction> <QuoteForm> Error updating quotation error:",err)
            this.setState(
              { message:  err&& err.message? err.message:'Internal error during quotation update' ,
                refresh: false,
                allowSave: false,
                allowSendMessage: true,
                allowSendQuote: false,
                quoteReady: false,
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
      if ((quoteObj == null || quoteObj.quotation == null ||
        quoteObj.quotation.item == null ||
        quoteObj.quotation.prices == null ) &&
        (this.state.quoteChanged!=null && !this.state.quoteChanged)) {
          throw new Error("Pricing not  ready or no changes made. ")
      } else if (!this.state.formEditInfo.userInfo ||  !this.state.formEditInfo.userInfo.userId) {
          throw new Error("UserId not specified!")
      }

      var categoryArray =  [];
        if(
        this.state.formEditInfo.edit_category && this.state.formEditInfo.edit_category.value) {
          categoryArray.push(this.state.formEditInfo.edit_category.value)
        }


        var quotation = quoteObj? quoteObj.quotation:null
        var prices = quotation? quotation.prices:null;
        if (prices) {
          delete prices.__typename

        Object.keys(prices).map(priceSelection => {
            delete  prices[priceSelection].__typename

          })
        }
        console.log("prices:",prices)
        quoteObj.last_updated = quoteObj.last_updated? quoteObj.last_updated:moment().format('x');
      const response = await updateQuotation({
         variables: {

           "quoteInput": {
            quote_no: this.state.formEditInfo.quote_no,
            last_updated: quoteObj.last_updated,
            senderId: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null, // should be quotation owner
            sales_person: quoteObj.sales_person,
            userInfo: {
                username: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.name:null,
                userId: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.userId:null,
                phone_no: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.phone_no:null,
            },
            quotation: {
              username: this.state.formEditInfo.userInfo? this.state.formEditInfo.userInfo.name:null,
              quote_no: this.state.formEditInfo.quote_no,
              quote_date: moment().format('x'),
              price_selection:
              this.state.formEditInfo.edit_price_selection? this.state.formEditInfo.edit_price_selection:'amm_exp',
              notes: this.state.formEditInfo.edit_notes,

              active:  quotation.active!=null? quotation.active:false, // active = should load in customer cart when final
              final:  quotation.final!=null?  quotation.final:false, // final = pricing complete
              deleted:this.state.formEditInfo.edit_deleted!=null?this.state.formEditInfo.edit_deleted:false,
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
                thumbnailImage: this.state.formEditInfo.edit_thumbnailImage,
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
                volumeWeight: parseFloat(this.state.formEditInfo.edit_volumeWeight),
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
              prices:prices? {
                ...prices
              }:null,

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


    const { created_by, date_created,last_updated, quotation,quote_no,sales_person, senderId, _id} =  this.state.quoteInfo;
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
     const { edit_deleted,edit_thumbnailImage,edit_title, edit_url, edit_username,edit_ownderId,edit_senderId,
        edit_weight_kg, edit_height_cm, edit_length_cm, edit_width_cm,edit_dimensions_cm,
        edit_weight_lb, edit_height_inch, edit_length_inch, edit_width_inch,edit_dimensions_inch,
           edit_category,
        edit_price,edit_shipping, edit_chargeableWeight,edit_volumeWeight,edit_qty, edit_source,edit_condition,edit_canned_message_selection,
         edit_canned_message, edit_notes,
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
        <form  className="mx-auto" onSubmit={this.handleAction} autoComplete="off">
          <div className="flex flex-column  mx-auto ">
            <div className="flex flex-row  mx-auto">
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
                  color="secondary"
                />
              }
              label="Active"
            />


            <FormControlLabel
              control={
                <Checkbox
                  checked={quotation.final!=null?quotation.final:false}
                  value="quotation.final"
                  color="secondary"
                />
              }
              label="Final"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={edit_deleted!=null?edit_deleted:false}
                  value="edit_deleted"
                  onChange={this.handleCheckbox('edit_deleted')}
                  color="primary"
                />
              }
              label="Deleted"
            />
            <TextField
              disabled={bulkUpdate}
              name="po_no"
              type="String"
              label="PO#"
              value={po_no!=null? po_no:''}
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
              <Button
                size="small"
                variant="contained"
                onClick={this.props.closePopup}>
                Close
              </Button>
            </div>


            <div className="flex flex-row mx-auto border">

            <TextField
              disabled={bulkUpdate}
              multiline
              rowsMax="4"
              name="edit_url"
              type="String"
              label="URL"
              value={edit_url}
              onChange={this.handleChange}
              margin="normal"
              className={classes.textField}
              style={{
                 'width' : '28em',
              }}
            />
            <div className="flex py2">
            {  <a href = {edit_url} target = "_blank" >

              <Avatar alt="Open Link" src={edit_thumbnailImage}
                style={{margin: 1, width: 100, height: 100,  borderRadius: 0  }} />
                  </a>}
            </div>

            {/*   <img border="0" alt="Image" src={edit_thumbnailImage} margin="10" width="200" height="200"
              onerror="" /> */}
           {/* <Avatar alt="Link" src={edit_thumbnailImage}
             style={{margin: 10, width: 200, height: 200 }} />
             > */}

            <TextField
              disabled={bulkUpdate}
              multiline
              rowsMax="4"
              name="edit_title"
              type="String"
              label="Title"
              value={edit_title}
              onChange={this.handleChange}
              margin="normal"
              className={classes.textField}
              style={{
                 'width' : '28em',
              }}
            />
            <div className="flex flex-column">
            { message == "Getting product information"? <Loading /> : null}
            <Button size="small"  variant="contained"
              disabled={!this.state.allowScraping}
              color="secondary"
              onClick={this.handleScrapeAction}>
              Import
            </Button>

            </div>
            </div>
            <div className="flex flex-wrap mx-auto">
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
                value={edit_condition?edit_condition:''}
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
                <div className="flex flex-wrap justify-center">
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
                       startAdornment: <InputAdornment position="end">%</InputAdornment>,
                       readOnly: true,
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
                            startAdornment: <InputAdornment position="end">%</InputAdornment>,
                            readOnly: true,
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
                            startAdornment: <InputAdornment position="end">%</InputAdornment>,
                            readOnly: true,
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
                            startAdornment: <InputAdornment position="end">%</InputAdornment>,
                            readOnly: true,
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
                        error={ parseFloat(edit_shipping) < 0}
                        helperText={edit_shipping ==='' || parseFloat(edit_shipping) < 0 && "Required - must be > 0"}
                        name="edit_shipping"
                        type="Number"
                        label="Shipping"
                        value={edit_shipping}
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

                          <div className="flex flex-wrap mx-auto">
                          <TextField
                            disabled={bulkUpdate}
                            name="edit_weight_lb"
                            required={false}
                            error={isNaN(edit_weight_lb) || parseFloat(edit_weight_lb) < 0}
                            type="Number"
                            label="Actual Weight"
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
                                        width: '280px'
                                      }}
                                    value={edit_dimensions_inch}
                                    margin="dense"
                                    className={classes.textField}
                                    />


                                </div>
                                <div className="flex flex-wrap mx-auto">
                                <TextField
                                  disabled={bulkUpdate}
                                  required={false}
                                  error={isNaN(edit_weight_kg) || parseFloat(edit_weight_kg) < 0}
                                  name="edit_weight_kg"
                                  type="Number"
                                  label="Actual Weight"
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
                                            width: '280px'
                                          }}
                                          value={edit_dimensions_cm}
                                          onChange={this.handleCostingChange}
                                          margin="dense"
                                          className={classes.textField}
                                          />

                                          <TextField
                                            disabled={bulkUpdate}
                                            required
                                            name="edit_volumeWeight"
                                            type="Number"
                                            label="Volume Weight"
                                            value={edit_volumeWeight}
                                            variant="outlined"
                                          InputProps={{

                                              startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                                              readOnly: true,
                                            }}
                                            style={{
                                              backgroundColor: 'lightblue',
                                              'fontSize': '12px' ,
                                              'font': 'bold',
                                              width: '140px'
                                            }}
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
                                              width: '140px'
                                            }}
                                            margin="dense"
                                            className={classes.textField}
                                            />
                                      </div>
                                {/*    <FormControl  className={classes.formControl}>
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
*/}
                                { prices != null  && edit_price_selection != null && edit_price_selection != ''?
                                <div className="flex flex-wrap mx-auto">
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

                              <div className="flex flex-row mx-auto justify-around align-middle ">
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
                                            'width' : '80%',
                                        }}
                                        margin="dense"
                                />
                                <Button
                                  disabled={po_no!=null? true:
                                    this.state.allowSave ||
                                    (edit_price_selection &&
                                      prices && prices[edit_price_selection] && prices[edit_price_selection].price) ? false:true}
                                  size="small"
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                >   Save
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={this.props.closePopup}>
                                  Close
                                </Button>

                            </div> {/* close div which includes Fabs, form and message */}

          <div className="flex flex-row m-auto justify-around align-middle">
          <FormControl  className={classes.formControl}>
          <InputLabel htmlFor="edit_canned_message_selection">Send to FB</InputLabel>
          <Select
            disabled={false}
            value={edit_canned_message_selection?edit_canned_message_selection:''}
            onChange={this.handleCannedMessage}
            name="edit_canned_message_selection"
            inputProps={{
              id: 'edit_canned_message_selection',
            }}
            className={classes.selectEmpty}
          >
            <MenuItem value={""}>Not Selected</MenuItem>
            <MenuItem value={"pricingNow"}>Pricing Now</MenuItem>
            <MenuItem value={"pleaseWait"}>Please Wait</MenuItem>
            <MenuItem value={"textQuote"}>Send Text Quote</MenuItem>
            <MenuItem value={"buy"}>Would you like to buy?</MenuItem>
            <MenuItem value={"thanks"}>Thank You</MenuItem>
            <MenuItem value={"phoneAddress"}>Send Hours, Phone and Address</MenuItem>
            <MenuItem value={"thumbsup"}>Thumbs Up!</MenuItem>
            <MenuItem value={"doesNotShip"}>Does not Ship to USA/JO</MenuItem>
              <MenuItem value={"notRelible"}>Seller not reliable</MenuItem>
            <MenuItem value={"sendLink"}>Send Link</MenuItem>
            <MenuItem value={"notAllowed"}>Not Allowed</MenuItem>
              <MenuItem value={"needsApproval"}>Needs Approval</MenuItem>

          </Select>

        </FormControl>
        <TextField
          disabled={bulkUpdate}
          name="edit_canned_message"
          multiline
          type="String"
          label={!edit_canned_message && "Enter user message"}
          value={edit_canned_message}
          onChange={this.handleChange}
          rowsMax="3"
          margin="dense"
          className={classes.textField}
          style={{
            //backgroundColor:'pink',
            'whiteSpace': 'unset',
             'fontSize': '10px' ,
             'width' : '50%',
             'padding': '1'
          }}
        />

          <Button
            size="small"
            variant="contained"
            disabled={!this.state.allowSendMessage}
            color="secondary"
            onClick={this.handleSendMessage}>
            Send Message
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={!this.state.allowSendQuote}
            color="primary"
            onClick={this.handleSendQuotation}>
            Send Quote
          </Button>

          </div>
          </form>
          <UserSelect
              username={edit_username}
              userSearch={this.state.userSearch}
              onChange={this.handleUserSelection}
              onInputChange={this.handleUserInputChange}
          />

          </div> {/* end of form div*/}


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
const sendFBQuoteAction = gql`
  mutation sendFBQuoteAction($sendAction: String!, $actionInput: FBQuoteAction!) {
    sendFBQuoteAction (action: $sendAction, input: $actionInput) {
      status
      message
    }
  }
`;

const productScraper = gql `
mutation productScraper($url: String!) {
  productScraper (url: $url) {
    title
    price
    shipping
    weight
    length
    width
    height
    category
    thumbnailImage
    domain
    dimensions
    options
    condition
    message
  }
}
`;

// const QuoteWithMutation =
// graphql( updateQuotation)
// (QuoteForm);

const QuoteWithMutation = compose(
  graphql( updateQuotation,{ name: 'updateQuotation' }),
  graphql( sendFBQuoteAction,{ name: 'sendFBQuoteAction' }),
    graphql( productScraper,{ name: 'productScraper' })
)(QuoteForm);


//export default withUsers(withCategories(withStyles(styles, { withTheme: true })(QuoteWithMutation)))
export default withCategories(withStyles(styles, { withTheme: true })(QuoteWithMutation))
