import React, { useState, useEffect } from 'react';
import './styles/modal.css'
import './styles/detail.css'

import 'firebase/storage'
import 'firebase/firestore'
import { useMyUser } from '../useMyUser'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { useCurrentUser } from '../useCurrentUser'

import { useFirebaseApp, useUser } from 'reactfire';

const PostModal = ({ post,username,id }) => {
    const firebase = useFirebaseApp();
    const showModal = useSelector((state) => state.showModal)
    const user = useCurrentUser()
    
    const db = firebase.firestore()
    //const [post, setPost] = useState(null)
    const [comentario , setComentario] = useState('')

    console.log(post)
    const like = (likes) => {

        db.collection("posts").doc(id).update({
            likes: [...likes, user.username]


        })
        likes.push(user.username)


    }

    const dislike = ( likes) => {
        if (likes.length > 0) {
            const index = likes.indexOf(user.username)
            likes.splice(index, 1)
            
        }

        const i = likes.indexOf(id)
         likes.splice(i, 1)
        
        db.collection("posts").doc(id).update({
            likes: likes


        })

    }

     //cacth the comment value from input
     const comentando = (e) => {
        setComentario(e.target.value)
       
        console.log(comentario)
    }

    const comentar = (e,index) => {
        e.preventDefault();
        let comment = { 'username': user.username, 'contenido': comentario , 'postId': id, 'user_img': user.imgProfile }
        let comentarios = post.comentarios_bd
        //setComentarios(comentarios => [...comentarios, comment])
    
        //add comments to db
        db.collection('posts').doc(id).update({
            comentarios_bd: [...comentarios, comment]
        })

        
        //post[index][index].comments.push(comment) //add comment a los posts guardados en el state
    }

    return (
        <>

            {showModal &&
                <>

                    <div className='modal showModal '>
                        <div className="detail subModal">

                        <article className="post">
                            <div className="div-img">
                                <img src={post[1].url} alt="" />
                            </div>

                            <section className="info">
                                <div className="header">
                                    <img src={post[1].authorImg} alt="" />
                                    <p><strong>{post[1].author}</strong></p>
                                </div>

                                <section className="comments">
                                    {post[1].comentarios_bd.length > 0 &&
                                        post[1].comentarios_bd.slice(0).reverse().map((comment, i) => {
                                            return (

                                                <article className="comment">
                                                    <img src={comment.user_img} alt="" />
                                                    <p key={i}><strong>{comment.username}</strong>{comment.contenido}</p>

                                                </article>




                                            )
                                        })
                                    }
                                </section>

                                <div className="footer">
                                    <div className="btns">
                                        {post[1].likes.includes(username) &&
                                            <>
                                                <span onClick={() => dislike([1].likes)}><i className="fas fa-heart liked" /></span>
                                                <span><i className="far fa-comment" /></span>

                                            </>

                                        }
                                        {!post[1].likes.includes(username) &&
                                            <>
                                                <span onClick={() => like(post[1].likes)}><i className="far fa-heart" /></span>
                                                <span><i className="far fa-comment" /></span>

                                            </>

                                        }

                                    </div>
                                    <div className="form">
                                        <form action="post">
                                            <input type="text" placeholder="Add a Comment..." id="box-comment" onChange={comentando} />
                                        </form>
                                        {comentario === '' &&
                                            <input type="button" disabled defaultValue="Post" />


                                        }
                                        {comentario !== '' &&
                                            <input type="button" defaultValue="Post" id="add-post" onClick={(e) => comentar(e)} />


                                        }

                                    </div>
                                </div>
                            </section>



                        </article>
                        </div>

                    </div>





                </>

            }
            {
                !showModal &&
                <div className='modal '>

                    <div className="subModal">

                    </div>
                </div>

            }

        </>
    )
}

export default PostModal;