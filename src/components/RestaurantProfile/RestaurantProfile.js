import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";
import { Alert, Spinner, Card } from "react-bootstrap";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";
import EditForm from "../EditForm/EditForm";
import { GetWithoutAuth, DeleteWithAuth } from "../../services/HttpService";
import ScoreForm from "../Restaurant/ScoreForm";
import { useNavigate } from "react-router-dom";

function RestaurantProfile() {
  let userId = localStorage.getItem("currentUser");
  let disabled = (localStorage.getItem("currentUser") == null) || (localStorage.getItem("currentUser") == "null") ? true : false;
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

  const [tasteScore, setTasteScore] = useState(0);
  const [serviceScore, setServiceScore] = useState(0);
  const [priceScore, setPriceScore] = useState(0);
  const roundedTasteScore = parseFloat(tasteScore).toFixed(1);
  const roundedServiceScore = parseFloat(serviceScore).toFixed(1);
  const roundedPriceScore = parseFloat(priceScore).toFixed(1);
  const [restaurantList, setRestaurantList] = useState([]);


  const refreshRestaurants = () => {
    fetch("/restaurants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurantList(data);
        setIsLoaded(true);
      })
      .catch((error) => {
        setError(true);
      });

    setRefresh(false);
  };


  const setCommentRefresh = () => {
    setRefresh(true);
  }

  const handleEditRestaurant = () => {

    setShowEditForm(true);
  };
  const handleDeleteRestaurant = () => {
    DeleteWithAuth("/restaurants/" + restaurantId)
      .then(() => {

        refreshRestaurants()
        navigate("/")

      })
      .catch((err) => {
        console.log(err)
      })

  }
  const handleExpandClick = () => {

    setExpanded(!expanded);
    refreshComments();

  };

  const calculateAverage = (ratings) => {
    const totalTaste = ratings.reduce((sum, rating) => sum + rating.tasteScore, 0);
    const totalService = ratings.reduce((sum, rating) => sum + rating.serviceScore, 0);
    const totalPrice = ratings.reduce((sum, rating) => sum + rating.priceScore, 0);
    const avgTaste = ratings.length > 0 ? totalTaste / ratings.length : NaN;
    const avgService = ratings.length > 0 ? totalService / ratings.length : NaN;
    const avgPrice = ratings.length > 0 ? totalPrice / ratings.length : NaN;
    return {
      avgTaste,
      avgService,
      avgPrice
    };
  };

  const refreshComments = () => {
    fetch("/comments?restaurantId=" + restaurantId)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCommentList(result)
        },
        (error) => {

          setIsLoaded(true);
          setError(error);
        }
      )

    setRefresh(false)
  }



  const getRestaurant = () => {
    console.log("restoran id" + restaurantId)
    GetWithAuth("/restaurants/" + restaurantId)
      .then((res) => res.json())
      .then(
        (result) => {

          setRestaurant(result)

          setIsLoaded(true)
          setRefresh(false)
        }
      )
      .catch((err) => console.log("error"));


  };
  const handleScore = () => {

    setShowScoreForm(true)
  }

  const refreshRatings = () => {
    GetWithoutAuth("/ratings/averageratings/?restaurantId=" + restaurantId)
      .then((res) => res.json())
      .then((result) => {
        if (result && typeof result.serviceScore === "number") {

          setTasteScore(result.tasteScore);
          setPriceScore(result.priceScore);
          setServiceScore(result.serviceScore);
          setRatings(result)


        } else {
          setTasteScore("nan");
          setPriceScore("nan");
          setServiceScore("nan");
          console.log("Rating data is missing or invalid.");

        }
        setRefresh(false)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRestaurant()


  }, [refresh])

  if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  }
  else {

    const avgRatings = calculateAverage(restaurant.ratings);

    return (
      <>{(localStorage.getItem("currentUser") == null) ||
        (localStorage.getItem("currentUser") == "undefined") ||
        (localStorage.getItem("currentUser") === null) ? <Alert className="danger">Please Login to see Profiles</Alert> : <div>

        {showEditForm && (
          <EditForm
            userId={localStorage.getItem("currentUser")}
            userName={localStorage.getItem("userName")}
            restaurantId={restaurantId}
            setRefresh={setRefresh}
            refreshRestaurants={refreshRestaurants}
            handleClose={() => setShowEditForm(false)}
          />
        )}
        {showScoreForm && (
          <ScoreForm
            handleClose={() => setShowScoreForm(false)}
            restaurantId={restaurantId}
            refreshRestaurants={refreshRestaurants}
            setRefresh={setRefresh}
            priceScoree={priceScore}
            tasteScoree={tasteScore}
            serviceScoree={serviceScore}
            refreshRatings={refreshRatings}
          />
        )}
        <Card className="m-5" style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
          <div className="row">
            <div className="col-3">
              <Link
                to={{ pathname: "/restaurants/" + restaurantId }}
              >
                <Card.Img src={restaurant.photoUrl} className="restaurant-img m-2" />
              </Link>
            </div>
            <Card.Body className="col-9">
              <div>
                <Card.Title><span style={{ color: "orange" }}>Restaurant Name:</span> {restaurant.name}</Card.Title>
                <p><span style={{ color: "orange" }}>Category: </span>{restaurant.category}</p>
                <p><span style={{ color: "orange" }}>Restaurant Address: </span>{restaurant.address}</p>
              </div  >
              <div className="d-flex justify-content-between align-items-center "  >
                <i
                  className={"bi bi-bicycle ps-5"}
                  style={{ cursor: "pointer" }}
                  onClick={null}
                > Service Avarage {avgRatings.avgService ? <span style={{ color: "brown", fontWeight: "bold" }}>{avgRatings.avgService.toFixed(1)}</span> : <span style={{ color: "brown", fontWeight: "bold" }}>-</span>}</i>
                <i
                  className={"bi bi-cup-straw ps-3"}
                  style={{ cursor: "pointer" }}
                  onClick={null}
                > Taste Avarage {avgRatings.avgTaste ? <span style={{ color: "brown", fontWeight: "bold" }}>{avgRatings.avgTaste.toFixed(1)}</span> : <span style={{ color: "brown", fontWeight: "bold" }}>-</span>}</i>
                <i
                  className={"bi bi-cash-coin pe-5"}
                  style={{ cursor: "pointer" }}
                  onClick={null}
                > Price Avarage {avgRatings.avgTaste ? <span style={{ color: "brown", fontWeight: "bold" }}>{avgRatings.avgPrice.toFixed(1)}</span> : <span style={{ color: "brown", fontWeight: "bold" }}>-</span>}</i>
              </div>

              <p className="card-text text-start ps-3">{ }</p>

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
                        > Edit</i>
                      </span>
                    ) : null}

                    <span>
                      <i
                        className={"bi  bi-hand-thumbs-up ps-4"}
                        style={{ cursor: "pointer" }}
                        onClick={handleScore}
                      >Evaluate</i>
                    </span>


                    {localStorage.getItem("role") == "admin" ? (
                      <span>
                        <i
                          className={"bi bi-trash ps-3"}
                          style={{ cursor: "pointer" }}
                          onClick={handleDeleteRestaurant}
                        > Delete</i>
                      </span>
                    ) : null}
                  </div>

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
                        email = {comment.email}
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
                    <CommentForm
                      userId={localStorage.getItem("currentUser")}
                      refreshComments={refreshComments}
                      restaurantId={restaurantId}
                      setCommentRefresh={setCommentRefresh}
                    />

                  )}
                </div>
              )}
            </Card.Body>
          </div>
        </Card>


      </div>
      }

      </>
    );
  }


}

export default RestaurantProfile;