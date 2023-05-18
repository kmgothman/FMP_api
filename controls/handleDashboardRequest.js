const {
    doc,
    getDocs,
    collection
} = require('firebase/firestore')

let calcTotalDonations = (donations) => {
    donationMonths = Object.keys(donations)
    sum = 0
    donationMonths.map((monthName)=>{
        month = donations[monthName]
        month.map((donation)=>{
            sum = sum + Number(donation.amount)
        })
    })
    return sum
}

let handleDashboardRequest = (db) => (req, res) => {
    const { email } = req.body
    console.log('received dashboard request')
    getDocs(collection(db, email))
    
    .then((querySnapshot)=>{
        
        querySnapshot.forEach((doc)=>{
            if (doc.id==='donations') {
                donations=doc.data()
                delete donations.initialize
                donationMonths = Object.keys(donations)
                totalDonations = calcTotalDonations(donations)
                monthlyAverage = Math.round((totalDonations/donationMonths.length)*100)/100
                

            } else if (doc.id==='donors') {
                donors=doc.data()
                delete donors.initialize
                donorIDs = Object.keys(donors)
                totalDonors = donorIDs.length
                averageDonation = Math.round((monthlyAverage/totalDonors)*100)/100
                response = {
                    donationMonths : donationMonths,
                    totalDonors : totalDonors,
                    totalDonations : totalDonations,
                    monthlyAverage : monthlyAverage,
                    averageDonation : averageDonation
                }

                res.json(response)
            }
        })       
        })

}

module.exports = handleDashboardRequest