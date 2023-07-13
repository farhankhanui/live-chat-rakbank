import "./App.css";
import { CometD } from "cometd";
import { useEffect } from "react";

function App() {
  var cometd = new CometD();
  useEffect(() => {
    // console.log(cometd)

    cometd.websocketEnabled = false;
    cometd.configure({
      url: "https://uatrmt.rakbankonline.ae/RMTCHAT/cometd/",
      logLevel: "debug",
    });
    cometd.handshake();

    cometd.channel = "/service/chatV2/digital-chat";
    cometd.subscribe(cometd.channel, function (message) {
      // console.log(this.processResponse(message))
      console.log(message);

      console.log(message?.data?.secureKey);

      //setSecureKey(message?.data?.secureKey)

      // Handle the received message
      //console.log('Received message on channel ' + channel + ':', message);
    });
  });

  const startChat = () => {
    var requestChatData = {
      operation: "requestChat",
      firstName: "Farhan",
      lastName: "Khan",
      subject: "Test CometD Chat v2",
      userData: {
        InitiatedCustomerName: "Farhan Khan",
        notify_by: "cometd",
        interests: "javascript",
        EmailAddress: "mustufa_zaki@hotmail.com",
        ChannelID: "WBA",
        message: "User joined the session",
      },
      auth: {
        username: "genesys",
        password: "genesys",
      },
    };
    cometd.publish("/service/chatV2/digital-chat", requestChatData);
  };
  const sendMessage = () => {
    var sendData = {
      operation: "sendMessage",
      message: "Actual text message what we need to send. ",
      secureKey: "IyQ0KAQRAEQACRUdE191XgkPCA=="
       
    };
    // console.log(secureKey)

    console.log(cometd.getStatus())
    cometd.publish("/service/chatV2/digital-chat", sendData);
  };
  const updateUserData = () => {
    let updateData = {
      operation: "updateData",
      secureKey: "IyQ0KAQRAEQACRUdE191XgkPCA==",
      userData: {
        IsAuth: false,
        AuthenticatedCustomerName: "Farhan", 
        LastName: "Khan",
        AuthenticatedCustomerMobile: "123456789",
        CIF: "cifId",
        FinalAuthenticationStatus: true,
        chatAuthenticatedNumber: "",
        FinalAuthenticationDateTime: "",
        EmailAddress: "mustufa_zaki@hotmail.com",
      },
    };
    cometd.publish("/service/chatV2/digital-chat", updateData);
  };

  return (
    <div className="App">
      <button onClick={startChat}>Start Chat</button>
      <button onClick={updateUserData}>Update User Data</button>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
