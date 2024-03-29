const {
    doc,
    getDoc,
} = require('firebase/firestore')

let handleTasksRequest = (db) => (req, res) => {
    const email = req.body.email
    const docRef = doc(db, email , "tasks");
    try {
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        tasks = docSnap.data();
        delete tasks.initialize;
        finalTaskArray = []
        taskCodes=Object.keys(tasks)
        taskCodes.map((code)=>{
            if (!tasks[code].complete) {
                taskObject = tasks[code]
                taskObject['taskid']=code
                finalTaskArray.push(tasks[code])
            }
        })
        res.json(finalTaskArray)
    } else {
        res.json({})
    }
    })
} catch (error) {
    res.json(error)
}
}

module.exports = handleTasksRequest