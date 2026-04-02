require('dotenv').config()

const express = require('express')
const cors = require('cors')
const sequelize = require('./src/config/database')

const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const roleRoutes = require('./src/routes/roleRoutes')
const permissionRoutes = require('./src/routes/permissionRoutes')

const app = express()
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())

const facilityRoutes = require('./src/routes/facilityRoutes')
const branchRoutes = require('./src/routes/branchRoutes')
const slotRoutes = require('./src/routes/slotRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')

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
app.use('/facilities', facilityRoutes)
app.use('/branches', branchRoutes)
app.use('/slots', slotRoutes)
app.use('/bookings', bookingRoutes)