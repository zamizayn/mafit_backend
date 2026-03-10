const { Role } = require("../../models");

exports.createRole = async (req, res) => {

    const role = await Role.create(req.body);

    res.json(role);

};

exports.getRoles = async (req, res) => {

    const roles = await Role.findAll();

    res.json(roles);

};

exports.updateRole = async (req, res) => {

    await Role.update(req.body, {
        where: { id: req.params.id }
    });

    res.json({ message: "Role updated" });

};

exports.deleteRole = async (req, res) => {

    await Role.destroy({
        where: { id: req.params.id }
    });

    res.json({ message: "Role deleted" });

};


exports.assignPermissionsToRole = async (req, res) => {

    const { roleId, permissions } = req.body;

    const role = await Role.findByPk(roleId);

    await role.setPermissions(permissions);

    res.json({
        message: "Permissions assigned"
    });

};

exports.getRolePermissions = async (req, res) => {

    const role = await Role.findByPk(req.params.id, {

        include: {
            model: Permission
        }

    });

    res.json(role);

};