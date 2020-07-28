import React, { Component, useState, useEffect } from 'react'
import './styles/inicio.css'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';
import { useCurrentUser } from '../useCurrentUser'
import { Link } from 'react-router-dom'
import Header from './Header'
import Discover from './Discover';


const Inicio = () => {
    const user = useCurrentUser()
    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const userFollowing = user.followingName
    const [posts, setPosts] = useState([])
    let arr = []
    const [postsLiked, setPostsLiked] = useState([])
    const [comentario, setComentario] = useState('')
    const [comentarios, setComentarios] = useState([])
    const [userComento,  setUserComento] = useState(false)
    useEffect(() => {

        if (userFollowing !== undefined) {

            for (let i = 0; i < userFollowing.length; i++) {

                db.collection('posts').where('author', "==", userFollowing[i]).limit(1)

                    .get().then(function (querySnapshot) {

                        querySnapshot.forEach(function (d) {
                            arr.push({
                                url: d.data().url,
                                likes: d.data().likes,
                                author: d.data().author,
                                authorImg: d.data().authorImg,
                                id: d.id,
                                comments: d.data().comentarios_bd

                            })
                            //llenar state de postliked
                            if (d.data().likes.includes(user.username)) {
                                setPostsLiked(postsLiked => [...postsLiked, d.id])

                            }

                           
                            

                            setPosts(posts => [...posts, arr])

                        })
                        

                    

                    })


            }

           

        }

    }, [userFollowing,user])
  


    const like = (id, likes) => {

        db.collection("posts").doc(id).update({
            likes: [...likes, user.username]


        })

        setPostsLiked(postsLiked => [...postsLiked, id])
       


    }

    const dislike = (id, likes) => {
        if (likes.length > 0) {
            const index = likes.indexOf(user.username)
            likes.splice(index, 1)
          
        }

        let aux = [...postsLiked]

        const i = postsLiked.indexOf(id)
        aux.splice(i, 1)

        db.collection("posts").doc(id).update({
            likes: likes


        })

        setPostsLiked(aux)




    }

    //cacth the comment value from input
    const comentando = (e) => {
        setComentario(e.target.value)
       
      
    }

    const comentar = (e, id, comentarios_bd,index) => {
        e.preventDefault();
        let comment = { 'username': user.username, 'contenido': comentario , 'postId': id, 'user_img': user.imgProfile }
            
        setComentarios(comentarios => [...comentarios, comment])
    
        //add comments to db
        db.collection('posts').doc(id).update({
            comentarios_bd: [...comentarios_bd, comment]
        })

        
        posts[index][index].comments.push(comment) //add comment a los posts guardados en el state

            
            

    
    }

    

    return (
        <section className="principal-inicio">

            <Header profileImg={user.imgProfile}/>
            
            <Discover currentUser={user}/>
            <br /><br /><br /><br />

            {posts === undefined &&
                <h5>No hay posts</h5>

            }

            {posts !== undefined &&
               
                posts.map((p, i) => {

                    console.log(p[i])
                    
                   
                    return (
                        
                        <article className="post" key={p.index}>
                            
                            <div className="header">
                                <Link to={"/profile/"+p[i].author} className="author-img"><img src={p[i].authorImg} alt="" /></Link>
                                <Link to={"/profile/"+p[i].author} className="author-title">{p[i].author}</Link>
                            </div>
                            <div className="img-principal">
                                <img src={p[i].url} alt="" />
                            </div>
                            <div className="footer">
                                <div className="btns">

                                    {postsLiked.includes(p[i].id) &&
                                        <>
                                            <span onClick={() => dislike(p[i].id, p[i].likes)}><i class="fas fa-heart liked"></i></span>
                                            <Link to={'/post/'+ p[i].id}><i className="far fa-comment" /></Link>
                                        </>


                                    }
                                    {!postsLiked.includes(p[i].id) &&
                                        <>
                                            <span onClick={() => like(p[i].id, p[i].likes)}><i className="far fa-heart" /></span>
                                            <Link to={'/post/'+ p[i].id}><i className="far fa-comment" /></Link>
                                        </>

                                    }


                                </div>
                                
                                <div className="comments">
                                    
                                    
                                    {p[i].comments.length > 0 &&
                                    //comentarios desde la BD
                                        p[i].comments.slice(0).reverse().map(comment => {
                                            return (
                                                
                                                <>

                                                { comment.postId === p[i].id && 
                                                    
                                                    <p key={i}><Link to={'/profile/'+comment.username} className="comment-author">{comment.username}</Link>{comment.contenido}</p>

                                                }
                                                </>
                                            )
                                        
                                        })

                                    }
                                    
                                </div>
                                {p[i].comments.length > 5   &&
                                        <Link to={'post/'+ p[i].id} class='view-more'>View all {p[i].comments.length} comments</Link>

                                    }
                                <div className="form">
                                    <form action>
                                        <input type="text" placeholder="Add a Comment..." id="box-comment" onChange={(e) => comentando(e)} />
                                    </form>
                                    {comentario === '' &&
                                        <button class="disabledbtn" disabled >Post</button>
                                    }
                                    {comentario !== '' &&
                                        <button class="add-post" onClick={(e) => comentar(e , p[i].id, p[i].comments,i)}>Post</button>

                                    }
                                </div>
                            </div>
                            
                        </article>
                    )
                
                })



            }

        </section>
    )
}

export default Inicio;