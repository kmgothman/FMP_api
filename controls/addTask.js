//grab tasks from firebase
//sort them and grab the latest
//+1
//send to firebase
const {
    doc,
    getDoc,
    updateDoc
} = require('firebase/firestore')

let addTask = (db, email, task) => {
    const docRef = doc(db, email , "tasks");
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        updateObject={}
        existingTasks = docSnap.data();
        delete existingTasks.initialize;
        taskCodes=Object.keys(existingTasks)
        if(taskCodes.length) {
            taskCodes.sort()
            console.log(taskCodes)
            newCode=Number(taskCodes[taskCodes.length-1])+1
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
}

module.exports = addTask