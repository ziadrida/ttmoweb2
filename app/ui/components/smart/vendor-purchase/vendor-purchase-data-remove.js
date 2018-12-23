import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import orderDetailsFragment from '/app/ui/apollo-client/order-details/fragment/order-details';
import vendorPurchasQuery from '/app/ui/apollo-client/order-details/query/order-details';

import gql from 'graphql-tag';
import Loading from '/app/ui/components/dumb/loading';
import moment from 'moment'



  // Import React Table
  import ReactTable,{ReactTableDefaults} from "react-table";
  //import "react-table/react-table.css";
// views enums


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

  const getColumnWidth = (data, accessor, headerText) => {
    if (typeof accessor === 'string' || accessor instanceof String) {
      accessor = d => d[accessor]; // eslint-disable-line no-param-reassign
    }
    const maxWidth = 600;
    const magicSpacing = 10;
    const cellLength = Math.max(
      ...data.map(row => (`${accessor(row)}` || '').length),
      headerText.length,
    );
    return Math.min(maxWidth, cellLength * magicSpacing);
  }




  //************************************************************
    class VendorPurchaseData extends React.Component {
      constructor(props) {
        super(props);
        console.log('=> in VendorPurchaseData component props', this.props)
        this.state = {
          po_no: null,
          title: null,
          link: null,
          price: null,
          salePrice: null,
          orderNo: null,
          daysFrom: 7,
          daysTo: 14,
          orderDate: moment(new Date())

        }

        this.escFunction = this.escFunction.bind(this);
      }


       escFunction(event, sender) {
         if (event.keyCode === 27) {
           console.log('sender:', sender)
          console.log("Escape!:",event)
          console.log("Escape oldValue:",this.state.oldVal)
           console.log("Escape newValue:", this.state.newVal)
         }
       }
       componentDidMount() {
         console.log(">>>>>>>>>>>>>> order-details componentDidMount")
      //  this.setState({ columns: this.configColumns() })
         document.addEventListener("keydown", this.escFunction, false);

         // this.toggleViewChooser(
         //   stages[
         //     stages.indexOf(stages.find(i=> (i.name == this.state.stage) ))
         //   ].view)
       }

       componentWillUnmount() {
         document.removeEventListener("keydown", this.escFunction, false);
       }


  componentDidUpdate(prevProps) {
    console.log("order-details componentDidUpdate \nprevProps\n:",prevProps)

  }

// render component
render() {
    const { vendorPurchaseData, classes } = this.props

  //  this.state.stage = stage;
  console.log("--->>>>> Render order-details -")
    const { loading, error, getVendorPurchaseData ,variables  } = vendorPurchaseData;

    if (!getVendorPurchaseData) return <p>Search for orders</p>

    console.log('getVendorPurchaseData:',getVendorPurchaseData)


    console.log('variables:',variables)

  if (!variables.poNo &&
      !variables.orderNo ) return <p> Enter search criteria </p>

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>{error.message}</p>;
  }


  return (
        <div className="data">
        data
        </div>
      );
  }
  };


VendorPurchaseData.propTypes = {
//    classes: PropTypes.object.isRequired,
    vendorPurchaseData: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    vendorPurchaseData: PropTypes.arrayOf(propType(orderDetailsFragment)),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};


VendorPurchaseData.defaultProps = {
    poNo: '',
    orderNo:'',

};


// const withData = graphql(vendorPurchasQuery, {
//   name: 'vendorPurchaseData',
//   // options are props passed from order-details-page
//   options: ({ pageSearch,stage }) => ({
//     variables: {
//       poNo: (pageSearch && pageSearch.poNo),
//       status: (pageSearch && pageSearch.status),
//       orderNo: (pageSearch && pageSearch.orderNo),
//       trackingNo: (pageSearch && pageSearch.trackingNo),
//       awbNo: (pageSearch && pageSearch.awbNo),
//       username: (pageSearch && pageSearch.username),
//       search: (pageSearch && pageSearch.search),
//       stage: stage,
//     },
//   }),
// });
// //export default withData(withStyles(styles)(VendorPurchaseData));
// export default withData(VendorPurchaseData);
export default VendorPurchaseData;
