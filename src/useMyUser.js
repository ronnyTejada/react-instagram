import { useState, useEffect } from 'react'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';
import { useSelector } from 'react-redux'

export function useMyUser(username = 'JuiceWRLD') {
    const [users, setUsers] = useState([]);
    //const [username, setUserName] = useState(username)
    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const u = useUser()
    // const email = u.email
    


    useEffect(() => {
        const abortController = new AbortController()

        db.collection("users").where('username', "==", username).limit(1)
            .get().then(function (querySnapshot) {
                querySnapshot.forEach(doc => {


                    setUsers({
                        email: doc.data().email,
                        username: doc.data().username,
                        followers: doc.data().followers,
                        followingName: doc.data().followingName,
                        followingImg: doc.data().followingImg,
                        imgProfile: doc.data().imgProfile,
                        followingCount: doc.data().followingCount,
                        postsCount: doc.data().postsCount,
                        followersCount: doc.data().followersCount,
                        id: doc.data().id,
                        currentUser: doc.data().email === u.email,

                    })
                    //setUsers(user)

                })

                //filtrar usuario por email o por username
                /* console.log('useMyUSER; '+ username)
                 if(username === null){
                     aux = user.filter(item => item.email.toLowerCase().indexOf(email.toLowerCase()) !== -1)
                     aux[0].currentUser = true
     
     
                 }else{
                     aux = user.filter(item => item.username.toLowerCase().indexOf(username.toLowerCase()) !== -1)
                     if(aux[0].email === email){
                         aux[0].currentUser = true
                     }
                 }*/




            })

        console.log(users)

        return function cleanup(){
            abortController.abort()
        }

        


    }, [username])





    return users
}