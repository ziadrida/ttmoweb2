import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import chatMessagesFragment from '/app/ui/apollo-client/chat-messages/fragment/chat-messages';
import chatMessagesQuery from '/app/ui/apollo-client/chat-messages/query/chat-messages';
import gql from 'graphql-tag';
import Loading from '/app/ui/components/dumb/loading';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import matchSorter from 'match-sorter';
import moment from 'moment';

  // Import React Table
  import ReactTable from "react-table";
  //import "react-table/react-table.css";

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';



  const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 2,
      overflowX: 'auto',
      overflowY: 'auto',

    },
    table: {
      minWidth: 200,
    },
  });


  //************************************************************
  const ChatView = (props) => {
    console.log('=> in ChatView component props',props)

  const { chatMessagesData, classes } = props

  const { loading, error, getChatMessages ,variables  } = chatMessagesData;

  if (!getChatMessages) return <p>No Chat Messages</p>
  const recordCount = getChatMessages? getChatMessages.length:0;
  console.log('variables:',variables)
  console.log("getChatMessages:",getChatMessages.length)
  nvl = (val1, val2) => ( val1 != undefined&& val1 !=null  ? val1:val2)

  const columns = [
      {
          Header: "Reply",
          id: "is_echo",
          accessor: d => (d.is_echo != null && d.is_echo)? "YES":"",
          filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: ["is_echo"] }),
          filterAll: true,
          maxWidth: 50
        },

    {
      id: 'dateCreated',
      Header: "Date",
      accessor: d => d.dateCreated,
      Cell: row => <span>{row.value? moment(parseInt(row.value)).format('DD-MMM HH:mm:ss'):null}</span>,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["dateCreated"] }),
      filterAll: true,
      width:100,
    },
    {
      id: "messageText",
      Header: "Message",
      accessor: d => d.messageText ,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["messageText"] }),
      filterAll: true,
      style: { 'whiteSpace': 'unset',
        'fontSize': '12px',
        'overflowY':'scroll',
        width:540,
        'height':'4em'
       },
       width:300,

    },

  ]

  if (error) {
    return <p>{error.message}</p>;
  }


  return (
        <div>
          { loading?
            <Loading />:null
          }
          <ReactTable
            data={getChatMessages}
            showPagination={false}
            showPaginationTop={false}
            showPaginationBottom={false}
            filterable={false}
            defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
            columns={columns}
            defaultPageSize={100}
            style={{
              height: "280px", // This will force the table body to overflow and scroll, since there is not enough room
              width: "600px", // This will force the table body to overflow and scroll, since there is not enough room
              'fontSize': '10px',
              'overflowY':'scroll',
              'overflowX':'scroll',
              'overflow':'scroll',
            }}
            className="-striped -highlight"
          />
        </div>
      );

  };


ChatView.propTypes = {
//    classes: PropTypes.object.isRequired,
  chatMessagesData: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    chatMessagess: PropTypes.arrayOf(propType(chatMessagesFragment)),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};


ChatView.defaultProps = {
  username: '',
  search: '',
};
//console.log("in component chatMessages.js")

const withData = graphql(chatMessagesQuery, {
  name: 'chatMessagesData',
  options: ({ chatMessagesSearch }) => ({
    variables: {
      username: (chatMessagesSearch && chatMessagesSearch.username),
      search: (chatMessagesSearch && chatMessagesSearch.search),
      searchField: (chatMessagesSearch && chatMessagesSearch.searchField),
      dateFrom: (chatMessagesSearch && chatMessagesSearch.dateFrom),
      dateTo: (chatMessagesSearch && chatMessagesSearch.dateTo)
    },
    pollInterval: 1000*60*0.5
  }),
});
//export default withData(withStyles(styles)(ChatView));
export default withData(ChatView);
