import React, { Component, useState } from 'react'
import './styles/explore.css'
import Discover from './Discover';
import Header from './Header';
import Posts from './Posts';
import { useCurrentUser } from '../useCurrentUser'
import InfiniteScroll from 'react-infinite-scroll-component';


const Explore=()=>{
   const ruta = 'explore'
   const user = useCurrentUser()
   const [loading,setLoading] = useState(false)
   console.log(user)
    return(
      <div className="principal">
        <Header profileImg={user.imgProfile}></Header>
        

        <div className="explore">
        <div className="list-post">
         
            <Posts ruta={ruta} loading={loading}></Posts>
            <br/><br/><br/>
        </div>
      </div>
      </div>
        
    )
}

export default Explore;