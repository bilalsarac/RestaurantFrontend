import Avatar from "../../../src/components/Avatar/Avatar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";
import { Alert, Spinner, Table, Container } from "react-bootstrap";
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
        <h2 className="text-dark p-3">Created Restaurants by User ID {userId}</h2>
        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>UserID</th>
                <th>Restaurant Name</th>
                <th>Taste Average</th>
                <th>Service Average</th>
                <th>Price Average</th>
                <th>Restaurant Profile</th>
              </tr>
            </thead>
            <tbody>
              {restaurantList.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  restaurantId={restaurant.id}
                  userId={restaurant.userId}
                  name={restaurant.name}
                  category={restaurant.category}
                  photo={restaurant.photoUrl}
                  avgRatings={calculateAverage(restaurant.ratings)}
                  date={restaurant.createDate}
                  address={restaurant.address}
                  isLoaded={isLoaded}
                  average={calculateAverage}
                  comments={restaurant.comments}
                />
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
      }

      </>
    );
  }


}

export default User;