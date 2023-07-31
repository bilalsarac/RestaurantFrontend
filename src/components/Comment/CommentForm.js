
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { GetWithAuth, PostWithAuth, RefreshToken } from '../../services/HttpService';

function CommentForm(props) {
    const { userId, email, restaurantId, setCommentRefresh } = props;
    const [isSent, setIsSent] = useState(false);
    const [text, setText] = useState("");
    

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("email")
        console.log("?????")
        navigate(0)
    }

    const saveComment = () => {
        PostWithAuth("/comments", {
            restaurantId: restaurantId,
            userId: userId,
            text: text,
        })
            .then((res) => {
                if (!res.ok) {
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout();
                            } else {
                                return res.json()
                            }
                        })
                        .then((result) => {
                            console.log(result)

                            if (result != undefined) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                saveComment();
                                setCommentRefresh();
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else
                    res.json()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const handleSubmit = () => {

        saveComment();
        setText("");
        console.log("setCommentref")
        setCommentRefresh()

    };

    const handleText = (value) => {
        setText(value);
    };

   
     
  
    

    return (
        <div className="card m-5">
            <div className="row">
                <div className="card-body">
                    <form>
                        <div class="d-flex">

                            <div className="col-md-1">

                                <div >
                                    <Link style={{ textDecoration: 'none' }} className='avatar bg-orange text-white' to={{ pathname: '/users/' + userId }}>
                                        <span className="avatar-letter">{null}</span>
                                    </Link>
                                </div>

                            </div>

                            <div class="col-md-11">
                                <h5 className="card-title text-start"></h5>
                                <div class="form-group m-2">
                                    <div class="input-group mb-3">
                                        <input onChange={(i) => handleText(i.target.value)} value={text} type="text" class="form-control" placeholder="Text" aria-label="text" aria-describedby="button-addon2" />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" id="comment" onClick={handleSubmit} >Comment</button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>



                    </form>



                </div>
            </div>
        </div>
    );


    
}

export default CommentForm;