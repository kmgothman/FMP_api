const {
    doc,
    getDoc,
} = require('firebase/firestore')

let handleContactsRequest = (db) => (req, res) => {
    const email = req.body.email
    const docRef = doc(db, email , "contacts");
    try {
        getDoc(docRef)
        .then((docSnap) => {
        if (docSnap.exists()) {
            contacts = docSnap.data();
            delete contacts.initialize;
            res.json(contacts)
        } else {
            res.json('does not exist')
        }
        })
    } catch (error) {
        res.json('error')
    }   
}

module.exports = handleContactsRequest