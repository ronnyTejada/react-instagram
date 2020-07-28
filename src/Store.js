import {createStore} from 'redux';
import 'firebase/auth';
import 'firebase/firestore'

import { useFirebaseApp, useUser } from 'reactfire';

const initialState = {
    userName: '',
    wordSearched: null,
    showModal: false,
    url:null,
    count:0
}



const reducer = (state = initialState, action) => {
    
    console.log(state.wordSearched)
   
    


    switch (action.type){
        
        case 'NEW_POST':{
            return{
                count: action.payload
            }
        }

        case 'NEW_USER':{
            return{
                userName: action.payload
            }
        }

        case 'SEARCH':{
            

            state.wordSearched = ""
        
            return{
                wordSearched: action.payload,
               
            }
        }
        case 'SHOW_MODAL':{
            return{
                showModal: action.payload
            }
        }

        case 'CHANGE_PHOTO':{
            return{
                url: action.payload
            }
        }
        case 'FOLLOW':{

            let arrFollowers = action.payload.followers
            let arrFollowingName = action.payload.followingName
            let arrFollowingImg = action.payload.followingImg
            let currentUserName = action.payload.currentUserName
            let user_name = action.payload.user_name
            let db = action.payload.db
            let followersCount = action.payload.followersCount
            let followingCount = action.payload.followingCount
            let imgProfile  = action.payload.imgProfile

           // console.log(action.payload.currentUserName)
            arrFollowers.push(currentUserName)
            db.collection("users").doc(user_name).update({
                
                followers: arrFollowers,
                followersCount: followersCount + 1
    
            }).then(res => {
               // console.log("todo correcto")
            })
           
            //agregar a la bd del usuario que esta logueado

            arrFollowingName.push(user_name)
            arrFollowingImg.push(imgProfile)

            db.collection("users").doc(currentUserName).update({
                
                followingName: arrFollowingName,
                followingImg: arrFollowingImg,
                followingCount: followingCount + 1  
    
            })
        }
        
    }





    return state
}


const Store = createStore(reducer, initialState)

export default Store