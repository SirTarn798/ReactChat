import { useEffect, useState } from "react";
import ChatList from "./components/ChatList/ChatList";
import Chat from "./components/Chat/Chat";
import Details from "./components/Details/Details";
import Login from "./components/Login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import useUserStore from "./lib/userStore";
import useChatStore from "./lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if(isLoading) {
    return (
      <div className="loading">
        
      </div>
    )
  }

  return (
    <div className="container">
      {currentUser ? (
        <>
          <ChatList />
          {chatId && <Chat />}
          {chatId && <Details />}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
