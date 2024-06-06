import { useState } from "react";
import "./Login.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import upload from "../../lib/upload";

function Login() {
  const [error, setError] = useState("");
  const [regisStatus, setRegisStatus] = useState("neutral");
  const [loginStatus, setLoginStatus] = useState("neutral");

  const [regisEmail, setRegisEmail] = useState("");
  const [regisUsername, setRegisUsername] = useState("");
  const [regisPassword, setRegisPassword] = useState("");

  const regisEmailHandle = (e) => {
    setRegisEmail(e.target.value);
  };

  const regisUsernameHandle = (e) => {
    setRegisUsername(e.target.value);
  };

  const regisPasswordHandle = (e) => {
    setRegisPassword(e.target.value);
  };

  const [pfp, setPfp] = useState({
    file: null,
    url: null,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, username, password } = Object.fromEntries(formData);

    try {
      setRegisStatus("loading");
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("Please select other usernames!");
      }
      if (email === "" || username === "" || password === "") {
        throw new Error("All fields are required");
      }
      if (pfp.file === null) {
        throw new Error("Please upload profile image.");
      }
      const imgUrl = await upload(pfp.file);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        username: username,
        email: email,
        pfp: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      setRegisStatus("success");
    } catch (err) {
      setError(err.message);
      setRegisStatus("error");
    } finally {
      setRegisEmail("");
      setRegisUsername("");
      setRegisPassword("");
      setPfp(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus("loading");
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      if (email === "" || password === "") {
        throw new Error("All fields are required");
      }
      await signInWithEmailAndPassword(auth, email, password);
      setLoginStatus("success");
    } catch (err) {
      setError(err.message);
      setLoginStatus("error");
    } finally {
    }
  };

  const handlePfp = (e) => {
    if (e.target.files[0]) {
      setPfp({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="loginRegister">
      <div className="item">
        <h2>Welcome back, Please Sign in</h2>
        <form className="item" onSubmit={handleLogin}>
          <input type="text" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button
            disabled={
              loginStatus === "loading" ||
              regisStatus === "loading" ||
              loginStatus === "success"
                ? true
                : false
            }
          >
            Login
          </button>
        </form>
        <p
          className="errorMessage"
          style={{ display: loginStatus === "error" ? "block" : "none" }}
        >
          {error}
        </p>
        <p
          className="successMessage"
          style={{ display: loginStatus === "success" ? "block" : "none" }}
        >
          Login success! We are brining you in!
        </p>

        <div
          class="loader"
          style={{ display: loginStatus === "loading" ? "flex" : "none" }}
        ></div>
      </div>
      <div className="seperator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <div className="choosePfp">
          <img src={pfp?.url || "/user.png"} />
          <label htmlFor="choosePfp">Upload an Image</label>
          <input
            type="file"
            id="choosePfp"
            style={{ display: "none" }}
            onChange={handlePfp}
          ></input>
        </div>
        <form className="item" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={regisEmail}
            onChange={regisEmailHandle}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={regisUsername}
            onChange={regisUsernameHandle}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={regisPassword}
            onChange={regisPasswordHandle}
          />
          <button
            disabled={
              regisStatus === "loading" ||
              loginStatus === "loading" ||
              loginStatus === "success"
                ? true
                : false
            }
          >
            Sign Up
          </button>
        </form>
        <p
          className="successMessage"
          style={{ display: regisStatus === "success" ? "block" : "none" }}
        >
          Account is created. Please login to continue.
        </p>
        <p
          className="errorMessage"
          style={{ display: regisStatus === "error" ? "block" : "none" }}
        >
          {error}
        </p>
        <div
          class="loader"
          style={{ display: regisStatus === "loading" ? "flex" : "none" }}
        ></div>
      </div>
    </div>
  );
}

export default Login;
