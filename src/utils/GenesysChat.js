/* eslint-disable */
import cometd from "cometd";
import nanoid from "nanoid";
import has from "lodash/has";

import { arg1, arg2, CONNECTED_STATUS, data1, INVALID_SESSION, } from "../constants";

const ChatOperationTypes = Object.freeze({
  RequestChat: "requestChat",
  SendMessage: "sendMessage",
  ClientStartTyping: "startTyping",
  ClientStopTyping: "stopTyping",
  SyncNotifications: "requestNotifications",
  UpdateNickName: "updateNickname",
  ChatDisconnect: "disconnect",
  IncomingMessage: "Message",
  ParticipantJoined: "ParticipantJoined",
  TypingStarted: "TypingStarted",
  TypingStopped: "TypingStopped",
  ParticipantLeft: "ParticipantLeft",
  UpdateData: "updateData"
});

export const agentEvents = Object.freeze({
  "#ENABLE#AUTH#BUTTON#": "#ENABLE#AUTH#BUTTON#"
});

export const UserTypes = Object.freeze({
  External: "External",
  Agent: "Agent",
  Client: "Client"
});

export class GenesysChat {
  static chatInstance;
   
  static getInstance() {
    if (GenesysChat.chatInstance === undefined) {
       
      GenesysChat.chatInstance = new GenesysChat();
    }
    return GenesysChat.chatInstance;
  }

  constructor() {
    this.cometD = new cometd.CometD();
    this.chatMessages = [];
    this.secureKey = "";
    this.lastPosition = 0;
    this.userInfo = {};
    this.config = {};
    this.eventsCallback = () => {};
    this.messagesCallback = () => {};
    this.connectedCallback = () => {};
    this.failureCallback = () => {};
    this.application = '';
  }

  get userData() {
    const {
      InitiatedCustomerName,
      InitiatedCustomerMobile,
      AuthenticatedCustomerName,
      AuthenticatedCustomerMobile,
      EmailAddress,
      isAuth = false,
      message,
       
      sessionID
    } = this.userInfo;

    if (this.application === 'Internet Banking') {
      return {
        key1: "v1",
        key2: "v2",
        // InitiatedCustomerName,
        // InitiatedCustomerMobile,
        // AuthenticatedCustomerName,
        // AuthenticatedCustomerMobile,
        // LastName: AuthenticatedCustomerName || InitiatedCustomerName,
        // PhoneNumber: AuthenticatedCustomerMobile || InitiatedCustomerMobile,
        // EmailAddress,
        FinalAuthenticationStatus: isAuth ? "Successfully" : "Error",
        message,
        ProductCategory: this.config.productCategory || "RBD-CON",
        IsAuth: isAuth ? "Y" : "N",
        ChannelID: this.config.channelId,
        OsType: "iOS",
        // CIF,
        sessionID,
        FinalAuthenticationDateTime: new Date()
      };
    } else {
      return {
        key1: "v1",
        key2: "v2",
        InitiatedCustomerName,
        InitiatedCustomerMobile,
        AuthenticatedCustomerName,
        AuthenticatedCustomerMobile,
        LastName: AuthenticatedCustomerName || InitiatedCustomerName,
        PhoneNumber: AuthenticatedCustomerMobile || InitiatedCustomerMobile,
        EmailAddress,
        FinalAuthenticationStatus: isAuth ? "Successfully" : "Error",
        message,
        ProductCategory: this.config.productCategory || "RBD-CON",
        IsAuth: isAuth ? "Y" : "N",
        ChannelID: this.config.channelId,
        OsType: "iOS",
        
        FinalAuthenticationDateTime: new Date()
      };
    }
  }
  /**
   * Sets up basic cometD configuration parameters.
   */
  configureChat = (config, application) => {
    this.config = config;
    this.cometD.configure({
      url: this.config.apiPath,
      logLevel: "debug"
    });
    const TimeStampExtension = require("cometd/TimeStampExtension");
    this.cometD.registerExtension("timestamp", new TimeStampExtension());
    this.cometD.websocketEnabled = false;
    this.application = application;
  };

