import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import 'firebase/auth';
import 'firebase/firestore'
import { useFirebaseApp, useUser } from 'reactfire';
import { database } from 'firebase';
import {useDispatch} from 'react-redux';


const Search = ({ wordSearched = null}) => {
    //const wordSearched = useSelector((state) => state.wordSearched)
    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    const [users, setUsers] = useState([]);
    const [usersFiltrados, setUsersFiltrados] = useState([]);
    const value = "22"
    const dispatch = useDispatch()

    useEffect(() => {
        /*const docRef = db.collection('users').doc(wordSearched)

        docRef.get().then((doc)=>{
            if(doc.exists){
                console.log(doc.data())
            }else{
                console.log('no existe')
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        })*/
       /* db.collection("users").onSnapshot((doc) => {
            let user = []
            let aux = []
            doc.forEach(doc => {
                user.push({ username: doc.data().username })

            })
            aux = user.filter(item => item.username.toLowerCase().indexOf(wordSearched) !== -1)
            setUsers(aux)

        })*/
        dispatch({
            type: 'SEARCH',
            payload: wordSearched
        })
        





    }, [wordSearched])

    
    return (

        <div>
           
                <datalist id="browsers">

                    {users.map((u, i) => {
                        return (
                            
                            <option value={u.username} />

                        )
                    })}

                </datalist>
            

        </div>
    )
}

export default Search;