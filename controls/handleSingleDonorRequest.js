const {
    doc,
    getDoc,
} = require('firebase/firestore')

let handleSingleDonorRequest = (db) => (req, res) => {
    const { donorcode, email } = req.body
    const docRef = doc(db, email , "donors");
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        donors = docSnap.data();
        delete donors.initialize;
        res.json(donors[donorcode])
    } else {
        res.json('does not exist')
    }
    })
}

module.exports = handleSingleDonorRequest