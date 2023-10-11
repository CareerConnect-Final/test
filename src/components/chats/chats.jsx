import { PrettyChatWindow } from "react-chat-engine-pretty";
import "./chats.css";
import {
  ChatEngine,
  ChatList,
  ChatCard,
  NewChatForm,
  ChatFeed,
  ChatHeader,
  IceBreaker,
  MessageBubble,
  IsTyping,
  NewMessageForm,
  ChatSettings,
  ChatSettingsTop,
  PeopleSettings,
  PhotosSettings,
  OptionsSettings,
} from "react-chat-engine";
import { MultiChatWindow } from "react-chat-engine-advanced";
import "./chat.scss";
import cookie from "react-cookies";

const ChatsPage = (props) => {
  const user = cookie.load("user");
  const pass = cookie.load("p");
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <PrettyChatWindow
        projectId={"6ec94824-7225-489e-9eba-c10ba4aeb324"}
        username={user?.username} // adam
        secret={pass} // pass1234
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default ChatsPage;
