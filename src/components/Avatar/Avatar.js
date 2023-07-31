import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Card, Form,Modal,Button } from "react-bootstrap";
import { useEffect,useState } from "react";
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
      />
      <div className="card-body">
        <h5 className="card-title">{email}</h5>
        <p className="card-text">User Info</p>
        <span>User ID: {userId}</span>
     

        <Modal show={open} onHide={handleClose}>
          <Container>
            <Row>
              <Col>
                <h2>Choose Your Avatar</h2>
                <Card className="p-3">
                  <Form>
                  
                  </Form>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
            
              </Col>
            </Row>
          </Container>
        </Modal>
      </div>
    </div>
  );
}

export default Avatar;