const addTask = require('./addTask')


let handleCreateTaskRequest = (db) => (req, res) => {
    const email = req.body.email
    const task = req.body.task
    var date = new Date()
    let mmddyyyy = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear()
    task['date'] = mmddyyyy
    try {
    addTask(db, email, task)
    res.json('done')
    } catch (error) {
        res.json(error)
    }
}

module.exports = handleCreateTaskRequest