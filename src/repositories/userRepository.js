const User = require("../models/user");

exports.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.findById = async (id) => {
  return await User.findByPk(id);
};

exports.create = async (data) => {
  return await User.create(data);
};

exports.delete = async (user) => {
  return await user.destroy();
};

exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "email", "role"],
  });
};