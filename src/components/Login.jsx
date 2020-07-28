import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom'
import './styles/login.css'
import 'firebase/auth';
import {useFirebaseApp, useUser} from 'reactfire';
import {useDispatch} from 'react-redux';
import { useCurrentUser } from '../useCurrentUser'


const Login = () =>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const firebase = useFirebaseApp();
    const user = useUser()
    //const currentUser = useCurrentUser() 

    const login = async (e) =>{
        e.preventDefault()
        try{
            await firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
                console.log("usuario logueado")
                
            })
            
        }catch(e){
            if(e.code === "auth/user-not-found"){
                alert("Email incorrecto")
            }
            if(e.code === "auth/wrong-password"){
                alert("Password incorrecta")
            }
        }
    }
    return(
        
        <div>
          {user &&
            <Redirect to={'/inicio/'}/>
            
          }
        <div className="form-sect">
          <div className="logo-sect">
            <h1>INSTAGRAM</h1>
            <p>Login to see photos and videos from your friends.</p>
          </div>
          <div className="form-group">
            <form action="#">
              <input type="email" name id="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
              <input type="password" id="name" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
              <button onClick={(e)=> login(e )}>Login</button>
            </form>
          </div>
        </div>
        <div className="login-sect">
          <p>Don't Have an account? <Link to="/sign_up">Sign up</Link></p>
        </div>
      </div>
    )
}

export default Login;