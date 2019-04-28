/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactSelect from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

import { emphasize } from '@material-ui/core/styles/colorManipulator';
import {  graphql } from 'react-apollo';
import gql from 'graphql-tag';
import usersQuery from '/app/ui/apollo-client/user/query/users.js';
import Loading from '/app/ui/components/dumb/loading';
import ChatView from './ChatView';
import Button from '@material-ui/core/Button';
const styles = theme => ({
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
        fontWeight: props.isSelected ? 500 : 400,
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
  console.log('SelectValue:',props)
  return (
    <Typography className={props.selectProps.classes.selectValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
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

class UserSelect extends React.Component {

  constructor(props) {
    console.log("UserSelect constructor props:",props)
  super(props);
  this.  state = {
     listOfUsers:null,
      username: { label:'',value:''},
      userInput:'',
      userInfo:{},
      chatMessagesSearch: null
    };


    // TODO: add errors field

    this.handleUserSelection = this.handleUserSelection.bind(this)
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

  static  getDerivedStateFromProps(props, state) {
    console.log("<><> <getDerivedStateFromProps> <UserSelect> \nprops",props, "\nstate",state)
    var returnState = {}
    //var username

    const {usersQuery } = props
    const {getUsers} = usersQuery
    console.log('<getDerivedStateFromProps> <UserSelect> usersQuery.loading:',usersQuery.loading)
    console.log('getusers:',getUsers)
    var userIdx = -1;
    var userInfo = null;
    if (getUsers && getUsers.length>0 && props.username) {
      userIdx =getUsers.findIndex(
          x=>  x.userId == props.username.value
      )
     console.log("<getDerivedStateFromProps> <UserSelect> userIdx:",userIdx)
     if (userIdx>=0) {
       console.log('<getDerivedStateFromProps> <UserSelect> User:',getUsers[userIdx])
       userInfo = getUsers[userIdx]
     }
    }



    if ( (state.username && props.username) &&  state.username.value != props.username.value   ) {
      console.log("<UserSelect><getDerivedStateFromProps> username changed")
      console.log("userInfo:",userInfo)
      returnState = {
        ...returnState,
        username: props.username,
        userInfo:userInfo,
        chatMessagesSearch: { search: userInfo? userInfo.userId:props.username.value, searchField:"userId"}
      }

    } else if (userInfo && state.userInfo && state.userInfo._id != userInfo._id ) {
      console.log("<UserSelect><getDerivedStateFromProps> userInfo changed:",userInfo)


      returnState = {
        ...returnState,
        userInfo: userInfo,
        chatMessagesSearch: { search: userInfo? userInfo.userId:props.username.value, searchField:"userId"}
      }
      console.log('<getDerivedStateFromProps> <UserSelect> username:', props.username);
      console.log('<getDerivedStateFromProps> <UserSelect>  call parent onChange: userInfo:',
         userIdx>=0 ? getUsers[userIdx]:'not set!')
      if (props.onChange) {
        props.onChange(props.username, userIdx>=0 ? getUsers[userIdx]:null)
      }

    }

    console.log("returnState:",returnState)
    return returnState == {}? null: returnState;

  }
  // handleUserSelection = (username) => {
  //   console.log("UserSelect handleUserSelection name:value",username)
  //     this.props.onChange(username.label, username.value);
  // };
  handleUserSelection = (username) => {
    console.log("*in <handleUserSelection> <UserSelect>  username",username)
    var newState = { username } // name and userId as label and value
    console.log("<handleUserSelection> <UserSelect>  props:",this.props)
    // find selection in users list and set phone# and other user Information
    const {  usersQuery } = this.props;
    const { getUsers } = usersQuery
    var userIdx = -1;
    if (getUsers && getUsers.length>0) {
      userIdx =getUsers.findIndex(
     x=>  x.userId == username.value)
     console.log("<handleUserSelection> userIdx:",userIdx)
     if (userIdx>=0) {
       console.log('<handleUserSelection> User:',getUsers[userIdx])
       newState = {
           ...newState,
           userInfo: getUsers[userIdx],
           //chatMessagesSearch: { username: getUsers[userIdx].name}
           chatMessagesSearch: { search: getUsers[userIdx].userId, searchField:"userId"}
      }
     }
    }


   this.setState(newState);

   console.log("<handleUserSelection> <UserSelect> state:",this.state)

   console.log('<handleUserSelection> <UserSelect> Option selected:', username);
   console.log('<handleUserSelection> <UserSelect>  call parent onChange: userInfo:',
      userIdx>=0 ? getUsers[userIdx]:'not set!')
   if (this.props.onChange) {
     this.props.onChange(username, userIdx>=0 ? getUsers[userIdx]:null)
   }
 }

 handleInputChange = (userInput) => {
   console.log("========**** UserSelect handleInputChange userInput",userInput)
   var newState = { userInput: userInput   }
  this.setState(newState);
  console.log(`handleInputChange new State::`, this.state);

  console.log("handleInputChange props:",this.props)
  const {onInputChange} = this.props
  if (onInputChange && userInput!= null && userInput!='' && userInput.length>=3) {
    console.log("<><> handleInputChange Call QuoteForm onInputChange with userInput:",userInput)
    onInputChange(userInput);
  } else {
    console.log("don't call handleInputChange onInputChange")
  }
}

  // handleChange = name => value => {
  //   console.log("UserSelect handleChange name:value",name,":",value)
  //     console.log("UserSelect value.value",value.value)
  //   this.setState({
  //     [name]: value.value,
  //   });
  //   console.log("props:",this.props)
  //   const {OnChange} = this.props
  //   if (OnChange ) {
  //     console.log("Call OnChange on UserSelect value:",value.value)
  //     OnChange(value)
  //   }
  //
  // };

  render() {
    console.log('render UserSelect props:',this.props)
    console.log('render UserSelect state:',this.state)
    const {userInput, userInfo,chatMessagesSearch} = this.state
    console.log('<UserSelect> <render> userInfo:',userInfo)
    console.log('<UserSelect> <render> chatMessagesSearch:',chatMessagesSearch)
    console.log("render UserSelect userInput:",userInput)
    const { classes, theme, value, name, usersQuery,username } = this.props;
    const { getUsers } = usersQuery

    const phoneNo = userInfo &&  userInfo.phone_no?userInfo.phone_no:'';
    const userId = userInfo && userInfo.userId? userInfo.userId:username? username.value:'';
    const fbInboxLink = userInfo && userInfo.fbInboxLink? 'https://www.facebook.com/'+userInfo.fbInboxLink:'';
    console.log("fbInboxLink:",fbInboxLink)
    console.log("render UserSelect props username:",username)


    console.log('render usersQuery.loading:',usersQuery.loading)


           var listOfUsers = !usersQuery.loading || ( getUsers != null && getUsers.length>0) ?
             getUsers && getUsers.map(selection => ({
              label: selection.name+"/"+selection.userId+ (selection.phone_no? '/'+selection.phone_no:'') ,
              value: selection.userId,
            })): null;
           console.log('<UserSelect><render>  listOfUsers from userQuery:',listOfUsers)
           if (listOfUsers == null) {

                 listOfUsers = [{label: '...',
                                value: '...'
                              }]
           }
          console.log('<UserSelect><render>  listOfUsers2:',listOfUsers)

          console.log('<UserSelect><render> props.username:',this.props.username)


    console.log('UserSelect <render> username:',username)
    console.log('UserSelect <render> listOfUsers:',listOfUsers)


    const selectStyles = {
      input: base => ({
        ...base,
        padding: '1em',
        width:500,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className="flex flex-row">
      <div className="flex flex-column">
          <NoSsr>
            <ReactSelect
              classes={classes}
              styles={selectStyles}
              options={listOfUsers}
              components={components}
              value={username}
              inputValue={userInput}
              onInputChange={this.handleInputChange}
              onChange={this.handleUserSelection}
              onClick={(e) => {this.copyToClipboard(e, username.label)}}
              placeholder="Search Users"
              isClearable={false}
              isSearchable={true}
            />
          </NoSsr>
      <TextField
        disabled={false}
        name="userId"
        type="String"
        label="User ID"
        value={userId}

        margin="dense"
        className={classes.textField}
          onClick={(e) => {this.copyToClipboard(e, userId)}}
        style={{
          //backgroundColor:'pink'

          'width' : '15em',
        }}
      />
      <TextField
        disabled={false}
        name="phoneNo"
        type="String"
        label="Phone#"
        value={phoneNo}
          onClick={(e) => {this.copyToClipboard(e, phoneNo)}}
        margin="dense"
        className={classes.textField}
        style={{
          //backgroundColor:'pink'

          'width' : '15em',
        }}
      />

      <a target="_blank" href={fbInboxLink}>
      <Button size="medium"  variant="contained"
        disabled={false}
        color="primary"
        margin="dense" >
        Go to User Inbox
      </Button>
      </a>
      </div>
      <div className="flex  border">
      <ChatView
          chatMessagesSearch={chatMessagesSearch}
          style={{
            //backgroundColor:'pink'
              'fontSize': '12px',
              'overflowY':'scroll',
              'overflow':'scroll',
              'width':'600px',
              'height':'5em',
          }}
          />
        </div>

    {usersQuery && usersQuery.loading? <Loading/>:null}

      </div>


    );
  }
}

UserSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const withUsers = graphql(usersQuery, {
  name: 'usersQuery',
  options: ({ userSearch }) => ({
    variables: {
      userId: (userSearch && userSearch.userId),
      username: (userSearch && userSearch.username),
      search: (userSearch && userSearch.search),
      searchField: (userSearch && userSearch.searchField),
    },
  //  pollInterval: 1000*60*5
  }),
});


export default withUsers(withStyles(styles, { withTheme: true })(UserSelect));

// <TextField
//   disabled={false}
//   name="edit_senderId"
//   type="String"
//   label="User ID"
//   value={edit_senderId}
//   onChange={this.handleUserSelection}
//
//   margin="dense"
//   className={classes.textField}
//   style={{
//     //backgroundColor:'pink'
//
//     'width' : '15em',
//   }}
// />

//
// {1==2 && usersQuery.loading? <Loading/>:usersQuery?
//     <div className="flex flex-row">
//     <NoSsr>
//       <ReactSelect
//         classes={classes}
//         styles={selectStyles}
//         options={listOfUsers}
//         components={components}
//
//         value={edit_username}
//
//         onChange={this.handleCatgChange('edit_username')}
//         placeholder="Search Users"
//         isClearable={false}
//       />
//     </NoSsr>
// <TextField
//   disabled={bulkUpdate}
//   name="edit_username.value"
//   type="String"
//   label="User ID"
//   value={edit_username.value}
//
//   margin="dense"
//   className={classes.textField}
//   style={{
//     //backgroundColor:'pink'
//
//     'width' : '15em',
//   }}
// />
//
// <TextField
//   disabled={bulkUpdate}
//   name="edit_senderId"
//   type="String"
//   label="User ID"
//   value={edit_senderId}
//   onChange={this.handleUserSelection}
//
//   margin="dense"
//   className={classes.textField}
//   style={{
//     //backgroundColor:'pink'
//
//     'width' : '15em',
//   }}
// />
// </div>
//  :null  }
