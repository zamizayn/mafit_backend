const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Otp } = require('../../models')


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            accessToken,
            refreshToken,
            user
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Internal server error" })
    }

}

exports.sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body

        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" })
        }

        const mobileStr = String(mobile)
        const user = await User.findOne({ where: { mobile: mobileStr } })

        // Generate a 6-digit random OTP
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString()

        // Set expiration to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Save OTP to database
        await Otp.create({
            userId: user ? user.id : null,
            mobile: mobileStr,
            otp: otpValue,
            type: 'login',
            expiresAt,
            isUsed: false
        })

        // In a real scenario, you would send this OTP via SMS here.
        res.json({
            message: "OTP sent successfully",
            otp: otpValue, // Included for development/testing convenience
            expiresAt,
            user: user ? user : null
        })

    } catch (error) {
        console.error("Send OTP error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body

        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile and OTP are required" })
        }

        const mobileStr = String(mobile)

        const otpRecord = await Otp.findOne({
            where: {
                mobile: mobileStr,
                otp,
                isUsed: false,
                expiresAt: { [require('sequelize').Op.gt]: new Date() }
            },
            order: [['createdAt', 'DESC']]
        })

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        // Mark OTP as used
        await otpRecord.update({ isUsed: true })

        let user = await User.findOne({ where: { mobile: mobileStr } })

        let isNewUser = false
        if (!user) {
            isNewUser = true
            // Create a basic user record for new users
            user = await User.create({
                mobile: mobileStr,
                isActive: true,
                isVerified: true
            })
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            message: isNewUser ? "OTP verified. User created." : "Login successful",
            isNewUser,
            accessToken,
            refreshToken,
            user
        })

    } catch (error) {
        console.error("Verify OTP error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

exports.completeRegistration = async (req, res) => {
    try {
        const { mobile, name, email, password, age, height, weight, goal } = req.body

        if (!mobile || !name || !email) {
            return res.status(400).json({ message: "Mobile, name, and email are required" })
        }

        const mobileStr = String(mobile)

        let user = await User.findOne({ where: { mobile: mobileStr } })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Update user profile
        await user.update({
            name,
            email,
            password: password ? await bcrypt.hash(password, 10) : user.password,
            age: age || user.age,
            height: height || user.height,
            weight: weight || user.weight,
            goal: goal || user.goal
        })

        res.json({
            message: "Registration completed successfully",
            user
        })

    } catch (error) {
        console.error("Complete registration error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}