import React from 'react';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';
//import userFragment from '../../graphql/user/fragment/user';
import ChatMessages from '/app/ui/components/smart/chat-messages/chat-messages';
import ChatMessagesForm from '/app/ui/components/smart/chat-messages/chat-messages-form';

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
class ChatMessagesPage extends React.PureComponent {

  state =  { chatMessagesSearch: null }


  handleSubmit = ({ chatMessagesSearch }) => {
    console.log("ChatMessagesPage handleSubmit chatMessagesSearch:", chatMessagesSearch)
    this.setState({ chatMessagesSearch });

  }

  render() {
    console.log('render ChatMessagesPage ', this.props)
    console.log('render ChatMessagesPage ', this.state)
    const { curUser } = this.props;
    const { chatMessagesSearch } = this.state;
//  <ChatMessages />

    return (
      <div >
      <div className="quotation__search">
         <ChatMessagesForm  onSubmit={this.handleSubmit} />

      <div className="quotations__container">
          <ChatMessages chatMessagesSearch={chatMessagesSearch}/>
      </div>
        </div >
      </div>
    );
  }
}
// <div style={{ margin: 'auto', width:'40%', 'max-width': '400px' }}>
//   </div>
// <div style={{ margin: auto, width:'100%', 'max-width': '960px' }}>
// </div>
ChatMessagesPage.propTypes = {
//  curUser: propType(userFragment),
};

ChatMessagesPage.defaultProps = {
  curUser: null,
};

export default ChatMessagesPage;
