const {
    doc,
    getDocs,
    collection
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

const checkForGapInLoggedGifts = (donationMonths) => {
    let months = ['','January','February','March','April','May','June','July','August','September','October','November','December']
    yyyymmArray=[]
    donationMonths.map((x)=>{
        [month,yyyy]=x.split(' ')
        mm = String(months.indexOf(month))
        if (mm.length ===1) {mm = '0'+mm}
        yyyymmArray.push(yyyy+mm)
    })
    firstMonth=yyyymmArray[0]
    lastMonth=yyyymmArray[yyyymmArray.length-1]
    count=firstMonth
    loggedGiftSpan=[firstMonth]
    x=0
    while (count != lastMonth) {
        yyyy=count.slice(0,4)
        mm=count.slice(4)
        if (mm === '12') {
            yyyy=Number(yyyy)+1
            mm='01'
        } else {
            mm=Number(mm)+1
            if (mm < 10) {
                mm= '0'+String(mm)
            }
        }
        count=String(yyyy)+String(mm)
        loggedGiftSpan.push(count)

        x=x+1
        if (x===100) {break}
    }
    let loggedGiftsSet = new Set(yyyymmArray)
    missingGiftsyyyymm=loggedGiftSpan.filter(x => !loggedGiftsSet.has(x))
    missingGifts=[]
    missingGiftsyyyymm.map((gift)=>{
        yyyy=gift.slice(0,4)
        mm = Number(gift.slice(4))
        monthName = months[mm] +' '+ String(yyyy)
        missingGifts.push(monthName)
    })
    return missingGifts

 }

const checkForLapsedGifts = (donorNames,donations,donationMonths,contacts) => {
    let months = ['','January','February','March','April','May','June','July','August','September','October','November','December']
    yyyymmArray=[]
    donationMonths.map((x)=>{
        [month,yyyy]=x.split(' ')
        mm = String(months.indexOf(month))
        if (mm.length ===1) {mm = '0'+mm}
        yyyymmArray.push(yyyy+mm)
    })

    const lapsedDonors = []
    donorNames.map((donorName)=>{
        dateArray = []
        giftMonths=[]

        donationMonths.map((donationMonth)=>{
            donations[donationMonth].map((donation)=>{
                if (donation.donorname === donorName) {
                    //"2/28/2023 12:00:00 AM"
                    date = donation.giftdate.split(' ')[0]
                    mySplit = date.split('/')
                    mm=mySplit[0]
                    yyyy=mySplit[2]
                    if (mm.length === 1) {mm='0'+mm}

                    dateArray.push(yyyy+mm)
                    giftMonths.push(months[Number(mm)] +' '+ String(yyyy))
                }
            })
        })
        
        let lastLoggedMonth = yyyymmArray[yyyymmArray.length-1]
        let secondLastMonth = yyyymmArray[yyyymmArray.length-2]

        if (dateArray[dateArray.length-1] != lastLoggedMonth && dateArray[dateArray.length-1] != secondLastMonth){
            donorsLastMonth = dateArray[dateArray.length-1]
            yyyy=donorsLastMonth.slice(0,4)
            mm = Number(donorsLastMonth.slice(4))
            
            monthName = months[mm] +' '+ String(yyyy)
            donorObject = contacts[donorName]
            donorObject['donorsLastMonth']=monthName
            donorObject['giftMonths']=giftMonths
            lapsedDonors.push(donorObject)
        }

    })
    return lapsedDonors
    }

const getDonorNamesFromContacts = (contacts) => {
    donorNames = []
    contactNames = Object.keys(contacts)
    contactNames.map((name)=>{
        if (contacts[name].donorcode) {
            donorNames.push(name)
        }
    })
    return donorNames
}


let handleLapsedGiftRequest = (db) => (req, res) => {
    const { email } = req.body
    getDocs(collection(db, email))
    .then((querySnapshot)=>{
        const response = {}
        const contactObject = {}
        querySnapshot.forEach((doc)=>{
            if (doc.id==='donations') {
                let donations=doc.data()
                delete donations.initialize
                let donationMonths = sortMonthNames(Object.keys(donations))
                missingGifts = checkForGapInLoggedGifts(donationMonths)
                contactObject['donationMonths'] = donationMonths
                contactObject['donations']=donations
                response['missingGifts'] = missingGifts

            } else if (doc.id==='contacts') {
                const contacts=doc.data()
                delete contacts.initialize
                contactObject['donorNames'] = getDonorNamesFromContacts(contacts)
                contactObject['contacts']=contacts
            }
        })
        let lapsedDonors = checkForLapsedGifts(contactObject.donorNames,contactObject.donations,contactObject.donationMonths,contactObject.contacts)

        response['lapsedDonors'] = lapsedDonors
        res.json(response)       
        })

}

module.exports = handleLapsedGiftRequest