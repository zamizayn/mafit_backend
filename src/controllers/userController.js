const bcrypt = require('bcrypt')
const { User } = require('../../models')


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
        const user = await User.findByPk(userId)

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

/*
### Authentication & Profile API
- **Token Issuance**: Updated `verifyOtp` in `src/controllers/authController.js` to create a basic user record and issue access/refresh tokens immediately after OTP verification, even for new users.
- **Registration**: Simplified `completeRegistration` to handle profile updates for the now-existing user record.
- **Get User Details**: Added a new `GET /users/me` API in `src/controllers/userController.js` to fetch the authenticated user's profile information.
- **Schema Fix**: Made the `name` column nullable in the `users` table via migration `20260310111801-make-user-name-nullable.js` to allow initial user creation with just a mobile number.

## Verification Results

### Full Flow Test
I verified the complete user journey using a test script:
1. **OTP Verification**: A new user verifies their OTP.
   - **Result**: User created, and tokens issued successfully.
2. **Registration**: The user completes registration with `age`, `height`, `weight`, and `goal`.
   - **Result**: Profile updated successfully.
3. **Get Details**: The user fetches their details using `GET /users/me`.
   - **Result**: Correct profile information returned.

```json
{
  "id": "6a99ce58-98ce-43c2-9096-adae3ea96059",
  "name": "Full Flow User",
  "email": "fullflow@example.com",
  "age": 25,
  "height": 175,
  "weight": 70,
  "goal": "Muscle gain"
  // ...
}
```
*/
