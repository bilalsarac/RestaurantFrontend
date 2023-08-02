import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GetWithAuth, PutWithAuth } from "../../services/HttpService";

function EditForm(props) {
  const { userId, restaurantId, refreshPosts, handleClose } = props;
  const [restaurantData, setRestaurantData] = useState({});


  const [formData, setFormData] = useState({
    photoUrl: '',
    name: '',
    category: '',
    address: '',
    userId: userId
  });

  const getRestaurant = () => {
    GetWithAuth("/restaurants/" + restaurantId)
      .then((res) => res.json())
      .then((result) => {
        setRestaurantData(result);
        setFormData({
          photoUrl: result.photoUrl,
          name: result.name,
          category: result.category,
          address: result.address,
          userId: userId
        });

      })
      .catch((error) => {
        console.error(error);

      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveRestaurant = () => {
    const updatedRestaurantData = {
      photoUrl: formData.photoUrl,
      name: formData.name,
      category: formData.category,
      address: formData.address,
      userId: formData.userId
    };

    PutWithAuth("/restaurants/" + restaurantId, updatedRestaurantData)
      .then(() => {
        refreshPosts();
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getRestaurant();
  }, []);

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
            <Form.Label>Photo URL</Form.Label>
            <Form.Control
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
  );
}

export default EditForm;
