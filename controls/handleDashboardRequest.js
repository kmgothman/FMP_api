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

let calcDonationStats = (donations) => {
    let donationMonths = Object.keys(donations)
    totalSum = 0
    monthlyTotals = {}
    donationMonths.map((monthName)=>{
        monthSumOneTimes = 0
        monthSumMonthlys = 0
        month = donations[monthName]
        month.map((donation)=>{
            monthSumOneTimes = monthSumOneTimes + Number(donation.amount)
            if (donation.memo.includes('One') || donation.memo.includes('Mailed')) {
                
            } else {
                monthSumMonthlys = monthSumMonthlys + Number(donation.amount)
            }   
            
        })
        monthlyTotals[monthName] = {
            oneTimes : monthSumOneTimes,
            Monthlys : monthSumMonthlys
        }
        totalSum = totalSum + monthSumOneTimes
    })
    statsObject = {
        totalDonations : Math.round(totalSum),
        monthlyTotals : monthlyTotals
    }
    return statsObject
}

let getDonorNames = (contactsObject) => {
    contactNames = Object.keys(contactsObject)
    let donorNames = []
    contactNames.map((name)=>{
        if (contactsObject[name].donorcode) {
            donorNames.push(name)
        }
    })
    return donorNames
}

let getIncompleteIndexes = (tasksObject) => {
    allIndexes = Object.keys(tasksObject)
    incompleteIndexes = []
    allIndexes.map((index)=>{
        if (!tasksObject[index].complete) {
            incompleteIndexes.push(index)
        }
    })
    return incompleteIndexes
}

let getHistoryData = (tasksObject) => {
    //appointments completed
    //calls made
    //emails sent
    //newsletters sent
    allIndexes = Object.keys(tasksObject)
    historyObject = {
        appointments : 0,
        calls : 0,
        emails : 0,
        newsletters : 0,
        thank : 0
    }
    allIndexes.map((index)=>{
        if (tasksObject[index].complete) {
            let type = tasksObject[index].type
            switch (type) {
                case 'appointment':
                    historyObject['appointments']=historyObject.appointments + 1;
                case 'call':
                    historyObject['calls']=historyObject.calls + 1;
                case 'email':
                    historyObject['emails']=historyObject.emails + 1;
                case 'newsletter':
                    historyObject['newsletters']=historyObject.newsletters + 1;
                case 'thank' :
                    historyObject['thank'] = historyObject.thank + 1
            }
            
        }
    })
    return historyObject

}

let handleDashboardRequest = (db) => (req, res) => {
    const { email } = req.body
    try {
    getDocs(collection(db, email))
    .then((querySnapshot)=>{
        const dataObject={}
        querySnapshot.forEach((doc)=>{
            if (doc.id==='donations') {
                const donations = doc.data()
                delete donations.initialize
                dataObject['donations']= donations
            } else if (doc.id==='contacts') {
                const contacts = doc.data()
                delete contacts.initialize
                dataObject['contacts']= contacts
            } else if (doc.id === 'tasks') {
                const tasks = doc.data()
                delete tasks.initialize
                dataObject['tasks'] = tasks
            }
        })
        //donations
        const donationMonths = sortMonthNames(Object.keys(dataObject.donations))
        donationStats = calcDonationStats(dataObject.donations)
        monthlyAverage = Math.round(donationStats.totalDonations/donationMonths.length)
        //contacts 
        contactNamess = Object.keys(dataObject.contacts)
        donorNames = getDonorNames(dataObject.contacts)
        totalDonors = donorNames.length
        averageDonation = Math.round(monthlyAverage/totalDonors)
        //tasks
        incompleteIndexes = getIncompleteIndexes(dataObject.tasks)
        //history
        historyObject = getHistoryData(dataObject.tasks)
        response = {
            donationMonths : donationMonths,
            totalDonors : totalDonors,
            donationStats : donationStats,
            monthlyAverage : monthlyAverage,
            averageDonation : averageDonation,
            historyObject : historyObject,
            incompleteTasks : incompleteIndexes.length
        }
        res.json(response)
        })
    } catch (error) {
        res.json(error)
    }

}

module.exports = handleDashboardRequest