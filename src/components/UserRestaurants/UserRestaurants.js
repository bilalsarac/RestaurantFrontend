import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GetWithAuth } from "../../services/HttpService";
import Spinner from 'react-bootstrap/Spinner';
import Restaurant from "../Restaurant/Restaurant";

function RestaurantPopUp(props) {
  const { isOpen, restaurantId, setIsOpen } = props;
  const [open, setOpen] = useState(isOpen);
  const [restaurant, setRestaurant] = useState();

  const getRestaurant = () => {
    GetWithAuth("/restaurants/" + restaurantId)
      .then((res) => res.json())
      .then((result) => {
        setRestaurant(result);
        
      })
      .catch((err) => console.log("error"));
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    getRestaurant();
  }, [restaurantId])

  return (
    <Modal
      show={open}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {restaurant ? (
          <Restaurant
          key={restaurant.id}
          restaurantId={restaurant.id}
          userId={restaurant.userId}
          name={restaurant.name}
          category={restaurant.category}
          photo={restaurant.photoUrl}
          date={restaurant.createDate}
          address= {restaurant.address}
          priceScore= {restaurant.priceScore}
          serviceScore={restaurant.serviceScore}
          tasteScore= {restaurant.tasteScore}
        
          />
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function UserRestaurant(props) {
  const { userId } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [isOpen, setIsOpen] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const [refresh, setRefresh] = useState();

  const handleNotification = (postId) => {
    setSelectedPost(postId);
    setIsOpen(true);
  };


  useEffect(() => {
    
  }, []);

  return (
    <>
      <Table striped bordered hover className="m-4">
       
        
      </Table>
      {isOpen ? <RestaurantPopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen} /> : ""}
    </>
  );
}

const buttonStyle = {
  pointerEvents: 'none',
};

export default UserRestaurant;