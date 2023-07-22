const {
    doc,
    getDoc,
    collection,
    getDocs
} = require('firebase/firestore')

let handleSingleDonorRequest = (db) => (req, res) => {
    const { donorcode, email, name } = req.body
    const cRef = collection(db, email);
    try { 
    getDocs(cRef)
    .then((snapshot) => {
        const data={} //contactinfo, tasks, history, donations
        snapshot.forEach((doc)=>{
            switch (doc.id) {
                case "contacts":
                    data["contactinfo"] = doc.data()[name]
                    break
                case "tasks":
                    let tasksArray = []
                    let historyArray = []

                    let tasksObject = doc.data()
                    let indices = Object.keys(tasksObject)
                    indices.map((index)=>{
                        let object = tasksObject[index]
                        object['taskid']=index
  
                        if (object.donorcode == donorcode && object.complete) {
                            tasksArray.push(object)
                        } else if (object.donorcode == donorcode){
                            historyArray.push(object)
                        }
                    
                    })
                    data['tasks']=tasksArray
                    data['history']=historyArray
                    break
                case "donations":
                    donationsArray = []
                    donationsObject = doc.data()
                    months = Object.keys(donationsObject)
                    months.map((monthName)=>{
                        let monthArray=donationsObject[monthName]
                        monthArray.map((donation)=>{
                            if (donation.donorcode == donorcode) {
                                donationsArray.push(donation)
                            }
                        })
                    })
                    data['donations']=donationsArray
                    break
                case "userinfo":
                    break
            }
        })
        res.json(data)
    })
} catch (error) {
    res.json(error)
}
}

module.exports = handleSingleDonorRequest