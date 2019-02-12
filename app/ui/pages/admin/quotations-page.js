import React from 'react';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';
//import userFragment from '../../graphql/user/fragment/user';
import Quotations from '/app/ui/components/smart/quotations/quotations';
import QuotationForm from '/app/ui/components/smart/quotations/quotation-form';
// import axios from 'axios';
// import cheerio from 'cheerio';
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
class QuotationPage extends React.PureComponent {

  state =  { quotationSearch: null }


  handleSubmit = ({ quotationSearch }) => {
    console.log("quotationPage handleSubmit quotationSearch:", quotationSearch)
    this.setState({ quotationSearch });

  }

  render() {
    console.log('render QuotationPage ', this.props)
    console.log('render QuotationPage ', this.state)
    const { curUser } = this.props;
    const { quotationSearch } = this.state;
//  <Quotations />

    return (
      <div className="search_data_container flex flex-column ml1 wrap fit  flex-auto">
         <QuotationForm  onSubmit={this.handleSubmit} />
         <Quotations quotationSearch={quotationSearch}/>
      </div>
    );
  }
}
// <div style={{ margin: 'auto', width:'40%', 'max-width': '400px' }}>
//   </div>
// <div style={{ margin: auto, width:'100%', 'max-width': '960px' }}>
// </div>
QuotationPage.propTypes = {
//  curUser: propType(userFragment),
};

QuotationPage.defaultProps = {
  curUser: null,
};

export default QuotationPage;
