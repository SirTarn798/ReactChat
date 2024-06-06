import useUserStore from "../../../lib/userStore";
import "./Message.css";

function Message(props) {

  const {currentUser} = useUserStore();

  const message = props.message;
  if(props.image) {
    return <div className={props.sender === currentUser.id ? "myImage" : "othersImage"}>
      <img src={props.image} className="imageMessage"/>
    </div>;
  }
  return <div className={props.sender === currentUser.id ? "myMsg" : "othersMsg"}>{message}</div>;
}

export default Message;
