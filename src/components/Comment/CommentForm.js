
import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { GetWithAuth, PostWithAuth, RefreshToken } from '../../services/HttpService';

function CommentForm(props) {
    const { userId, restaurantId, setCommentRefresh } = props;
    const [text, setText] = useState("");
    const [alreadyCommented, setAlreadyCommented] = useState(false);


    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("email")
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
        
        setCommentRefresh()

    };

    const handleText = (value) => {
        setText(value);
    };

    const getComment = () => {
        GetWithAuth("/comments/comment/?userId=" + userId + "&restaurantId=" + restaurantId)
            .then((res) => {
            
                if (res.status === 200) {

                    setAlreadyCommented(true);
                } else {

                    setAlreadyCommented(false);
                }
            })
            .catch((err) => {

                setAlreadyCommented(false);
                
            });
    };

    useEffect(() => {
        getComment()
    }, [])

    if (alreadyCommented) {
        return null
    }
    else {

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


}

export default CommentForm;