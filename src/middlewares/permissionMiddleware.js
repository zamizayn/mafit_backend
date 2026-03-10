const { sequelize } = require('../../models')
const { QueryTypes } = require('sequelize')

module.exports = (permissionName) => {

    return async (req, res, next) => {

        try {

            const userId = req.user.userId

            const results = await sequelize.query(`
        SELECT p.name
        FROM permissions p
        JOIN role_permissions rp ON rp."permissionId" = p.id
        JOIN roles r ON r.id = rp."roleId"
        JOIN user_roles ur ON ur."roleId" = r.id
        WHERE ur."userId" = :userId
      `, {
                replacements: { userId },
                type: QueryTypes.SELECT
            })

            const permissions = results.map(p => p.name)

            if (!permissions.includes(permissionName)) {
                return res.status(403).json({
                    message: "Permission denied"
                })
            }

            next()

        } catch (error) {

            console.error("Permission middleware error:", error)

            res.status(500).json({
                message: "Internal server error"
            })

        }

    }

}