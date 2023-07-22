const {
    doc,
    getDoc,
    updateDoc,
    deleteField
} = require('firebase/firestore')

let handleCompleteAllTasksRequest = (db) => (req, res) => {
    const email = req.body.email
    const docRef = doc(db, email, 'tasks',);
    try {
    getDoc(docRef)
    .then((docSnap) => {
        if (docSnap.exists()) {
            let tasksObject = docSnap.data()
            let taskIDs = Object.keys(tasksObject)
            if (taskIDs.length) {
                taskIDs.map((id)=>{
                let task = tasksObject[id]
                task['complete'] = true
                tasksObject[id] = task
            })
            updateDoc(docRef, tasksObject)
        }
        }
        res.json('done')
    }
    )
} catch (error) {
    res.json(error)
}

}

module.exports = handleCompleteAllTasksRequest