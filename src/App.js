import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <Chat
        config={{
          channel: "/service/chatV2/digital-chat",
          channelId: "WBA",
          apiPath: "https://uatrmt.rakbankonline.ae/RMTCHAT/cometd/",
        }}
      />
    </div>
  );
}

export default App;
