const {
    doc,
    getDoc,
    updateDoc,
} = require('firebase/firestore')

let confirmNewDonors = (db) => (req, res) => {
    //update contacts in firebase
    console.log('donor confirmation')
    const contactsObject = req.body.contactsObject
    const { email } = req.body

    contactsRef = doc(db, email, "contacts");
    try{
        updateDoc(contactsRef, contactsObject)
    } catch (error) {
        res.json(error)
        return
    }

    //add new tasks
    const docRef = doc(db, email , "tasks");
    try {
    getDoc(docRef)
    .then((docSnap) => {
    if (docSnap.exists()) {
        existingTasks = docSnap.data();
        delete existingTasks.initialize;
        taskCodes=Object.keys(existingTasks)
        if(taskCodes.length) {
            taskCodes.sort()
            console.log(taskCodes)
            code=Number(taskCodes[taskCodes.length-1])+1
        } else {
            code = 1
        }
    } else {
        code = 1
    }
    tasksObject={}
    contactsArray = Object.keys(contactsObject)
    const date= new Date()
    contactsArray.map((contact)=>{
        task = {}
        task['date'] = date.getMonth()+1 +'/'+ date.getDate() +'/'+ date.getFullYear()
        task['type'] = 'thank'
        task['description'] = 'send thank you for their new gift'
        task['complete'] = false
        task['name']=contact
        task['donorcode']=contactsObject[contact].donorcode

        tasksObject[code]=task
        code=code+1
    })
    updateDoc(docRef,tasksObject)
    res.json('done')

    }) 
} catch (error) {
    res.json(error)
}
    
    
}

module.exports = confirmNewDonors