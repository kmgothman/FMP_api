const {
    doc,
    getDoc,
} = require('firebase/firestore')

let handleDonorsRequest = (db) => (req, res) => {
    const email = req.body.email
    const docRef = doc(db, email , "donors");
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        donors = docSnap.data();
        delete donors.initialize;
        res.json(donors)
    } else {
        res.json('does not exist')
    }
    })
}

module.exports = handleDonorsRequest