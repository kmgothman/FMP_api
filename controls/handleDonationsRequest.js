const {
    doc,
    getDoc,
} = require('firebase/firestore')

const sortMonthNames = (unsortedMonthNames) => {
    let months = ['','January','February','March','April','May','June','July','August','September','October','November','December']
    yyyymmArray=[]
    sortedMonthNames = []
    unsortedMonthNames.map((unsortedMonthName)=>{
        [month,yyyy]=unsortedMonthName.split(' ')
        let mm = String(months.indexOf(month))
        if (mm.length === 1) {mm = '0'+mm}
        yyyymm=yyyy+mm
        yyyymmArray.push(yyyymm)
    })
    yyyymmArray.sort()
    yyyymmArray.map((yyyymm)=>{
        yyyy=yyyymm.slice(0,4)
        mm = yyyymm.slice(4)
        if (mm[0]==='0') {mm=mm.slice(1)}
        sortedMonthNames.push(months[mm]+' '+yyyy)
    })
    return sortedMonthNames
}

let handleDonationsRequest = (db) => (req, res) => {
    const email = req.body.email
    const docRef = doc(db, email , "donations");
    try {
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        donations = docSnap.data();
        delete donations.initialize;

        let unsortedMonthNames = Object.keys(donations)
        sortedMonthNames = sortMonthNames(unsortedMonthNames)

        donationSums = []
        sortedMonthNames.map((monthName)=>{
            donationsArray = donations[monthName]
            let sum = 0
            donationsArray.map((donation) => {
                sum = sum + Number(donation.amount)
            })
            donationSums.push(String(sum))
        })

        responseObject = {
            donations : donations,
            monthNames : sortedMonthNames,
            donationSums : donationSums
        }

        res.json(responseObject)

    } else {
    console.log("No such document!");
    res.json('no such object')
    }
    })
} catch (error) {
    res.json(error)
}
}

module.exports = handleDonationsRequest