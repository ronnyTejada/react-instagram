import React, { useState } from 'react'
import './styles/logup.css'

import { Link } from 'react-router-dom'
import 'firebase/auth';
import 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';


import { useFirebaseApp, useUser } from 'reactfire';
import {useDispatch} from 'react-redux';
import {  Redirect } from 'react-router-dom'


const Logup = () => {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [redirect, setRedirect] = useState(false)
    // const [newUser, setNewUser] = useState(false)

    const firebase = useFirebaseApp();
    const db = firebase.firestore()
    let newUser = false;

    const signup = async (e) => {
        e.preventDefault()
        setLoading(true)
        await firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            

            db.collection('users').doc(userName).set({
                id: uuidv4(),
                email: email,
                username: userName,
                fullname: fullName,
                followers: [],
                followingName: [],
                followingImg: [],
                followersCount: 0,
                followingCount: 0,
                imgProfile: 'https://i.stack.imgur.com/l60Hf.png',
                postsCount:0
            }).then(ref => {
                alert("usuario registrado exitosamente")
                setLoading(false)
                setRedirect(true)
                dispatch({
                    type: 'NEW_USER',
                    payload: userName
                })
            }).catch(err =>{
                setLoading(false)

                alert(err)
            })



        }).catch(err =>{
            alert(err)
            setLoading(false)

        })




    }

    return (
        <>
            {redirect &&

                <Redirect to={'/login'}></Redirect>

            }
            <div className="form-sect">
                <div className="logo-sect">
                    <h1>INSTAGRAM</h1>
                    <p>Sign up to see photos and videos from your friends.</p>
                </div>
                <hr />
                <div className="form-group">
                    <form action="#">
                        <input type="email" name="" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <input type="text" id='name' placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} />
                        <input type="text" id='username' placeholder="UserName" onChange={(e) => setUserName(e.target.value)} />
                        <input type="password" id='name' placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        {!loading &&
                            <button onClick={(e) => signup(e)}>Sing up</button>

                        }
                        {loading &&
                            <button >Loading...</button>

                        }

                    </form>
                </div>


            </div>

            <div className="login-sect">
                <p>Have an account? <Link to="/login">Log in</Link></p>
            </div>
        </>

    )
}

export default Logup;