  /**
   * Handshake and subscribe function will trigger in this method.
   * @param userInfo - chat window element
   *  call back type is specified as any because response coming from the cometd plugin file.
   */
  initChat = (userInfo, callback = () => {}, failureCallback = () => {}) => {
    // Handshake with the server.
     
    if (this.cometD.getStatus() !== CONNECTED_STATUS) {
      this.userInfo = userInfo;
      this.connectedCallback = callback;
      this.failureCallback = failureCallback;
      return this.initiateHandshake();
    } else {
      return Promise.reject({ message: "Chat already created!" });
    }
  };

  initiateHandshake = () => {
  
    return new Promise(
      (resolve, reject) =>
        (this.handshake = this.cometD.handshake(h => {
          if (h.successful) {
            this.subscribeToChannel();
            resolve(h);
          } else {
            reject({ message: h.failure.reason });
          }
        }))
    );
  };

  subscribeToChannel = () => {
     
    return new Promise((resolve, reject) => {
      this.subsctiption = this.cometD.subscribe(
        this.config.channel,
        messages => {
          console.log(messages)
          if (messages.data.secureKey !== undefined) {
            this.secureKey = messages.data.secureKey;
          }
          if (has(messages, "errors")) {
            this.failureCallback('error');
            reject(messages.errors);
          } else if (has(messages, "data.errors")) {
            this.failureCallback('error');
            reject(messages.data.errors);
          }
          else {
            this.onReceiveData(messages);
            resolve(messages);
          }
        },
        this.sendChatRequest
      );
    });
  };

  updateUserData = userData => {
    this.userInfo = userData;
    const updateChangeData = {
      operation: ChatOperationTypes.UpdateData,
      userData: this.userData,
      secureKey: this.secureKey
    };

    return new Promise((resolve, reject) => {
      this.cometD.publish(this.config.channel, updateChangeData, publishResponse => {
        if (publishResponse.successful) {
          resolve(publishResponse);
        } else {
          reject(publishResponse);
        }
      });
    });
  };

  sendChatRequest = subscribeReply => {
     
    const requestChatData = {
      operation: ChatOperationTypes.RequestChat,
      firstName: "mustafa",
      lastName: 'zaki',
      subject: this.userInfo.selectedSubject,
      userData: this.userData,
      auth: {
        [arg1.join('')]: data1,
        [arg2.join('')]: data1,
      }
    };
     
    return new Promise((resolve, reject) => {
      if (subscribeReply.successful)
        this.cometD.publish(this.config.channel, requestChatData, response => {
          if (response.successful) {
            resolve(response);
            this.sendChatMessage('testing chat')
          } else {
            reject(response);
          }
        });
      else reject({ message: "Subscribe is unsuccessful" });
    });
  };

  unSubscribe = () => {
    if (this.subsctiption) {
      this.cometD.unsubscribe(this.subsctiption);
      this.subsctiption = undefined;
    }
  };

  onSubscribeStatus = subscribeReply => {
    if (subscribeReply.successful) {
      this.sendChatRequest();
    }
  };

