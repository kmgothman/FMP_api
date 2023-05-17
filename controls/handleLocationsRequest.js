const {
    getDocs,
    collection
} = require('firebase/firestore')


let handleLocationsRequest = (db) => (req, res) => {
    const { email } = req.body
    getDocs(collection(db, email))
    .then((querySnapshot)=>{
        
        querySnapshot.forEach((doc)=>{
            if (doc.id==='donations') {
                donations=doc.data()
                delete donations.initialize
                donationMonths = Object.keys(donations)
                
            } else if (doc.id==='donors') {
                donors=doc.data()
                delete donors.initialize
                donorIDs = Object.keys(donors)
                stateSums={}
                donationMonths.map((monthName)=>{
                    donations[monthName].map((donation)=>{
                        amount = Number(donation.amount)
                        donorcode = donation.donorcode
                        state = donors[donorcode].state
                        if (stateSums[state]) {
                        stateSum = stateSums[state] + amount
                        } else {stateSum = amount}
                        stateSums[state] = stateSum
                    })
                })
                res.json(stateSums)
            }
        })       
        })

}

module.exports = handleLocationsRequest