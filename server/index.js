const express = require('express')
require('dotenv').config()
const schema = require('./schema')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const connectDB = require('./db')
const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql :process.env.NODE_ENV === 'development'
}))

app.listen(PORT, () => {
    console.log(`Server is listening on the port no : ${PORT}`)
}) 


