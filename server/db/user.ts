import { Model, DataTypes } from "sequelize";
import type { Sequelize } from "sequelize/types";

export default (sequelize: Sequelize) => {
  class User extends Model {
    static associate(models: any) {
      User.hasMany(models.Activity);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stravaId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLogin: DataTypes.DATE,
    },
    {
      sequelize,
      updatedAt: false,
    }
  );
  return User;
};
