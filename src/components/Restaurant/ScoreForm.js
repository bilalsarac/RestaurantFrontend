
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { DeleteWithAuth, GetWithAuth, PostWithAuth,PutWithAuth } from '../../services/HttpService';

const ScoreForm = ({ handleClose, restaurantId ,setRefresh }) => {
 
  const [tasteScore, setTasteScore] = useState(5);
  const [serviceScore, setServiceScore] = useState(5);
  const [priceScore, setPriceScore] = useState(5);
  const [error,setError] = useState(false);
  const [show,setShow] = useState(false);
  const [alreadyEvaluated,setAlreadyEvaluated] = useState(false);
  const [popup, setPopup] = useState(false);
 
  const handleClosePopUp = () => setShow(false);
  const handleShowPopUp = () => setShow(true);

 
  const getScore = () => {
    GetWithAuth("/ratings/"+localStorage.getItem("currentUser")+"/"+restaurantId)
    .then((res) => {
        
        if (res.ok) {
          res.json()
          .then((result)=>{
            setPriceScore(result.priceScore)
            setServiceScore(result.serviceScore)
            setTasteScore(result.tasteScore)
            setAlreadyEvaluated(true)
            console.log(serviceScore)
          })
        } else if (res.status === 500) {
           setPriceScore("nan")
           setServiceScore("nan")
           setTasteScore("nan")
        
        } else {
          console.error('Error submitting scores:', res.statusText);
          setShow(true);
        }
      })
      .catch((error) => {
        console.error('Error submitting scores:', error);
      });
  }

  const handleDelete = () =>{
    DeleteWithAuth("/ratings/"+localStorage.getItem("currentUser")+"/"+restaurantId)
    .then((res) => {
        setRefresh(true);
        if (res.ok) {
          
       
            setAlreadyEvaluated(false)
            console.log(serviceScore)
            handleClose();
            setPopup(true)
        } else if (res.status === 500) {
        
        } 
      })
    .catch((error) => {
        console.error('Error deleting scores:', error);
      });
  }


  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
        tasteScore: parseInt(tasteScore),
        serviceScore: parseInt(serviceScore),
        priceScore: parseInt(priceScore),
        
      };
      

      PostWithAuth("/ratings/"+localStorage.getItem("currentUser")+"/"+restaurantId, formData)
      .then((res) => {
        
        if (res.ok) {
            console.log(popup)
          console.log('Scores submitted successfully');
          handleClose();
          console.log(popup)
          handleShowPopUp()
          console.log(popup)
          setRefresh(true);
        } else if (res.status === 500) {
        
          PutWithAuth("/ratings/" + localStorage.getItem("currentUser") + "/" + restaurantId, formData)
            .then((putRes) => {
              if (putRes.ok) {
                console.log('Scores updated successfully');
                handleClose();
                setRefresh(true);
                console.log(popup)
                handleShowPopUp()
                console.log(popup)
              } else {
                console.error('Error updating scores:', putRes.statusText);
                setShow(true);
              }
            })
            .catch((error) => {
              console.error('Error updating scores:', error);
            });
        } else {
          console.error('Error submitting scores:', res.statusText);
          setShow(true);
        }
      })
      .catch((error) => {
        console.error('Error submitting scores:', error);
      });

    handleClose();
   
  };

  useEffect(()=>{
    getScore()
  },[])
  

  return (
    <> {popup ? ( 
        <Modal show={true} onHide={handleClosePopUp} >
               <Modal.Body>
       <p>Modal body text goes here.</p>
       </Modal.Body>
       </Modal>
 ) : null}
    <Modal show={true} onHide={handleClose}>

           
      <Modal.Header closeButton>
        <Modal.Title>Rate Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="tasteScore">
            <Form.Label>Taste</Form.Label>
            <p>Your Previous Rate: {tasteScore}</p>
            <div className="range-slider-container">
              <input
                type="range"
                min="1"
                max="10"
                value={tasteScore}
                onChange={(e) => setTasteScore(e.target.value)}
                step="1"
                required
              />
              <span className="range-slider-value">{tasteScore}</span>
            </div>
          </Form.Group>

          <Form.Group controlId="serviceScore">
            <Form.Label>Service</Form.Label>
            <p>Your Previous Rate: {serviceScore}</p>
            <div className="range-slider-container">
              <input
                type="range"
                min="1"
                max="10"
                value={serviceScore}
                onChange={(e) => setServiceScore(e.target.value)}
                step="1"
                required
              />
              <span className="range-slider-value">{serviceScore}</span>
            </div>
          </Form.Group>

          <Form.Group controlId="priceScore">
            <Form.Label>Price</Form.Label>
            <p>Your Previous Rate: {priceScore}</p>
            <div className="range-slider-container">
              <input
                type="range"
                min="1"
                max="10"
                value={priceScore}
                onChange={(e) => setPriceScore(e.target.value)}
                step="1"
                required
              />
              <span className="range-slider-value">{priceScore}</span>
            </div>
          </Form.Group>
            
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
        </Form>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default ScoreForm;
