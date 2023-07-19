const addTask = require('./addTask')

let handleCreateTaskRequest = (db) => (req, res) => {
    const email = req.body.email
    const task = req.body.task
    addTask(db, email, task)
    res.json('done')
}

module.exports = handleCreateTaskRequest