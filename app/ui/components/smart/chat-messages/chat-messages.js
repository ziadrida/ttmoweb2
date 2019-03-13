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
      minWidth: 500,
    },
  });


  //************************************************************
  const ChatMessages = (props) => {
    console.log('=> in ChatMessages component props',props)

  const { chatMessagesData, classes } = props

  const { loading, error, getChatMessages ,variables  } = chatMessagesData;

  if (!getChatMessages) return <p>Search for chatMessages</p>
  const recordCount = getChatMessages? getChatMessages.length:0;
  console.log('variables:',variables)
  console.log("getChatMessages:",getChatMessages.length)
  nvl = (val1, val2) => ( val1 != undefined&& val1 !=null  ? val1:val2)

  const columns = [
    {
      Header: "Username",
      accessor: "name",
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["name"] }),
      filterAll: true,


      maxWidth: 200
    },
    {
        Header: "userId",
        accessor: "userId",
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["userId"] }),
        filterAll: true,
        maxWidth: 200
      },
      {
          Header: "Reply",
          id: "is_echo",
          accessor: d => (d.is_echo != null && d.is_echo)? "YES":"",
          filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: ["is_echo"] }),
          filterAll: true,
          maxWidth: 70
        },
        {
            Header: "Msg Seq",
            id: "seq",
            accessor: d => d.seq,
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["seq"] }),
            filterAll: true,
            maxWidth: 70
          },
    {
      id: 'dateCreated',
      Header: "Date",
      accessor: d => d.dateCreated,
      Cell: row => <span>{row.value? moment(parseInt(row.value)).format('DD-MMM-YYYY HH:mm:ss'):null}</span>,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["dateCreated"] }),
      filterAll: true,
      width:200,
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
       width:400,

    },
    {
      id: 'url',
      Header: "url",
      accessor: d => (d.messageAttachments && d.messageAttachments !="" && d.messageAttachments[0]?
      <a href = {d.messageAttachments[0].url}
      target = "_blank" > {d.messageAttachments[0].url} </a>:''),
      filterMethod: (filter, rows) => {
                //  console.log('rows:',rows)
                  //console.log('filter:',filter)

                  return matchSorter(rows, filter.value, { keys: ["url.props.href"] })
                },
      filterAll: true,
      style: { 'whiteSpace': 'unset',
        'fontSize': '12px',
        'overflowY':'scroll',
        width:400,
        'height':'4em'
       },

    },
    {
      id: "title",
      Header: "Title",
      accessor: d => (d.messageAttachments && d.messageAttachments !="" && d.messageAttachments[0]?
        d.messageAttachments[0].title:''),
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["title"] }),
      filterAll: true,
    },
  ]

  if (error) {
    return <p>{error.message}</p>;
  }


  return (

        <div>
          { loading?
            <Loading />:
            <div className="statusline">
            <a>Found {recordCount<200? recordCount:'at least '+recordCount} records</a>
            </div>
          }
          <ReactTable
            data={getChatMessages}
            filterable
            defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
            columns={columns}
            defaultPageSize={10}
            pivotBy={["name"]}
            style={{
              height: "360px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
            className="-striped -highlight"
          />
        </div>
      );

  };


ChatMessages.propTypes = {
//    classes: PropTypes.object.isRequired,
  chatMessagesData: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    chatMessagess: PropTypes.arrayOf(propType(chatMessagesFragment)),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};


ChatMessages.defaultProps = {
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
    pollInterval: 1000*60*5
  }),
});
//export default withData(withStyles(styles)(ChatMessages));
export default withData(ChatMessages);
