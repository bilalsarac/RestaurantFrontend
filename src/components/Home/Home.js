import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Button,Form,Modal } from 'react-bootstrap';
import Restaurant from '../Restaurant/Restaurant';
import RestaurantForm from '../Restaurant/RestaurantForm';
import { GetWithAuth, GetWithoutAuth, PostWithAuth } from '../../services/HttpService';


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
        console.log()
        setRestaurantList(data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });

    setRefresh(false);
  };

  useEffect(() => {
    refreshRestaurants();
  }, [refresh]);

  if (error) {
    return <Alert variant="danger">Error!!!</Alert>;
  } else if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  } else {
    return (
      <Container>
        {localStorage.getItem("role") == "senior"?<RestaurantForm  refreshRestaurants= {refreshRestaurants}/>:null }
        
        
        {restaurantList.map((restaurant) => (
          <Restaurant
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
            setRefresh = {setRefresh}
            isLoaded={isLoaded} 
          />
        ))}
      </Container>
    );
  }
}

export default Home;
