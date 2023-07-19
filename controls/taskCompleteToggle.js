const {
    doc,
    getDoc,
    updateDoc,
    deleteField
} = require('firebase/firestore')

let taskCompleteToggle = (db) => (req, res) => {
    const email = req.body.email
    const task = req.body.task
    const docRef = doc(db, email, 'tasks',);

    id = task.taskid
    delete task.taskid
    updateObject = {}
    updateObject[id]=task
    updateObject[id].complete = !task.complete
    updateDoc(docRef, updateObject)

    res.json('done')
}

module.exports = taskCompleteToggle