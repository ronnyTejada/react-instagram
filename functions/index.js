const functions = require('firebase-functions');
const admin = require('firebase-admin')
const users = []
admin.initializeApp(functions.config().firebase);

const db = admin.firestore()


exports.Search = functions.https.onRequest((req, res)=>{
    db.collection("users").onSnapshot((doc) => {
        doc.forEach(doc =>{
            console.log(doc.data())
            return res.send(doc.data())
        })
    })

});