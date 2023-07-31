import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PostWithAuth } from '../../services/HttpService';
import { Container,Button,Form,Modal } from 'react-bootstrap';

function RestaurantForm(props) {
    const { userId, userName, refreshRestaurants } = props;

    const currentUser = localStorage.getItem("currentUser");
    const currentUserAsInt = parseInt(currentUser, 10);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isSent, setIsSent] = useState(false);

   
   
    const [formData, setFormData] = useState({
      photoUrl: '',
      name: '',
      category: '',
      address: '',
      userId: currentUserAsInt
    });
  
   
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
  
    const handleSaveRestaurant = () => {
        const newRestaurantData = {
          photoUrl: formData.photoUrl,
          name: formData.name,
          category: formData.category,
          address: formData.address,
          userId: currentUserAsInt
        };   
        console.log(formData.photoUrl)
        console.log(formData.category)
        console.log(formData.address)
        console.log(formData.userId)
        console.log(formData.name)
       
        PostWithAuth("/restaurants", newRestaurantData)
        .then()
        .then( () => {
         
            console.log("userID"+localStorage.getItem("currentUser"))
            refreshRestaurants();
            handleClose()
        })
          .catch((error) => {
          
            console.error(error);
          });
      };



    return (
       <Container>
        {localStorage.getItem("role") == "senior" ?<Button variant="dark" className='m-3' onClick={handleShow}>Add Restaurant</Button> : null}
        
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="text"
                name='photoUrl'
                value={formData.photoUrl}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.restaurantName}
                onChange={handleInputChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveRestaurant}>
            Save Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
       </Container>
    );



}

export default RestaurantForm;