
const {
    doc,
    getDoc,
    updateDoc
} = require('firebase/firestore')

let addTask = (db, email, task) => {
    const docRef = doc(db, email , "tasks");
    try {
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        updateObject={}
        existingTasks = docSnap.data();
        delete existingTasks.initialize;
        taskCodes=Object.keys(existingTasks)
        if(taskCodes.length) {
            newCode=taskCodes.length+1
        } else {
            newCode = 1
        }
        
        updateObject[newCode]=task
        updateDoc(docRef, updateObject)
    } else {
        updateObject = {}
        newCode = 1
        updateObject[newCode]=task
        updateDoc(docRef, updateObject)
    }
    })
} catch (error) {
    console.log(error)
}
}

module.exports = addTask