const {
    doc,
    setDoc,
} = require('firebase/firestore')

let createAccount = (db) => (req, res) => {
    const email = req.body.email
    setDoc(doc(db, email, "donations"), {"initialize":"initialize"});
    setDoc(doc(db, email, "donors"), {"initialize":"initialize"});
    setDoc(doc(db, email, "userinfo"), {"date joined": new Date(), "email":email});
    res.json('registered')
}

module.exports = createAccount