import User from "../models/user.js";

export const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

export const findById = async (id) => {
  return await User.findByPk(id);
};

export const create = async (data) => {
  return await User.create(data);
};

export const deleteUser = async (user) => {
  return await user.destroy();
};

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "email", "role"],
  });
};