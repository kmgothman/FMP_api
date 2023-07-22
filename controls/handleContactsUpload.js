

const {
    doc,
    updateDoc,
} = require('firebase/firestore')

let handleContactsUpload = (db) => (req, res) => {
    const data = req.body
	const email = req.headers.email
    array1 = data.split('\n')
    var contactsObject={}
	for (let x in array1) {
        if (x > 0 ) {
		let row = array1[x].split(',')
        key = row[0]+','+row[1]
        key = key.replaceAll('"','')
        contactsObject[key] = {
            name : key,
            city : row[3],
            state : row[4],
            postalcode : row[5],
            email : row[6],
            address : row[2],
            phone : row[7],
            donorcode : null
        }
        
    }
    }
    docRef = doc(db, email, "contacts");
    try {
    updateDoc(docRef, contactsObject)
    res.json('received request')
    } catch (error) {
        res.json(error)
    }
}

module.exports = handleContactsUpload