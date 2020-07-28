import React, { Component, useState, useEffect } from 'react'
import './styles/discover.css'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';
import { useCurrentUser } from '../useCurrentUser'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import ItemsCarousel from 'react-items-carousel';

const Discover = () => {
  const currentUser = useCurrentUser()
  const firebase = useFirebaseApp();
  const db = firebase.firestore()
  const [users, setUsers] = useState([])
  const [following, setFollowing] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;
  useEffect(() => {



    if (currentUser.username !== undefined && loading === true) {
      setLoading(false)

      db.collection("users").onSnapshot((doc) => {
        let arr = []
        let c = 3
        doc.forEach(d => {
          console.log(currentUser.username)
          if (d.data().username !== currentUser.username && !currentUser.followingName.includes(d.data().username)) {
            arr.push({

              username: d.data().username,
              followers: d.data().followers,
              followersCount: d.data().followersCount,

              imgProfile: d.data().imgProfile,


            })
          }




        })

        setUsers(arr)
      })
    }


  }, [currentUser])

  const follow = (user_name, followers, followersCount, imgProfile) => {
    let followingName = currentUser.followingName
    let followingImg = currentUser.followingImg


    let currentUserName = currentUser.username

    let followingCount = currentUser.followingCount
    setShow(true)
    dispatch({
      type: 'FOLLOW',
      payload: { user_name, followingImg, followingName, followers, db, currentUserName, followersCount, followingCount, imgProfile }
    })

  }

  /*const unFollow = () => {
    //agregar a la bd del usuario que se le da follow
    let followers = user.followers
    //let followersCount = user.followersCount
    

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
    //setIsFollowing(false)
    //setFollowersCount(followersCount - 1)

    db.collection("users").doc(currentUser.username).update({

      followingName: following,
      followingImg: followingImg,

      followingCount: currentUser.followingName.length

    }).then(res => {
      console.log(res)
    })
  }*/

  return (


    <div className='discover'>



      <ItemsCarousel
        infiniteLoop={true}
        gutter={12}
        activePosition={'center'}
        chevronWidth={40}
        disableSwipe={false}
        alwaysShowChevrons={false}
        numberOfCards={5}
        slidesToScroll={1}
        outsideChevron={true}
        showSlither={false}
        firstAndLastGutter={false}
        activeItemIndex={activeItemIndex}
        requestToChangeActive={setActiveItemIndex}


        rightChevron={<i class="fas fa-chevron-circle-right"></i>}
        leftChevron={<i class="fas fa-chevron-circle-left"></i>}

      >
        {users.map(u => {
          return (
            <>
            

                <>



                  <div className="card">


                    <>
                      <span><img src={u.imgProfile} alt="" /></span>
                      <Link to={'/profile/' + u.username} className="discover-username">{u.username}</Link>




                      <button onClick={() => follow(u.username, u.followers, u.followersCount, u.imgProfile)}>follow</button>
                    </>



                  </div>



                </>
              
            </>
          )
        })

        }
      </ItemsCarousel>
    </div>

  )
}

export default Discover;