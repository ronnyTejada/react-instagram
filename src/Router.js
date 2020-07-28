import React, { } from 'react';
import { BrowserRouter, Router, Switch, Route, Redirect } from 'react-router-dom';



import Login from './components/Login'
import Logup from './components/Logup'
import Profile from './components/Profile'
import Search from './components/Search'

import { useUser } from 'reactfire';
import Explore from './components/Explore';
import Inicio from './components/Inicio';
import PostDetail from './components/PostDetail';


const MyRouter = () => {

    const user = useUser()



    return (
        <BrowserRouter>

            {/*configurar rutas */}

            <Switch>

                <Route exact path="/login" component={Login} />

                <Route exact path="/sign_up" component={Logup} />
                {!user &&
                    <>
                        <Route exact path="/" render={
                            () => { return <Redirect to='/login' /> }
                        } />

                        <Route exact path="/profile/:user_name" render={
                            () => { return <Redirect to='/login' /> }
                        } />
                        <Route exact path="/explore" render={
                            () => { return <Redirect to='/login' /> }
                        } />
                    </>

                }
                {user &&
                    <>


                        <Route exact path="/" component={Inicio} />



                        <Route exact path="/search" component={Search} />
                        <Route exact path="/post/:id" render={
                            (props) => {
                                const id = props.match.params.id

                                return <PostDetail id={id} />
                            }
                        } />


                        <Route exact path="/inicio" component={Inicio} />


                        <Route exact path="/explore" component={Explore} />

                        <Route exact path="/profile/:user_name" render={
                            (props) => {

                                const user_name = props.match.params.user_name

                                return <Profile user_name={user_name} />
                            }
                        } />

                    </>
                }








            </Switch>



        </BrowserRouter>
    )
}

export default MyRouter;