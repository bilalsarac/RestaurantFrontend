import Avatar from "../../../src/components/Avatar/Avatar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";
import { Alert, Spinner } from "react-bootstrap";
import Restaurant from "../Restaurant/Restaurant";
import UserRestaurant from "../UserRestaurants/UserRestaurants";
function User() {

  const { userId } = useParams();
  const [user, setUser] = useState();
  const [restaurantList, setRestaurantList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const param = useParams();

  const getUser = () => {
    GetWithAuth("/users/" + userId)
      .then((res) => res.json())
      .then(
        (result) => {

          setUser(result)

          setIsLoaded(true)
        }
      )
      .catch((err) => console.log("error"));


  };

  useEffect(() => {
    getUser()
  }, [])

  const getRestaurantsByUser = () => {
    fetch("/restaurants/" + userId + "/restaurants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("tokenKey"),
      },

    })
      .then((res) => res.json())
      .then((result) => {
        setRestaurantList(result)
      })
      .catch((err) => {
        console.log(err)
        setError(true)
      })
    setRefresh(false)
  }


  useEffect(() => {
    getRestaurantsByUser()
  }, [refresh, param.userId])


  if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  }
  else {
    return (
      <>{(localStorage.getItem("currentUser") == null) ||
        (localStorage.getItem("currentUser") == "undefined") ||
        (localStorage.getItem("currentUser") === null) ? <Alert className="danger">Please Login to see Profiles</Alert> : <div>

        <div className="row m-3">
          {user ? <div className="col-4"><Avatar userId={userId} photo={user.photoUrl} email={user.email} getUser={getUser} /></div> : ""}
          {localStorage.getItem("currentUser") == userId ? <div className="col-md-7 m-3"><UserRestaurant userId={userId} /></div> : ""}
        </div>
        <div className="m-3">
          {restaurantList.map((restaurant) => (
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
              refreshRestaurants={getRestaurantsByUser}
              isLoaded={isLoaded}
            />
          ))}
        </div>
      </div>
      }

      </>
    );
  }


}

export default User;