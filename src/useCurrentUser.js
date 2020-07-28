import { useState, useEffect } from 'react'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';

export function useCurrentUser(username = null, email) {
    const [users, setUsers] = useState([]);

    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const u = useUser()
    
    const e = u.email
   
    useEffect(() => {
       

        db.collection("users").where('email', "==", e).limit(1)
             .get().then(function (querySnapshot) {
                let user = []
                let aux = []
                let aux2
                querySnapshot.forEach(doc => {
                    //console.log(doc.data())
                   
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
                        //currentUser: doc.data().email === u.email,
                        isFollowing: doc.data().followingName.includes(username)
                        
                    })
    
                })
            

            //filtrar usuario por email

            //aux = user.filter(item => item.email.toLowerCase().indexOf(email.toLowerCase()) !== -1)





            //setUsers(aux)

        })
    
        

    }, [username])





    return users
}