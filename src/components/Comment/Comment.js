import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteWithAuth, PutWithAuth } from '../../services/HttpService';

function Comment(props) {
    const { text, userId, email,userPhoto,restaurantId,refreshComments } = props;
  



    const handleCommentDelete = ()=>{
        DeleteWithAuth("/comments/"+userId+"/"+restaurantId)
        .then(() => {
            refreshComments()
    
          })
          .catch((err) => {
            console.log(err)
          })
    }

    const handleCommentEdit = () => {
        PutWithAuth("comments/"+userId+"/"+ restaurantId)
        .then(()=>{
            refreshComments()
        })
        .catch((err)=> {
            console.log(err)
        })
    }


    return (
        <div class="container border border-gray rounded">
        <div class="row">
          <div class="col-md-1">
            <Link style={{ textDecoration: 'none' }} className='avatar bg-orange text-white' to={{ pathname: '/users/' + userId }}>
              <span className="avatar-letter">{null}</span>
            </Link>
          </div>
          <div className="col-md-10 d-flex align-items-center">
            <p className="text-start m-2">{text}</p>
          </div>
          <div className="col-md-1 d-flex align-items-center justify-content-end">
            {localStorage.getItem("currentUser") == userId? <>
            <i
            className={"bi bi-pencil ms-3"}
            style={{ cursor: "pointer" }}
            onClick={handleCommentEdit}
          ></i>
            <i
              className={"bi bi-trash ms-3"}
              style={{ cursor: "pointer" }}
              onClick={handleCommentDelete}
            ></i>  </>: null}
            
          </div>
        </div>
      </div>
    );
}

export default Comment;