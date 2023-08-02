
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";
import { Alert, Spinner } from "react-bootstrap";
import Restaurant from "../Restaurant/Restaurant";
function RestaurantProfile() {

  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState();
  const [isLoaded, setIsLoaded] = useState(false);


  const getRestaurant = () => {
    console.log("restoran id" + restaurantId)
    GetWithAuth("/restaurants/" + restaurantId)
      .then((res) => res.json())
      .then(
        (result) => {

          setRestaurant(result)

          setIsLoaded(true)
        }
      )
      .catch((err) => console.log("error"));


  };

  useEffect(() => {
    getRestaurant()
  }, [])

  if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  }
  else {
    return (
      <>{(localStorage.getItem("currentUser") == null) ||
        (localStorage.getItem("currentUser") == "undefined") ||
        (localStorage.getItem("currentUser") === null) ? <Alert className="danger">Please Login to see Profiles</Alert> : <div>


        <Restaurant
          key={restaurant.id}
          restaurantId={restaurant.id}
          userId={restaurant.userId}
          name={restaurant.name}
          category={restaurant.category}
          photo={restaurant.photoUrl}
          date={restaurant.createDate}
          address={restaurant.address}
          priceScore={restaurant.priceScore}
          serviceScore={restaurant.serviceScore}
          tasteScore={restaurant.tasteScore}
          isLoaded={isLoaded}
        />


      </div>
      }

      </>
    );
  }


}

export default RestaurantProfile;