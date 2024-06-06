import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import Message from "./Message/Message";
import EmojiPicker from "emoji-picker-react";
import useUserStore from "../../lib/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import useChatStore from "../../lib/chatStore";
import upload from "../../lib/upload";

function Chat() {
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const [chat, setChat] = useState();
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const [emoji, setEmoji] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    console.log(chat)
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleMessageSent = async (e) => {
    e.preventDefault();
    if (text === "") {
      return;
    }
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });
      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setText("");
      setImage({
        file: null,
        url: "",
      });
    }
  };

  const handleImage = async (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage({
        file: selectedFile,
        url: imageUrl,
      });

      let imgUrl = null;
      try {
        console.log("Uploading...");
        imgUrl = await upload(selectedFile);
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
            ...(imgUrl && { image: imgUrl }),
          }),
        });
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
  };

  return (
    <div className="chat">
      <div className="topTab">
        <div className="chatUserDetail">
          <img src={user.pfp} />
          <div className="userDetailText">
            <p className="name">{user.username}</p>
            <p className="userStatus">Working on this feture.</p>
          </div>
        </div>
        <div className="periperipheralButtonTab">
          <img className="peripheralButton" src="/telephone-call.png" />
          <img className="peripheralButton" src="/video.png" />
          <img className="peripheralButton" src="/info.png" />
        </div>
      </div>
      <div className="chatSection">
        {console.log(chat?.messages)}
        {chat?.messages.map((message) => (
          <Message
            image={message.image}
            message={message.text}
            sender={message.senderId}
          />
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="sendMsgSection">
        <label htmlFor="file">
          <img src="/gallery.png" className="peripheralButton" alt="" />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleImage}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <img className="peripheralButton" src="/camera.png" />
        <img className="peripheralButton" src="/microphone.png" />
        <form onSubmit={handleMessageSent}>
          <input
            type="text"
            name="sentMessage"
            placeholder="Type a message..."
            onChange={(e) => setText(e.target.value)}
            value={text}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <div className="emoji">
            <img
              className="peripheralButton"
              src="/happy.png"
              onClick={() => setEmoji((prev) => !prev)}
            />
            <div className="picker">
              <EmojiPicker open={emoji} onEmojiClick={handleEmojiClick} />
            </div>
          </div>
          <button className="sendMsgButton" disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
