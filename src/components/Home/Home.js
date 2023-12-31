import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Table, Button,Form } from 'react-bootstrap';
import Restaurant from '../Restaurant/Restaurant';
import RestaurantForm from '../Restaurant/RestaurantForm';
import { Link } from 'react-router-dom';
import { DeleteWithAuth,GetWithAuth } from '../../services/HttpService';
import EditForm from '../EditForm/EditForm';

function Home() {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [restaurantList, setRestaurantList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");



  const calculateAverage = (ratings) => {
    const totalTaste = ratings.reduce((sum, rating) => sum + rating.tasteScore, 0);
    const totalService = ratings.reduce((sum, rating) => sum + rating.serviceScore, 0);
    const totalPrice = ratings.reduce((sum, rating) => sum + rating.priceScore, 0);
    const avgTaste = ratings.length > 0 ? (totalTaste / ratings.length).toFixed(1) : NaN;
    const avgService = ratings.length > 0 ? (totalService / ratings.length).toFixed(1) : NaN;
    const avgPrice = ratings.length > 0 ? (totalPrice / ratings.length).toFixed(1) : NaN;
    return {
      avgTaste,
      avgService,
      avgPrice
    };
  };

  const handleDeleteRestaurant = (restaurantId) => {
    DeleteWithAuth("/restaurants/" + restaurantId)
      .then(() => {
        refreshRestaurants()

      })
      .catch((err) => {
        console.log(err)
      })

  }
  const handleEditRestaurant = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    setShowEditForm(true);
  };


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

  const handleSearch = (searchQuery) => {
    GetWithAuth("/restaurants/search?keyword=" + searchQuery)
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setRestaurantList(result)
      })
      .catch((err) => console.log(err))

  }



  useEffect(() => {

    refreshRestaurants();
  }, []);

  if (error) {
    return <Alert variant="danger">Error!!!</Alert>;
  } else if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  } else {

    return (
      <Container className='p-3' >
        {localStorage.getItem("role") == "senior" ? <RestaurantForm refreshRestaurants={refreshRestaurants} /> : null}

        {showEditForm && (
          <EditForm
            userId={localStorage.getItem("currentUser")}
            restaurantId={selectedRestaurantId}
            refreshRestaurants={refreshRestaurants}
            setRefresh={setRefresh}
            handleClose={() => setShowEditForm(false)} // Close the form
          />
        )}
        {localStorage.getItem("currentUser") ? <><p className='text-danger'>This search bar can search restaurants by id, name, category and address.</p>
        <Form className="d-flex m-5">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-dark" onClick={() => handleSearch(searchQuery)}>Search</Button>
        </Form>
        </>:null}
        
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
              { localStorage.getItem("role") == "senior" | localStorage.getItem("role") == "admin" ? <th>Actions</th> : null}

            </tr>
          </thead>
          <tbody>
            {restaurantList.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>{restaurant.id}</td>
                <td>{restaurant.userId}</td>
                <td>{restaurant.name}</td>
                <td>{calculateAverage(restaurant.ratings).avgTaste}</td>
                <td>{calculateAverage(restaurant.ratings).avgService}</td>
                <td>{calculateAverage(restaurant.ratings).avgPrice}</td>
                <td>
                  <Link to={`/restaurants/${restaurant.id}`}>
                    <span className="bi bi-arrow-right-circle text-dark" style={{ fontSize: "1.5rem" }}></span>
                  </Link>
                </td>
                { localStorage.getItem("role") == "senior" | localStorage.getItem("role") == "admin" ?
                  <td>
                    {localStorage.getItem("currentUser") == restaurant.userId & localStorage.getItem("role") == "senior" ? <Button
                      variant="dark"
                      onClick={() => handleEditRestaurant(restaurant.id)}
                    >
                      Edit
                    </Button> : null}
                    {" "}
                    {localStorage.getItem("role") == "admin" ? <Button
                      variant="dark"
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                      value={restaurant.id}
                    >
                      Delete
                    </Button> : null}

                  </td> : null}

              </tr>
            ))}
          </tbody>
        </Table>


      </Container>
    );
  }
}

export default Home;
