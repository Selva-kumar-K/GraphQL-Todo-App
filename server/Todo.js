const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    title : {
        type : String
    },

    completed : {
        type : Boolean
    }
})

module.exports = new mongoose.model('Todo', TodoSchema)