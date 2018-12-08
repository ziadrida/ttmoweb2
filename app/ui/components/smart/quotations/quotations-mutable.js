import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import quotationFragment from '/app/ui/apollo-client/quotation/fragment/quotation';
import quotationsQuery from '/app/ui/apollo-client/quotation/query/quotations';
import gql from 'graphql-tag';
import Loading from '/app/ui/components/dumb/loading';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
  import MUIDataTable from 'mui-datatables'

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

/*
const Quotations = ({ quotationsData }) => {
  <Query query={QUOTATION_QUERY}>
     {({ loading,error, data }) => {
       if (loading) return "Loading ...";
       if (error) return "Error loading quotation"
       const { getQuotation } = data;

       return (
         <li key={getQuotation.quote_no}>
         <h1> {getQuotation.quote_no} - {getQuotation.senderId } - {(getQuotation.user? getQuotation.user.name: "")}</h1>
         </li>)

     }}
  </Query>
  };
  export default Quotations
  */

  getMuiTheme = () => createMuiTheme({ // useNextVariants: true
    typography: {
      useNextVariants: true,
    },
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "light gray"
        }
      }
    }
  })
  // getMuiTheme = () => createMuiTheme({
  //   typography: {
  //     useNextVariants: true,
  //   },
  //     overrides: {
  //       MUIDataTable: {
  //         root: {
  //
  //         },
  //         paper: {
  //           boxShadow: "none",
  //         }
  //       },
  //       MUIDataTableBodyRow: {
  //         root: {
  //           '&:nth-child(odd)': {
  //             backgroundColor: 'light gray'
  //           }
  //         }
  //       },
  //       MUIDataTableBodyCell: {
  //       }
  //     }
  //   })

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

   onRowsDelete = (rowsDeleted) => {
     console.log('=> in rowsDeleted:',rowsDeleted)
   }
   onRowClick = (rowClicked) => {
     console.log('=> in rowClicked:',rowClicked)
   }

  const Quotations = (props) => {
    console.log('=> in Quotations component props',props)
  const { quotationsData, classes } = props

  const { loading, error, getQuotation ,variables  } = quotationsData;
  if (!getQuotation) return <p>Search for quotation</p>
  console.log('variables:',variables)

    const columns = ["quote_no","Quote Date","username", "Reason","Active/Final/PO",
           {
           name: "URL/HTTP link",
           options: {
             filter: true,
             customBodyRender: (value, tableMeta, updateValue) => {
               return (
                 <a href={value} target="_blank">{value} </a>
               );
             }
           }
         },
         "source","MPN[ASIN]","price","Qty","Sale Price","Dest","Price Opts","Chg Wt","sales_person"];

    const options = {
      filterType: "dropdown",
      responsive: "scroll", //"stacked", //
      pagination: true,
      resizableColumns: true,
      rowHover: true,
      fixedHeader: false,
      print: false,
      download: false,
      onRowsDelete: onRowsDelete(),
      onRowClick: onRowClick()
    };
    var myData = []
  myData =  getQuotation.map(quotation => {
     item = (quotation.quotation && quotation.quotation.item?  quotation.quotation.item:null)
     quote = (quotation.quotation? quotation.quotation: null)
      salePrice = (quote && quote.prices &&quote.price_selection && quote.prices.amm_exp? quote.prices[quote.price_selection].price:'')
     return([
      quotation.quote_no,
       (quote.quote_date? quote.quote_date.substring(0, 21):''),
      (item &&item.username ? item.username:''),
      (quote&&quote.reason? quote.reason:''),
      (quote&&quote.active ? quote.active + (quote.final!= undefined?  '/' +quote.final:'/'+false)+(quote.po_no? '/' +quote.po_no:''):''),
      (item && item.url ?item.url: ''),
      (item &&item.source ? item.source: ''),
      (item &&item.MPN || item.asin ? item.MPN+'['+item.asin+']': ''),
      (item &&item.price? item.price.toFixed(1):''),
        (item &&item.qty? (item.qty>9999?9999:item.qty):''),
      salePrice,
      (quote.price_selection? quote.price_selection:''),
      (quote.price_selection?
        'amm_exp:'+quote.prices['amm_exp'].price+'\n'+
        'amm_std:'+quote.prices['amm_std'].price+'\n'+
        'aq_std:'+ quote.prices['aq_std'].price+'\n'
        :''),
      (item &&item.chargeableWeight? item.chargeableWeight.toFixed(1): ''),
      (quotation.sales_person? quotation.sales_person: ''),


          ])
        })

        console.log("myData:",myData)
        //    {(quotation.quotation? JSON.stringify(quotation.quotation.item,2,null):"")})

  if (!variables.quoteNo && !variables.search ) return <p> Enter search </p>

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>{error.message}</p>;
  }


  // return (
  //   <div>
  //     {getQuotation.map(quotation => (
  //       <div key={quotation._id}>
  //         {quotation.quote_no}, {quotation.senderId},
  //         {(quotation.quotation? quotation.quotation.username:'')},
  //         {(quotation.quotation? quotation.quotation.reason:'')},
  //         {(quotation.user? quotation.user.name:'')},
  //         {quotation.sales_person},
  //         {(quotation.quotation? JSON.stringify(quotation.quotation.item,2,null):"")}
  //       </div>
  //
  //     ))}
  //   </div>
  // );
  return (
    <MuiThemeProvider theme={this.getMuiTheme()}>
    <MUIDataTable
      title={"Quotations"}
      data={myData}
      columns={columns}
      options={options}
    />
     </MuiThemeProvider>
  );

  // return (
  //   <Paper className={classes.root}>
  //     <Table className={classes.table}>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Quote No</TableCell>
  //           <TableCell numeric>Sender FID</TableCell>
  //           <TableCell numeric>Sales Person</TableCell>
  //           <TableCell numeric>user name</TableCell>
  //           <TableCell numeric>Category</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {getQuotation.map(quotation => {
  //           return (
  //             <TableRow key={quotation._id}>
  //               <TableCell component="th" scope="row">
  //                 {quotation.quote_no}
  //               </TableCell>
  //               <TableCell >{quotation.senderId}</TableCell>
  //               <TableCell >{quotation.sales_person}</TableCell>
  //               <TableCell >{(quotation.user? quotation.user.name:'')}</TableCell>
  //               <TableCell >  {(quotation.quotation && quotation.quotation.item? quotation.quotation.item.category:'')}</TableCell>
  //             </TableRow>
  //           );
  //         })}
  //       </TableBody>
  //     </Table>
  //   </Paper>
  // );
  };




Quotations.propTypes = {
//    classes: PropTypes.object.isRequired,
  quotationsData: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    quotations: PropTypes.arrayOf(propType(quotationFragment)),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};


Quotations.defaultProps = {
  quoteNo: '',
  search: '',
};
//console.log("in component quotation.js")

const withData = graphql(quotationsQuery, {
  name: 'quotationsData',
  options: ({ quotationSearch }) => ({
    variables: {
      quoteNo: (quotationSearch && Number(quotationSearch.quoteNo)),
      search: (quotationSearch && quotationSearch.search)
    },
  }),
});
//export default withData(withStyles(styles)(Quotations));
export default withData(Quotations);
