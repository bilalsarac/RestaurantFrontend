import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import Restaurant from '../Restaurant/Restaurant';
import RestaurantForm from '../Restaurant/RestaurantForm';

function Home() {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [restaurantList, setRestaurantList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  


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

 

  useEffect(() => {
  
    refreshRestaurants();
  }, []);

  if (error) {
    return <Alert variant="danger">Error!!!</Alert>;
  } else if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  } else {
    return (
      <Container>
        {localStorage.getItem("role") == "senior" ? <RestaurantForm refreshRestaurants={refreshRestaurants} /> : null}


        {restaurantList.map((restaurant) => (
          <Restaurant
            restaurantId={restaurant.id}
            userId={restaurant.userId}
            name={restaurant.name}
            category={restaurant.category}
            photo={restaurant.photoUrl}
            date={restaurant.createDate}
            address={restaurant.address}
            refreshRestaurants={refreshRestaurants}
            isLoaded={isLoaded}
          />
        ))}
      </Container>
    );
  }
}

export default Home;
