import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';
//import userFragment from '../../graphql/user/fragment/user';
import OrderDetails from '/app/ui/components/smart/order-details/order-details';
import OrderDetailsForm from '/app/ui/components/smart/order-details/order-details-form';
import OrderStageFilter from '/app/ui/components/smart/order-details/order-stage-filter';
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
class OrderDetailsPage extends React.PureComponent {

  state = {
    orderDetailsSearch: {
      poNo: null,
      status: null,
      orderNo: null,
      trackingNo: null,
      awbNo: null,
      username: null,
      search: null,

    },
    stage: 'purchase'

  }



  handleSubmit = ({ orderDetailsSearch }) => {
    console.log("orderDetailsPage handleSubmit orderDetailsSearch:", orderDetailsSearch)
// this.setState((prevState, props) => ({
//            point: {
//                // rest operator (...) expands out to:
//                ...prevState.orderDetailsSearch,
//            },
//
//        }));
   this.setState({ orderDetailsSearch });
    console.log("after setState END of order-detail-page: handleSubmit")
  }

  // handle onChange
  stageChangeHandler = value => {
    console.log("order-dtail-page  change filter stage: ",value)

          this.setState(prevState => ({

              orderDetailsSearch:{

                ...prevState.orderDetailsSearch,

              },
              stage: value,
          }))
          console.log("order-dtail-page new state:",this.state)


      }

      formChangeHandler = ({ target }) => {
              console.log("order-detailpage: formChangeHandler:")//,target)
        const { value, name } = target;
        console.log("target name/value,",name,":",value)
        this.setState({orderDetailsSearch: { [name]: value }});
      }

  render() {
    console.log('render OrderDetailsPage props:\n ', this.props)
    console.log('render OrderDetailsPage state:\n ', this.state)
    const {intl,history,location, curUser } = this.props;

    const { orderDetailsSearch } = this.state;

    return (
      <div className="flex flex-row flex-auto" >
        <div className="filter flex flex-column col-1 flex-auto">
           <p> Filter Orders </p>
          <OrderStageFilter {...this.props} onChange={this.stageChangeHandler} />
        </div>
        <div className="search_data_container flex flex-column col-10 wrap fit  flex-auto">
           <OrderDetailsForm   {...this.props} onSubmit={this.handleSubmit} onChange={this.formChangeHandler}/>
            <OrderDetails {...this.props}
                orderDetailsSearch={this.state.orderDetailsSearch}
                stage={this.state.stage}
             />
        </div >
      </div>
    );
  }
}
// <div style={{ margin: 'auto', width:'40%', 'max-width': '400px' }}>
//   </div>
// <div style={{ margin: auto, width:'100%', 'max-width': '960px' }}>
// </div>
OrderDetailsPage.propTypes = {
//  curUser: propType(userFragment),
  vendorPurchaseUrl:PropTypes.func.isRequired,

};

OrderDetailsPage.defaultProps = {
  curUser: null,
};

export default OrderDetailsPage;