  addMessage = ({ text: message, utcTime: messageUtcTime, index, from }) => {
    const utcTime = new Date(messageUtcTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    const name = from.nickname && from.nickname.replace(/^\s*/, "");

    const messageObject = {
      message,
      utcTime,
      type: from.type,
      id: nanoid(),
      name
    };
    this.chatMessages.push(messageObject);
    this.messagesCallback([...this.chatMessages]);
  };

  errorHandler = receivedData => {
    return new Promise((resolve, reject) => {
      if (has(receivedData, "errors")) {
        reject(receivedData.errors);
      } else {
        resolve(receivedData);
      }
    });
  };

  onReceiveData = (message, callBack = () => {}) => {
    const dataFromServer = message.data;
   this.lastPosition = dataFromServer.nextPosition;
    if (has(dataFromServer, "messages")) {
      dataFromServer.messages.forEach(message => {
        if (has(agentEvents, message.text) && message.from.type === UserTypes.Agent) {
          this.eventsCallback(message.text);
        } else {
          switch (message.type) {
            case ChatOperationTypes.IncomingMessage: {
              if (message.text.includes(INVALID_SESSION) && message.from.type !== UserTypes.Client) {
                GenesysChat.getInstance().triggerDisconnectEvent();
                this.failureCallback(INVALID_SESSION)
                break;
              }

              this.addMessage({ ...message });
              break;
            }
            case ChatOperationTypes.ParticipantJoined: {
              if (message.from.type === UserTypes.Agent) {
                this.addMessage({
                  ...message,
                  text: "Agent " + message.from.nickname + " joined the chat"
                });
              }
              if (message.from.type === UserTypes.Client) {
                this.addMessage({
                  ...message,
                  from: { type: UserTypes.External },
                  text: message.from.nickname + " has joined the Chat"
                });
                this.addMessage({
                  ...message,
                  from: { type: UserTypes.External },
                  index: 0,
                  text: "Welcome to RAKBANK live chat!"
                });
                this.connectedCallback();
              }

              break;
            }
            case ChatOperationTypes.ParticipantLeft: {
              if (message.from.type === UserTypes.Agent) {
                const updatedMessage = {
                  text:
                    "The chat agent left the room. Thank you for chatting with Rakbank.\nHave a nice day!"
                };

                this.addMessage({ ...message, ...updatedMessage });
                this.agentLeftEvent(true);
              }
              break;
            }
            case ChatOperationTypes.TypingStarted:
            case ChatOperationTypes.TypingStopped: {
              if (message.from.type === UserTypes.Agent) {
                this.onTypingEvents(message.type === ChatOperationTypes.TypingStarted);
              }
              break;
            }
          }
        }
      });
    } else {
      switch (dataFromServer.operation) {
        case ChatOperationTypes.SendMessage:
        case ChatOperationTypes.RequestChat: {
          this.chatMessages.push(dataFromServer);
          callBack([...this.chatMessages]);
          break;
        }
      }
    }
  };

  /**
   * Sends chat message
   * @param message - message to send
   */

  sendChatMessage = message => {
     
    return new Promise((resolve, reject) => {
      const sendMessageData = {
        operation: ChatOperationTypes.SendMessage,
        message,
        secureKey: this.secureKey
      };
      this.cometD.publish(this.config.channel, sendMessageData, publishResponse => {
        if (publishResponse.successful) {
          resolve(publishResponse);
        } else {
          reject();
        }
      });
    });
  };

  userStartedTyping = (userName = "User") => {
    const sendMessageData = {
      operation: ChatOperationTypes.ClientStartTyping,
      message: userName + " started typing",
      secureKey: this.secureKey
    };
    this.cometD.publish(this.config.channel, sendMessageData);
  };

  userStopedTyping = (userName = "User") => {
    const sendMessageData = {
      operation: ChatOperationTypes.ClientStopTyping,
      message: userName + " stoped typing",
      secureKey: this.secureKey
    };
    this.cometD.publish(this.config.channel, sendMessageData);
  };

  /**
   * This method will triggers disconnect event.
   * @param forceDisconnect - boolean denote when user logout session.
   */

  triggerDisconnectEvent = () => {
    if (this.cometD.getStatus() === CONNECTED_STATUS) {
      const disconnectData = {
        operation: ChatOperationTypes.ChatDisconnect,
        secureKey: this.secureKey
      };
      this.cometD.publish(this.config.channel, disconnectData);
      this.unSubscribe();
      this.cometD.disconnect();
    }

    GenesysChat.chatInstance = undefined;
  };

  requestNotifications = () => {
    const requestNotificationData = {
      operation: ChatOperationTypes.SyncNotifications,
      secureKey: this.secureKey,
      transcriptPosition: parseInt(this.lastPosition)
    };
    this.cometD.publish(this.config.channel, requestNotificationData);
  };

  updateNickName = nickName => {
    const updateNicknameData = {
      operation: ChatOperationTypes.UpdateNickName,
      nickname: nickName,
      secureKey: this.secureKey
    };
    this.cometD.publish(this.config.channel, updateNicknameData);
  };

  setOnTypingEventsHandler = handler => {
    this.onTypingEvents = handler;
  };

  setOnAgentLeftEventHandler = handler => {
    this.agentLeftEvent = handler;
  };
}
