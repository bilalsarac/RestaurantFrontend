import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteWithAuth, GetWithAuth, PutWithAuth } from '../../services/HttpService';
import './Comment.css'
import { Button, Modal, Form, } from 'react-bootstrap';
function Comment(props) {
  const { text, userId, email, userPhoto, restaurantId, refreshComments, key } = props;

  const [user, setUser] = useState();
  const [photoUrl, setPhotoUrl] = useState();
  const [editedText, setEditedText] = useState(text);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getUserPhoto = () => {
    GetWithAuth("/users/" + userId)
      .then((res) => res.json())
      .then((result => {
        console.log(userId)
        setPhotoUrl(result.photoUrl)
        console.log("photo urrrll" + result.photoUrl)
      }))
      .catch((err) => console.log(err))
  }



  const handleCommentDelete = () => {
    DeleteWithAuth("/comments/" + userId + "/" + restaurantId)
      .then(() => {
        refreshComments()

      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleCommentEdit = () => {
    PutWithAuth("comments/" + userId + "/" + restaurantId, {
      text: editedText,
    })
      .then(() => {
        handleClose()
        refreshComments()
      })
      .catch((err) => {
        console.log(err)
      })
  }


  useEffect(() => {

    getUserPhoto()
  }, [])


  return (
    <div class="container border border-gray rounded">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Text</Form.Label>
              <Form.Control
                type="text"
                value={editedText}
                autoFocus
                onChange={(e) => setEditedText(e.target.value)}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCommentEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div class="row">
        <div class="col-md-1">
          <Link style={{ textDecoration: 'none' }} className='avatar bg-orange text-white' to={{ pathname: '/users/' + userId }}>
            <div><img src={photoUrl} className='avatar' /></div>
          </Link>
        </div>
        <div className="col-md-10 d-flex align-items-center">
          <p className="text-start m-2">{text}</p>
        </div>
        <div className="col-md-1 d-flex align-items-center justify-content-end">
          {localStorage.getItem("currentUser") == userId ? <>
            <i
              className={"bi bi-pencil ms-3"}
              style={{ cursor: "pointer" }}
              onClick={handleShow}
            ></i>
            <i
              className={"bi bi-trash ms-3"}
              style={{ cursor: "pointer" }}
              onClick={handleCommentDelete}
            ></i>  </> : null}

        </div>
      </div>
    </div>
  );
}

export default Comment;