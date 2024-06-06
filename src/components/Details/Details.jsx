import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import useChatStore from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import useUserStore from "../../lib/userStore";
import "./Details.css";

function Details() {

  const {user, isReceiverBlocked, isCurrentUserBlocked, changeBlock} = useChatStore();
  const {currentUser} = useUserStore();

  const handleLogout = (e) => {
    auth.signOut();
  }

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="details">
      <div className="detailsUserDetail">
        <img src={user.pfp}/>
        <p className="name">{user.username}</p>
        <p className="userStatus">Working on this feature.</p>
      </div>
      <div className="photoAndVideo">
        <p>Photos & Video</p>
        <div className="media">
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
          <img src="/mediaExample.jpg" />
        </div>
      </div>
      <div className="buttons">
      <button onClick={handleBlock} className="blockButton" disabled={true}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
            
        </button>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Details;
