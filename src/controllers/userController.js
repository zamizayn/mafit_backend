const bcrypt = require('bcrypt')
const { User, Role } = require('../../models')


//create user
exports.createUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })

    }
}

//delete user

exports.deleteUser = async (req, res) => {

    try {

        const { id } = req.params

        const user = await User.destroy({ where: { id } })

        res.json({ message: "User deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// get current user details
exports.getMe = async (req, res) => {
    try {
        const { userId } = req.user
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json(user)
    } catch (err) {
        console.error("Get user details error:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// update user name
exports.updateName = async (req, res) => {
    try {
        const { userId } = req.user
        const { name } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required" })
        }

        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await user.update({ name: name.trim() })

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })

        res.json({
            message: "Name updated successfully",
            user: updatedUser
        })
    } catch (err) {
        console.error("Update name error:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// get all trainers
exports.getTrainers = async (req, res) => {
    try {
        const trainers = await User.findAll({
            include: [{
                model: Role,
                where: { name: 'Trainer' },
                through: { attributes: [] }
            }]
        })

        res.json({
            success: true,
            data: trainers
        })
    } catch (err) {
        console.error("Get trainers error:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// create a trainer
exports.createTrainer = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body

        // 1. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 2. Create user (check for existing email first ideally, but keeping it simple as per existing flow)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            isActive: true,
            isVerified: true
        })

        // 3. Find Trainer Role
        const trainerRole = await Role.findOne({ where: { name: 'Trainer' } })

        if (trainerRole) {
            // 4. Assign role
            await user.addRole(trainerRole)
        }

        const trainerDetails = await User.findByPk(user.id, {
            include: [{
                model: Role,
                where: { name: 'Trainer' },
                through: { attributes: [] }
            }]
        })

        res.status(201).json({
            success: true,
            data: trainerDetails
        })
    } catch (err) {
        console.error("Create trainer error:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// get all users with pagination
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        })

        const totalPages = Math.ceil(count / limit)

        res.json({
            success: true,
            data: rows,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: page,
                limit
            }
        })
    } catch (err) {
        console.error("Get all users error:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
