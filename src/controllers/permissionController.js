const { Permission } = require("../../models");

exports.createPermission = async (req, res) => {

    try {

        const permission = await Permission.create(req.body);

        res.json(permission);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};

exports.getPermissions = async (req, res) => {

    const permissions = await Permission.findAll();

    res.json(permissions);

};

exports.getPermission = async (req, res) => {

    const permission = await Permission.findByPk(req.params.id);

    res.json(permission);

};

exports.updatePermission = async (req, res) => {

    await Permission.update(req.body, {
        where: { id: req.params.id }
    });

    res.json({ message: "Permission updated" });

};

exports.deletePermission = async (req, res) => {

    await Permission.destroy({
        where: { id: req.params.id }
    });

    res.json({ message: "Permission deleted" });

};

