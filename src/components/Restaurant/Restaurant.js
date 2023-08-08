import React from "react";
import {  Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { GetWithoutAuth } from "../../services/HttpService";
import './Restaurant.css'

function Restaurant(props) {
  const { restaurantId, userId, name, category, photo, date, address, avgRatings, refreshRestaurants } = props;
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const isInitialMount = useRef(true);
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [tasteScore, setTasteScore] = useState(0);
  const [serviceScore, setServiceScore] = useState(0);
  const [priceScore, setPriceScore] = useState(0);
  const roundedTasteScore = parseFloat(tasteScore).toFixed(1);
  const roundedServiceScore = parseFloat(serviceScore).toFixed(1);
  const roundedPriceScore = parseFloat(priceScore).toFixed(1);

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
          setTasteScore("-");
          setPriceScore("-");
          setServiceScore("-");
          console.log("Rating data is missing or invalid.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

  useEffect(() => {
    refreshRatings()

    if (isInitialMount.current) {
      isInitialMount.current = false;

    }
    else
      refreshComments();
  }, [refresh])


  if (!props.isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  } else {
    return (
      <tr key={restaurantId}>
        <td>{restaurantId}</td>
        <td>{userId}</td>
        <td>{name}</td>
        <td>{isNaN(avgRatings.avgTaste) ? 'No rating' : avgRatings.avgTaste.toFixed(1)}</td>
        <td>{isNaN(avgRatings.avgService) ? 'No rating' : avgRatings.avgService.toFixed(1)}</td>
        <td>{isNaN(avgRatings.avgPrice) ? 'No rating' : avgRatings.avgPrice.toFixed(1)}</td>
        <td> <Link to={`/restaurants/${restaurantId}`}>
                    <span className="bi bi-arrow-right-circle text-dark" style={{ fontSize: "1.5rem" }}></span>
                  </Link></td>
      </tr>
    );
  }
}

export default Restaurant;
