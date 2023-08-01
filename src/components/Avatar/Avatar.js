import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Card, Form, Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";
function Avatar(props) {

  const { photo, userId, email, getUser } = props;
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role")
  const param = useParams();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

  };

  useEffect(() => {

    getUser()
  }, [param.userId])

  return (
    <div className="card m-4" style={{ width: "18rem" }}>
      <img
        className="card-img-top rounded-circle p-1"
        src={photo}
        alt="Profile image "
        style={{ height: "16rem" }}
      />
      <div className="card-body">
        <p className="card-text" style={{ color: "orangered" }}>User Info</p>
        <h5 className="card-title">{email}</h5>
        <span>User ID: {userId}</span>
      </div>
    </div>
  );
}

export default Avatar;