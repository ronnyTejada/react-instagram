import React, { Component, useState, useEffect } from 'react'
import './styles/posts.css'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';
import { useCurrentUser } from '../useCurrentUser'
import { useMyUser } from '../useMyUser'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import Spinner from './Spinner'
import InfiniteScroll from 'react-infinite-scroll-component';

const Posts = ({ ruta, username , loading}) => {


    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const [postsCount, setPostsCount] = useState(0)
    const [posts, setPosts] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {

        console.log('posts' + username)
        db.collection("posts").orderBy('id', 'desc').onSnapshot((doc) => {
            let arr = []
            let c = 3
            doc.forEach(d => {


                if (d.data().author === username && ruta === 'profile') {
                    arr.push({
                        url: d.data().url,
                        likes: d.data().likes,
                        author: d.data().author,
                        id: d.id,
                        comentarios_bd: d.data().comentarios_bd

                    })

                } else if (ruta === 'explore') {
                    arr.push({
                        url: d.data().url,
                        likes: d.data().likes,
                        author: d.data().author,
                        id: d.id,
                        comentarios_bd: d.data().comentarios_bd



                    })

                }




            })
            setPosts(arr)


        })


    }, [username])

    const viewPost = () => {

        dispatch({
            type: 'SHOW_MODAL',
            payload: true
        })

    }
    return (
        <>

            { posts.length === 0 && !loading && 
                <div className="spinner-sect">
                    <Spinner />

                </div>
            }
            {posts !== undefined && posts.length > 0 &&
                <>

                   
                    {posts.map(p => {
                        return (
                            <Link className="post-feed" to={'/post/' + p.id}>

                                <div className="post-feed-img" >
                                    <img src={p.url} alt="" id="i0" className='feed-imagen' />
                                </div>




                            </Link>

                        )
                    })}

                </>
            }
        </>
    )
}

export default Posts;