import "./UserChat.css";
import useChatStore from "../../../lib/chatStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useUserStore from "../../../lib/userStore";

function UserChat(props) {
  const { changeChat } = useChatStore();
  const chats = props.chats
  const {currentUser} = useUserStore();

  async function handleSelectChat(chat) {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="userChat"
      key={props.uniqueKey}
      onClick={()=>{handleSelectChat(props.chat)}}
    >
      <img src={props.pfp} />
      <div className="chatDetail">
        <p className="name">{props.username}</p>
        <p className="lastMsg">{props.lastMessage}</p>
      </div>
      <img src="/chat.png" style={{display: props.isSeen ? "none" : "block"}}/>
    </div>
  );
}

export default UserChat;
