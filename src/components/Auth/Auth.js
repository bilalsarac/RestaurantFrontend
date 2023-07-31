import { React, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PostWithoutAuth } from "../../services/HttpService";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  let navigate = useNavigate();

  const handleEmail = (value) => {
    setEmail(value);
    console.log(email)
    setErrorAuth(false)
  };

  const handlePassword = (value) => {
    setPassword(value);
    console.log(password)
    setErrorAuth(false)
  };

  const sendRequest = (path) => {
    PostWithoutAuth(("/auth/" + path), {
      email: email,
      password: password,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result" + result.userId)
        console.log("results")
        console.log(result)
        localStorage.setItem("tokenKey", result.accessToken);
        localStorage.setItem("refreshKey", result.refreshToken);
        localStorage.setItem("currentUser", result.userId);
        console.log(result.userId)
        localStorage.setItem("email", email);
        localStorage.setItem("role", result.role)

        console.log("curent user" + localStorage.getItem("currentUser"))
        if ((localStorage.getItem("currentUser") == null) || (localStorage.getItem("currentUser").toString() === "null"
          || (localStorage.getItem("currentUser") == "undefined"))) {
          console.log(localStorage.getItem("currentUser"))
          console.log("typeof current" + typeof localStorage.getItem("currentUser"))
          localStorage.setItem("currentUser", null);
          localStorage.setItem("role", null)
          console.log("if state")
          setErrorAuth(true)
          setEmail('')
          setPassword('')
         
          console.log("errorAuth true")
          navigate("/auth")
        } else {
          console.log("else state")

          navigate("/")
        }



      })
      .catch((err) => console.log(err));
  };

  const handleButton = (path) => {

    if (email.trim() === "" || password.trim() === "") {
      setShowAlert(true);
      
      return;
    }

    console.log(path)
    sendRequest(path);
    setEmail("");
    setPassword("");
    console.log("logged")
    console.log(localStorage);
    console.log("handlebutton" + localStorage.getItem("currentUser"))
    // navigate("/")


  };

  return (<>
    <Form className="mx-auto text-center col-md-2">
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" onChange={(e) => handleEmail(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" onChange={(e) => handlePassword(e.target.value)} />
      </Form.Group>

      {errorAuth ? <Alert variant="danger">Invalid Credentials</Alert> : ""}
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Please enter a valid Email and password.
        </Alert>
      )}

      <Button

        variant="dark"
        style={{
          marginTop: "20px",
          color: "white",
        }}
        onClick={() => handleButton("register")}
      >
        Register
      </Button>

      <p style={{ marginTop: "20px" }}>Are you already registered?</p>

      <Button

        variant="dark"
        style={{
          color: "white",
        }}
        onClick={() => handleButton("login")}
      >
        Login
      </Button>
    </Form>

  </>
  );
}

export default Auth;