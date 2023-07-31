import React from "react";
import { Button, Card, Spinner,Modal } from "react-bootstrap";
import { useParams,Link } from "react-router-dom";
import CommentForm from "../Comment/CommentForm";
import Comment from "../Comment/Comment";
import { useState,useRef, useEffect } from "react";
import { DeleteWithAuth, GetWithoutAuth } from "../../services/HttpService";
import EditForm from "../EditForm/EditForm";
import './Restaurant.css'


function Restaurant(props) {
  const { refreshRestaurants, restaurantId, userId, name, category, photo, date,address } = props;
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const isInitialMount = useRef(true);
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [tasteScore,setTasteScore] = useState(0);
  const [serviceScore,setServiceScore] = useState(0);
  const [priceScore,setPriceScore] = useState(0);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  const handleEditRestaurant = () => {
    console.log(restaurantId)
    setShowEditForm(true);
  };

  let disabled = (localStorage.getItem("currentUser") == null) || (localStorage.getItem("currentUser") == "null") ? true : false;

  const setCommentRefresh = () => {
    setRefresh(true);
  }
  const handleExpandClick = () => {
    console.log(restaurantId)
    setExpanded(!expanded);
    refreshComments();
    console.log(commentList);
    console.log(photo)
  };
  const getRestaurantAverage = ()=>{
    GetWithoutAuth("/ratings/restaurantratings/"+restaurantId)
    .then((res)=>res.json())
    .then((result)=>{
      setTasteScore(result.tasteScore)
      setPriceScore(result.priceScore)
      setServiceScore(result.serviceScore)
      console.log(typeof result.serviceScore)
      console.log(result.serviceScore)
      refreshRestaurants();
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const refreshComments = () => {
    fetch("/comments?restaurantId=" + restaurantId)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCommentList(result)
        },
        (error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        }
      )

    setRefresh(false)
  }



  const handleDeleteRestaurant = () => {
    DeleteWithAuth("/restaurants/"+ restaurantId)
      .then(() => {
        refreshRestaurants()

      })
      .catch((err) => {
        console.log(err)
      })

  }



 

  useEffect(() => {
    getRestaurantAverage()
    if (isInitialMount.current){
      isInitialMount.current = false;
      console.log(typeof userId)
      console.log("USERİD" +userId)
      console.log(localStorage.getItem("role"))
  }
    else
      refreshComments();
  }, [refresh])




  if (!props.isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  } else {
    return (
      
         <Card className="m-5">
           <div className="row">
            <div className="col-3">
           <Link
                  to={{ pathname: "/restaurants/" + restaurantId }}
                >
            <Card.Img src={photo} className="restaurant-img m-2" />
            </Link>
            </div>
       

      
        <Card.Body className="col-9">
         
              <div>
              <Card.Title><span style={{color:"orange"}}>Restaurant Name:</span> {name}</Card.Title>
              <p><span style={{color:"orange"}}>Category: </span>{category}</p>
              <p><span style={{color:"orange"}}>Restaurant Adrress: </span>{address}</p>

                  
                 
              </div  > 
              <div className="d-flex justify-content-between align-items-center "  >
              <i
                      className={"bi bi-bus-front ps-5"}
                      style={{ cursor: "pointer" }}
                      onClick={null}
                    > Service Avarage { serviceScore  ? <span style={{color:"brown", fontWeight:"bold"}}>{serviceScore}</span>:<span style={{color:"brown", fontWeight:"bold"}}>0.0</span>}</i>
                     <i
                      className={"bi bi-cup-straw ps-3"}
                      style={{ cursor: "pointer" }}
                      onClick={null}
                    > Taste Avarage {serviceScore ? <span style={{color:"brown", fontWeight:"bold"}}>{tasteScore}</span>:<span style={{color:"brown", fontWeight:"bold"}}>0.0</span>}</i>
                     <i
                      className={"bi bi-cash-coin pe-5"}
                      style={{ cursor: "pointer" }}
                      onClick={null}
                    > Price Avarage {serviceScore  ? <span style={{color:"brown", fontWeight:"bold"}}>{priceScore}</span>:<span style={{color:"brown", fontWeight:"bold"}}>0.0</span>}</i>
              </div>
            
        

          <p className="card-text text-start ps-3">{}</p>

          <div className="d-flex justify-content-between align-items-center">
            {disabled ? (
              <div>
                <span>
                  <i
                    
                    style={{ cursor: "pointer", pointerEvents: "none" }}
                    onClick={null}
                  ></i>{" "}
                 
                </span>{" "}
              </div>
            ) : (
              <div>
                
                
                
                {userId == localStorage.getItem("currentUser") & localStorage.getItem("role") == "senior" ? (
                  <span>
                    <i
                      className={"bi bi-pencil-square ps-3"}
                      style={{ cursor: "pointer" }}
                      onClick={handleEditRestaurant}
                    ></i>
                  </span>
                ):null}

                { localStorage.getItem("role") == "admin" ? (
                  <span>
                    <i
                      className={"bi bi-trash ps-3"}
                      style={{ cursor: "pointer" }}
                      onClick={handleDeleteRestaurant}
                    ></i>
                  </span>
                ):null}
                </div>
             
            )}
            
            
             
            {showEditForm && (
        <EditForm
          userId={localStorage.getItem("currentUser")}
          userName={localStorage.getItem("userName")}
          restaurantId={restaurantId}
          refreshPosts={refreshRestaurants}
          handleClose={() => setShowEditForm(false)}
        />
      )}
            <i
              className="bi bi-chat pe-3"
              style={{ cursor: "pointer" }}
              onClick={handleExpandClick}
            >
              {" "}
              Comments
            </i>
          </div>

          {expanded && (
            <div className="mt-3 expand-content">
              {error ? (
                "error"
              ) : isLoaded ? (
                commentList.map((comment) => (
                  <Comment
                    key={comment.commentId}
                    userId={comment.userId}
                    restaurantId={restaurantId}
                    text={comment.text}
                    refreshComments={refreshComments}

                    
                  />
                ))
              ) : (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              {disabled ? (
                ""
              ) : (
                //condition required for one comment per resta
                <CommentForm
                  userId={localStorage.getItem("currentUser")}
                 
                  restaurantId={restaurantId}
                  setCommentRefresh={setCommentRefresh}
                />
              )}
            </div>
          )}
        </Card.Body>
      </div>
    </Card>
      
    );
  }
}

export default Restaurant;