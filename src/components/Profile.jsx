import React, { useState, useEffect } from 'react'
import './styles/profile.css'
import Header from './Header'
import Modal from './Modal'

import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp } from 'reactfire';
import { Link, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { useMyUser } from '../useMyUser'
import { useCurrentUser } from '../useCurrentUser'
import Posts from './Posts';


const Profile = ({ user_name }) => {
    const ruta = 'profile'
    // const userSearched = useSelector((state) => state.wordSearched)
    const showModal = useSelector((state) => state.showModal)
    const imgUrl = useSelector((state) => state.url)
    const count = useSelector((state) => state.count) //contar post en el estado global

    //const imgLoading = useSelector((state) => state.imgLoading)

    const user = useMyUser(user_name)

    // alert(firebaseUser.email)
    const currentUser = useCurrentUser(user_name)



    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState()
    const [postsCount, setPostCount] = useState(0)


    const [profileImg, setProfileImg] = useState('')
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState(null)
    const dispatch = useDispatch()
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {

        if (currentUser.imgProfile !== undefined) {
            setLoading(false)
            if (imgUrl !== null && imgUrl !== undefined) {
                setLoading(false)
                setProfileImg(imgUrl)
            } else {
                setLoading(false)

                setProfileImg(currentUser.imgProfile)

            }

            //setIsFollowing(currentUser.followingName.includes(user_name))
        }
        //setIsFollowing(currentUser.followingName.includes(user_name))
        if (currentUser !== [] && currentUser.followingName !== undefined) {
            setIsFollowing(currentUser.followingName.includes(user_name))
            console.log(currentUser.followingName)

        }
        if (user.currentUser) {
            setFollowingCount(currentUser.followingCount)
            setFollowersCount(currentUser.followersCount)
            if(count === undefined){
                setPostCount(currentUser.postsCount)
            }else{
                setPostCount(count)
            }
        } else if (!user.currentUser) {
            setFollowingCount(user.followingCount)
            setFollowersCount(user.followersCount)
            setPostCount(user.postsCount)

        }

    }, [user, currentUser, imgUrl, count])
    //setIsFollowing(currentUser.followingName.includes(user_name))

    const logout = async () => {
        await firebase.auth().signOut().then(() => { alert('user no loged') })
        setRedirect(true)
    }


    const newPost = () => {
        setType('post')
        dispatch({
            type: 'SHOW_MODAL',
            payload: true
        })
    }

    const changeImg = () => {
        setType('photo')

        dispatch({
            type: 'SHOW_MODAL',
            payload: true
        })
        //setImgLoading(true)
    }
    const follow = () => {
        let followingName = currentUser.followingName
        let followingImg = currentUser.followingImg

        let followers = user.followers
        let currentUserName = currentUser.username
        let followersCount = user.followersCount
        let followingCount = currentUser.followingCount
        let imgProfile = user.imgProfile
        let user_name = user.username

        dispatch({
            type: 'FOLLOW',
            payload: { user_name, followingImg, followingName, followers, db, currentUserName, followersCount, followingCount, imgProfile }
        })
        setIsFollowing(true)
        setFollowersCount(followersCount + 1)

    }
    console.log(postsCount)
    const unFollow = () => {
        //agregar a la bd del usuario que se le da follow
        let followers = user.followers
        //let followersCount = user.followersCount
        if (followersCount > 0)
            setFollowersCount(followersCount - 1)

        let index = followers.indexOf(currentUser.username)
        followers.splice(index, 1)
        db.collection("users").doc(user_name).update({
            followers: followers,
            followersCount: user.followers.length

        })




        //agregar a la bd del usuario que esta logueado


        //alert(currentUser.isFollowing)
        let following = currentUser.followingName
        let followingImg = currentUser.followingImg
        let indexfollowing = following.indexOf(user_name)
        let indexImg = followingImg.indexOf(user.imgProfile)
        following.splice(indexfollowing, 1)
        followingImg.splice(indexImg, 1)
        setIsFollowing(false)
        setFollowersCount(followersCount - 1)

        db.collection("users").doc(currentUser.username).update({

            followingName: following,
            followingImg: followingImg,

            followingCount: currentUser.followingName.length

        }).then(res => {

        })
    }

    return (
        <>


            {loading &&
                <div className='principal-p'></div>
            }
            {!loading &&


                <div className="principal-p">
                    <Modal show={showModal} user={user} type={type} pCount={currentUser.postsCount} />
                    {/*userSearched ==! null &&

                <Redirect to={'/profile/' + userSearched} />*/
                    }
                    {redirect &&
                        <Redirect to={'/login/'} />


                    }
                    <Header profileImg={profileImg} />

                    <div className="profile">
                        <div className="div-imagen-profile">
                            {user.currentUser &&
                                <>


                                    <span onClick={() => changeImg()}>
                                        <img src={profileImg} className="imagen-profile" alt="" />
                                    </span>






                                </>
                            }
                            {!user.currentUser &&
                                <img src={user.imgProfile} className="imagen-profile" alt={user.username} />
                            }

                        </div>
                        <div className="info-profile">
                            <p className="username">{user.username}</p>
                            {!user &&
                                <>
                                    <Link className="btn-profile" to='/login' >Login</Link>
                                    <span><i class="fas fa-sign-in-alt profile-icon"></i></span>
                                </>



                            }
                            {user &&

                                <>
                                    {user.currentUser &&
                                        <>
                                            <button className="btn-profile" to="/new_post" onClick={newPost}>New Post</button>
                                            <span><i class="fas fa-sign-out-alt profile-icon" onClick={logout}></i></span>
                                        </>

                                    }
                                    {!user.currentUser &&
                                        <>

                                            {!isFollowing &&
                                                <button className="btn-profile" onClick={follow}>Follow</button>

                                            }
                                            {isFollowing &&
                                                <button className="btn-profile" onClick={unFollow}>Unfollow</button>


                                            }

                                        </>

                                    }

                                </>



                            }

                        </div>
                        <ul className="profile-list">   
                            <li id="post"><p><strong>{postsCount}</strong></p><span>post</span> </li>              
                            <li><p><strong>{followersCount}</strong> </p><span>followers</span></li>
                            <li id="following"><p><strong>{followingCount}</strong> </p><span>following</span></li>
                        </ul>
                    </div>
                    <div className="explore">
                        <div className="list-post">
                            {postsCount > 0 &&
                                <Posts ruta={ruta} username={user_name} loading={loading}></Posts>

                            }


                        </div>

                    </div>
                    <br /><br /><br />
                </div >
            }
        </>
    )
}

export default Profile;