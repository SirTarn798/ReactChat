import "./ChatList.css";
import UserChat from "./Chat/UserChat";
import { useEffect, useState } from "react";
import AddUser from "./AddUser/AddUser";
import useUserStore from "../../lib/userStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

function ChatList() {
  const { currentUser } = useUserStore();
  const [addNewUser, setAddNewUser] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  return (
    <div className="chatList">
      <div className="userDetail">
        <img className="userIcon" src={currentUser.pfp} />
        <p>{currentUser.username}</p>
        <div className="peripheralButtonTab">
          <img className="peripheralButton" src="/options.png" />
          <img className="peripheralButton" src="/video.png" />
          <img className="peripheralButton" src="/settings.png" />
        </div>
      </div>
      <div>
        <form className="addNewUser">
          <input
            className="searchChat"
            type="text"
            name="username"
            placeholder="Username"
          />
          <img
            src={addNewUser ? "/minus-sign.png" : "add.png"}
            onClick={() => setAddNewUser((prev) => !prev)}
          />
        </form>
      </div>
      <div className="list">
        {chats.map((chat) => {
          return <UserChat lastMessage={chat.lastMessage} uniqueKey={chat.chatId} username={chat.user.username} pfp={chat.user.pfp} chat={chat} isSeen={chat.isSeen} chats={chats}/>;
        })}
      </div>
      {addNewUser && <AddUser />}
    </div>
  );
}

export default ChatList;
