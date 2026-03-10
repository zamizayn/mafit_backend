require('dotenv').config()

const express = require('express')
const sequelize = require('./src/config/database')

const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const roleRoutes = require('./src/routes/roleRoutes')
const permissionRoutes = require('./src/routes/permissionRoutes')

const app = express()
app.use(express.json())

sequelize.authenticate()
    .then(() => {
        console.log("✅ PostgreSQL connected")
    })
    .catch(err => {
        console.error("❌ DB connection error:", err)
    })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/roles', roleRoutes)
app.use('/permissions', permissionRoutes)