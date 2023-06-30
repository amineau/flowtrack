import { Model, DataTypes } from "sequelize";
import type { Sequelize } from "sequelize/types";

export default (sequelize: Sequelize) => {
  class Stream extends Model {
    static associate(models: any) {
      Stream.belongsTo(models.Activity);
    }
  }
  Stream.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: [
          "time",
          "latlng",
          "altitude",
          "temp",
          "cadence",
          "moving",
          "distance",
          "velocity_smooth",
        ],
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
    }
  );
  return Stream;
};
