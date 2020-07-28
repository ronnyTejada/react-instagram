import React, { useState, useEffect } from 'react';
import './styles/modal.css'
import 'firebase/storage'
import 'firebase/firestore'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';

import { useFirebaseApp} from 'reactfire';

const Modal = ({ user, type, pCount }) => {
    const firebase = useFirebaseApp();
    const [porcentaje, setPorcentaje] = useState(0)

    const dispatch = useDispatch()
    const showModal = useSelector((state) => state.showModal)

    const uploadPhoto = (e) => {

        
      
        const file = e.target.files[0]
        const ref = firebase.storage().ref(`/imagenes/${file.name+ uuidv4()}`)
        const task = ref.put(file)
        const db = firebase.firestore()


        task.on('state_changed', snapshot => {
            let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setPorcentaje(porcentaje)
        }, error => {
            console.log(error.message)
        }, () => {

            task.snapshot.ref.getDownloadURL().then((url) => {
                console.log(user)
                db.collection('users').doc(user.username).update({
                    imgProfile: url,

                }).then(() => {
                    setPorcentaje(100)

                    dispatch({
                        
                        type: 'SHOW_MODAL',
                        payload: false
                    })
                    dispatch({
                        type: 'CHANGE_PHOTO',
                        payload: url
                    })
                })



            })



        })


    }
   
    
    const uploadPost = (e) => {

        const file = e.target.files[0]
        const ref = firebase.storage().ref(`/posts/${file.name}`)
        const task = ref.put(file)
        const db = firebase.firestore()

        task.on('state_changed', snapshot => {
            let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setPorcentaje(porcentaje)
        }, error => {
            console.log(error.message)
        }, () => {
            task.snapshot.ref.getDownloadURL().then((url) => {
                db.collection("posts").add({
                    url: url,
                    author: user.username,
                    authorImg: user.imgProfile,
                    likes: [],
                    comentarios_bd:[],
                    id: user.postsCount
                   
                }).then(()=>{
                    setPorcentaje(100)

                    dispatch({
                        
                        type: 'SHOW_MODAL',
                        payload: false
                    })
                    dispatch({
                        
                        type: 'NEW_POST',
                        payload: pCount += 1
                    })
                })
                db.collection("users").doc(user.username).update({
                    postsCount: user.postsCount + 1,


                })



            })
        })

    }

    const cancel = () => {
        dispatch({
            type: 'SHOW_MODAL',
            payload: false
        })
    }
    useEffect(() => {
        if (showModal === true) {
            setPorcentaje(0)
        }
    }, [showModal])

    return (
        <>
            {porcentaje === 100 &&
                <>


                </>
            }
            {showModal &&
                <>
                    {type === 'photo' &&
                        <div className='modal showModal '>
                            <progress value={porcentaje} max="100"></progress>

                            <div className="subModal">
                                <div className="title">
                                    <p>Change Profile Photo</p>
                                </div>
                                <div className="upload">

                                    <label class="custom-file-upload">
                                        <input type="file" onChange={(e) => uploadPhoto(e)} />
                                        <p>Upload Photo</p>
                                    </label>
                                </div>
                                <div className="cancel">
                                    <p onClick={() => cancel()}>Cancel</p>
                                </div>
                            </div>
                        </div>

                    }

                    {type === 'post' &&
                        < div className='modal showModal '>
                            <progress value={porcentaje} max="100"></progress>

                            <div className="subModal">
                                <div className="title">
                                    <p>Add A New Post</p>
                                </div>
                                <div className="upload">

                                    <label class="custom-file-upload">
                                        <input type="file" onChange={(e) => uploadPost(e)} />
                                        <p>Upload New Post</p>
                                    </label>
                                </div>
                                <div className="cancel">
                                    <p onClick={() => cancel()}>Cancel</p>
                                </div>
                            </div>
                        </div>

                    }

                </>

            }
            {
                !showModal &&
                <div className='modal '>

                    <div className="subModal">

                    </div>
                </div>

            }

        </>
    )
}

export default Modal;