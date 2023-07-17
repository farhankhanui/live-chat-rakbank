import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { MessagesList } from "./elements/MessagesList";
import { SendMessageInput } from "./elements/SendMessageInput";

import { GenesysChat } from "../utils/GenesysChat";
import has from "lodash/has";
import { INVALID_SESSION } from "../constants";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 375px;
  min-height:  ${(props) => props.isHeader ? '450px' : '400px'};
  border-radius: 8px;  
  ${(props) =>
    props.application !== 'Internet Banking' && `
  background-color: #fff;
`}
${(props) =>
    props.isHeader && {
      boxShadow: '0 2px 54px 0 rgba(0, 0, 0, 0.11)',
    }}
`;

const TypingLabel = styled.div`
  font-size: 12px;
  margin: 8px 16px;
  color: #263d4c;
  opacity: 0.5;
`;

const LoadingLabel = styled.div`
  font-size: 16px;
  margin: 8px 16px;
  color: #263d4c;
  opacity: 0.5;
`;

// const chatInstance = GenesysChat.getInstance();

function Chat({
  initiatedCustomerName = '',
  initiatedCustomerMobile = '',
  emailAddress = '',
  message,
 
  onClose = () => {},
  onMinimize = () => {},
  onNewMessageReceive = () => {},
  subject,
  config,
  Header,
  application = '',
  SessionComponent,
  FailureComponent,
  setIsChatFailed,
 
  triggerCloseChat = '',
  ConfirmModal,
  chatInitiated,
  sessionID,
}) {
  const [messages, setMessages] = useState([]);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentLeft, setAgentLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFailure, setIsFailure] = useState(false);
  const [chatInstance, setChatInstance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSessionInvalid, setSessionInvalid] = useState(false);

  useEffect(() => {
    // console.log("GenesysChat",GenesysChat)
  
      setChatInstance(GenesysChat.getInstance());
      
      
    
    // console.log("GenesysChat.getInstance()",GenesysChat.getInstance())
  }, [chatInstance])

  const agentTypingHandler = useCallback(
    (flag) => {
      setAgentTyping(flag);
    },
    [setAgentTyping]
  );

  const agentLeftHandler = useCallback(
    (flag) => {
      setAgentLeft(flag);
    },
    [setAgentLeft]
  );

  const handleNewMessageArrival = useCallback(
    (messages) => {
      setMessages(messages);
      onNewMessageReceive(messages);
    },
    [setMessages, onNewMessageReceive]
  );

  const chatConnected = useCallback( () => {
   // console.log("chatConnected",chatInstance)
    if (chatInstance !== null) {
      setIsLoading(false);
      application === 'Internet Banking' && chatInitiated();
      chatInstance.messagesCallback = handleNewMessageArrival;
      chatInstance.setOnTypingEventsHandler(agentTypingHandler);
      chatInstance.setOnAgentLeftEventHandler(agentLeftHandler);
      chatInstance.sendChatMessage(message);
    }
  }, [chatInstance, message, agentTypingHandler, agentLeftHandler, handleNewMessageArrival])

  const showFailureComponent = useCallback((failureReason) => {
    if (application === 'Internet Banking') {
      failureReason === INVALID_SESSION && setSessionInvalid(true);
      setIsFailure(true);
      setIsLoading(false);
      setIsChatFailed(true);
    }
  }, [setSessionInvalid, setIsFailure, setIsLoading, setIsChatFailed]);

  useEffect(() => {
     
    
    if(chatInstance !== null){
       
     
      chatInstance.configureChat(config, application);
      setMessages([]);
      chatInstance
        .initChat(
          {
            InitiatedCustomerName: initiatedCustomerName,
            InitiatedCustomerMobile: initiatedCustomerMobile,
            EmailAddress: emailAddress,
           
            selectedSubject: "subject",
            message:"lorem ispum",
           
            sessionID:'rfvu4hqhb8yw27y85gbkg0wggial'
          },
          chatConnected,
          showFailureComponent
        )
        //setIsLoading(false);
    }
  }, [chatInstance]);

  const handleClose = useCallback((closeEvent) => {
    if (application === 'Internet Banking' && closeEvent !== 'autoClose' && !isFailure) {
      setShowModal(true);
    } else {
      setShowModal(false);
      GenesysChat.getInstance().triggerDisconnectEvent();
      onClose();  
    }
  }, [onClose, isFailure]);

  useEffect(() => {
    if(triggerCloseChat !== '') {
      handleClose(triggerCloseChat);
    }
  }, [triggerCloseChat])

  return (
    <Container isHeader={!!Header} application={application}>
      {!!Header && <Header onClose={() => handleClose('close')} onMinimize={onMinimize} />}
      {isLoading ? (
        <LoadingLabel>Loading...</LoadingLabel>
        ) : isFailure ? (
          <FailureComponent invalidSession={isSessionInvalid} />
      ) : (
        <Body>
          <MessagesList data={messages} />
          {console.log(messages)}
          {agentTyping && !agentLeft && <TypingLabel>Agent is typing...</TypingLabel>}
          {agentLeft && <TypingLabel>Agent left chat</TypingLabel>}
          {!agentLeft && <SendMessageInput
            placeholder="Type Message"
            chatInstance={GenesysChat}
            application={application}
          />}
          
        </Body>
      )}
      {application === 'Internet Banking' && SessionComponent && (
        <SessionComponent closeChat={(closeEvent) => handleClose(closeEvent)} />
      )}
       {application === 'Internet Banking' && showModal && (
        <ConfirmModal closeChat={(closeEvent) => handleClose(closeEvent)} setShowModal={(showModal) => setShowModal(showModal)} />
      )}
    </Container>
  );
}

Chat.propTypes = {
  initiatedCustomerName: PropTypes.string,
  initiatedCustomerMobile: PropTypes.string,
  emailAddress: PropTypes.string,
 
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  config: PropTypes.shape({
    channel: PropTypes.string.isRequired,
    channelId: PropTypes.string,
    apiPath: PropTypes.string.isRequired,
    productCategory: PropTypes.string,
  }).isRequired,
  application: PropTypes.string,
  SessionComponent: PropTypes.elementType,
 
  FailureComponent: PropTypes.elementType,
  setIsChatFailed: PropTypes.func,
  triggerCloseChat: PropTypes.string,
  ConfirmModal: PropTypes.elementType,
  chatInitiated: PropTypes.func,
  sessionID: PropTypes.string,
};

export default React.memo(Chat);
