const {
    getDocs,
    collection
} = require('firebase/firestore')


let handleLocationsRequest = (db) => (req, res) => {
    const { email } = req.body
    try {
    getDocs(collection(db, email))
    .then((querySnapshot)=>{
        const donations = {}
        const contacts = {}
        querySnapshot.forEach((doc)=>{
            if (doc.id==='donations') {
                const donationsVariable=doc.data()
                delete donationsVariable.initialize
                donationMonths = Object.keys(donationsVariable)
                donationMonths.map((month)=>{
                    donations[month]=donationsVariable[month]
                })
                
                
                
            } else if (doc.id==='contacts') {
                const contactsVariable=doc.data()
                delete contactsVariable.initialize
                contactNames = Object.keys(contactsVariable)
                contactNames.map((name)=>{
                    contacts[name]=contactsVariable[name]
                })
                
            }
        }) 
        donationMonths = Object.keys(donations) 
        const donors = {}
        contactNames = Object.keys(contacts)
        contactNames.map((name)=>{
            if (contacts[name].donorcode) {
                donors[name]=contacts[name]
            }
        })
        stateSums={}
        donationMonths.map((monthName)=>{
            donations[monthName].map((donation)=>{
                amount = Number(donation.amount)
                donorname = donation.donorname
                try {state = donors[donorname].state} 
                catch (error) {console.log(error)}
                
                if (stateSums[state]) {
                    stateSum = stateSums[state] + amount
                } else {stateSum = amount}
                    stateSums[state] = stateSum
            })
        })
        let states = Object.keys(stateSums)
        states.map((state)=>{
            roundedNumber = Math.round(Number(stateSums[state]))
            stateSums[state] = roundedNumber
        })
        res.json(stateSums)     
        })
    } catch (error) {
        res.json(error)
    }
}

module.exports = handleLocationsRequest