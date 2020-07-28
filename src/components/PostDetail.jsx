import React, { Component, useState, useEffect } from 'react'
import './styles/detail.css'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';
import { useCurrentUser } from '../useCurrentUser'
import { Link } from 'react-router-dom'
import Header from './Header'
import Posts from './Posts';


const PostDetail = ({ id }) => {

    const user = useCurrentUser()
    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const [post, setPost] = useState(null)
    const [comentario , setComentario] = useState('')

    useEffect(() => {
        db.collection('posts').doc(id).onSnapshot(doc => {
            console.log('current data', doc.data())
            setPost(doc.data())
        })


    }, [])


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


        <section className="detail">
            <Header profileImg={user.imgProfile}/>
            <br /><br /><br /><br />
            {post === null &&
                <h1>LOADING...</h1>
            }
            {post !== null &&
                <>
                <article className="post">
                    <div className="div-img">
                        <img src={post.url} alt="" />
                    </div>
                    
                    <section className="info">
                        <div className="header">
                            
                            <Link to={"/profile/"+post.author} className="author-img"><img src={post.authorImg} alt="" /></Link>
                            <Link to={"/profile/"+post.author} className="author-title">{post.author}</Link>
                        </div>

                        <section className="comments">
                            {post.comentarios_bd.length > 0 &&
                                post.comentarios_bd.slice(0).reverse().map((comment, i) => {
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
                                {post.likes.includes(user.username) &&
                                    <>
                                    <span onClick={()=>dislike(post.likes)}><i className="fas fa-heart liked" /></span>
                                    <span><i className="far fa-comment" /></span>
                                
                                    </>

                                }
                                {!post.likes.includes(user.username) &&
                                    <>
                                    <span onClick={()=>like(post.likes)}><i className="far fa-heart" /></span>
                                    <span><i className="far fa-comment" /></span>
                                
                                    </>

                                }
                            
                        </div>
                        <div className="form">
                            <form action="post">
                                <input type="text" placeholder="Add a Comment..." id="box-comment" onChange={comentando}/>
                            </form>
                            {comentario === '' &&
                                <input type="button" disabled defaultValue="Post"  />


                            }
                            {comentario !== '' &&
                                <input type="button"  defaultValue="Post" id="add-post" onClick={(e)=>comentar(e)}/>


                            }
                           
                        </div>
                        </div>
                    </section>

                    

                </article>
                
                </>
            }
        </section >

    )
}

export default PostDetail;