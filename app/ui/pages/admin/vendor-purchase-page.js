import React from 'react';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';
//import userFragment from '../../graphql/user/fragment/user';
import VendorPurchaseData from '/app/ui/components/smart/vendor-purchase/vendor-purchase-data';
import VendorPurchaseForm from '/app/ui/components/smart/vendor-purchase/vendor-purchase-form';
// import OrderStageFilter from '/app/ui/components/smart/order-details/order-stage-filter';
//import {view, stages } from '/app/ui/components/smart/order-details/helpers';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
// Styled-components example usage
const Title = styled.h3`
  color: tomato;
`;


//------------------------------------------------------------------------------
const Json = styled.pre`
  word-wrap: break-word;
  white-space: pre-wrap;
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class VendorPurchasePage extends React.PureComponent {
constructor(props) {
  super(props);
  this.state = {
    po_no:'',
    title:'',
    link:'',
    price:'',
    sale_price:'',
    initial_payment: '',
    total_amount: '',
    destination:'',
    username:'',
    po_qty:'',
    total_purchased_qty:'',
    delivery_days_to:'',
    delivery_days_from:'',
    status:'',

    order_no:'',
    pageSearch: {
      poNo: null,
    },
  //  stage: 'all'
  }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formChangeHandler = this.formChangeHandler.bind(this);
}

componentDidUpdate(prevProps) {
  console.log("vendor-purchase-page componentDidUpdate \nprevProps\n:",prevProps)
  console.log('this.state.location:',this.props.location)
  // Typical usage (don't forget to compare props):
  if (this.state.po_no !== prevProps.po_no ) {

    this.setState(prevProps);

  }
}
  handleSubmit = ({ pageSearch }) => {
    console.log("VendorPurchasePage handleSubmit pageSearch:", pageSearch)
// this.setState((prevState, props) => ({
//            point: {
//                // rest operator (...) expands out to:
//                ...prevState.pageSearch,
//            },
//
//        }));
   this.setState({ pageSearch });
    console.log("after setState END of order-detail-page: handleSubmit")
  }



      formChangeHandler = ({ target }) => {
              console.log("order-detailpage: formChangeHandler:")//,target)
        const { value, name } = target;
        console.log("target name/value,",name,":",value)
        this.setState({pageSearch: { [name]: value }});
      }

  render() {
    console.log('render VendorPurchasePage props:\n ', this.props)
    console.log('render VendorPurchasePage state:\n ', this.state)
    console.log('render VendorPurchasePage state.location:\n ', this.props.location)
    const { curUser, otherProps } = this.props;

      const poInfo = this.props.location? this.props.location.state: {po_no:''};

      console.log('poInfo:',poInfo)


    return (
      <div className="flex flex-row flex-auto" >

        <div className="search_data_container flex flex-column col-9 wrap fit  flex-auto">
           <VendorPurchaseForm  {...this.props} history1={this.props.history} poInfo={poInfo} onSubmit={this.handleSubmit} onChange={this.formChangeHandler}/>

        </div >
      </div>
    );
  }
}
// <VendorPurchaseData
//     pageSearch={this.state.pageSearch}
//     stage={this.state.stage}
//  />
// <div style={{ margin: 'auto', width:'40%', 'max-width': '400px' }}>
//   </div>
// <div style={{ margin: auto, width:'100%', 'max-width': '960px' }}>
// </div>
VendorPurchasePage.propTypes = {
//  curUser: propType(userFragment),
};

VendorPurchasePage.defaultProps = {
  curUser: null,
};

export default VendorPurchasePage;
