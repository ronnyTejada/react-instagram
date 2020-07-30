import React, { Component, useState } from 'react'
import './styles/header.css'
import {useDispatch} from 'react-redux';
import Search from './Search'
import { Link, Redirect } from 'react-router-dom'
import { useCurrentUser } from '../useCurrentUser'

const Header=({profileImg})=>{
    let searchRef = React.createRef();
    const dispatch = useDispatch()
    const [redirect, setRedirect] = useState(false)
    const [wordSearched, setWordSearched] = useState('')
    const user = useCurrentUser()


    const search = (e) =>{
        e.preventDefault();
        setWordSearched(searchRef.current.value)
        
        setRedirect(true)
        dispatch({
            type: 'SEARCH',
            payload: wordSearched
        })

        

    }
    return(
        <>  
            {redirect &&
                <Redirect to={'/profile/'+ wordSearched}/>
            }
            <header>
                <div className="contenedor-logo">
                    <Link to={'/inicio'}><span className="logo">INSTAGRAM</span> </Link>
                </div>
                <div className="barra-busqueda">
                    <form  onSubmit={(e)=>search(e)}>
                         <input type="text" placeholder="search" ref={searchRef} list="browsers" name="browser" />
                         <Search wordSearched={wordSearched}/>

                    </form>
                </div>
                <div className="btns-header">
                    <button><Link to={'/inicio'}><i className="fas fa-home i-header" /></Link></button>
                    <button><i className="fas fa-location-arrow i-header" /></button>
                    <button><Link to={'/explore'}><i className="far fa-compass i-header" /></Link></button>
                    <button><i className="far fa-heart i-header" /></button>
                    <button className="menu-img"><Link to={'/profile/'+user.username}><img src={profileImg} alt="" className='imgHeader' /></Link></button>
                </div>
            </header>
            <div className="back-header">
            </div>
        
        
        </>
    )
}

export default Header;