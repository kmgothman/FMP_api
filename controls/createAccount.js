const {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection
} = require('firebase/firestore')

let createAccount = (db) => (req, res) => {
    const email = req.body.email
    const userDocRef = doc(db, email, 'donations');

    getDoc(userDocRef)
    .then((userSnapshot)=>{
        //console.log(userSnapshot)
        if (!userSnapshot.exists()) {
            const createdAt = new Date()
    
            try {
                setDoc(doc(db, email, "donations"), {});
                setDoc(doc(db, email, "contacts"), {});
                setDoc(doc(db, email, "tasks"), {});
                setDoc(doc(db, email, "userinfo"), {"date joined": new Date(), "email":email});
            } catch (error) {
                console.log('error creating user', error.message)
            }
        }
    })

        // console.log('create account request')
        // const email = req.body.email
        // setDoc(doc(db, email, "donations"), {});
        // setDoc(doc(db, email, "contacts"), {});
        // setDoc(doc(db, email, "tasks"), {});
        // setDoc(doc(db, email, "userinfo"), {"date joined": new Date(), "email":email});
        // res.json('registered')
}

module.exports = createAccount