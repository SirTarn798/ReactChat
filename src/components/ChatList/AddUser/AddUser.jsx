import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import "./AddUser.css";
import { db } from "../../../lib/firebase";
import { useState } from "react";
import useUserStore from "../../../lib/userStore";

function AddUser() {
  const { currentUser } = useUserStore();
  const [user, setUser] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          isSeen: true,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          isSeen: true,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchUser = async (e) => {
    e.preventDefault();
    const formDate = new FormData(e.target);
    const username = formDate.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot) {
        setUser(querySnapshot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearchUser}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="foundUser">
          <img src={user?.pfp} />
          <p>{user?.username}</p>
          <button
            onClick={handleAddUser}
            disabled={user?.username === currentUser.username ? true : false}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
