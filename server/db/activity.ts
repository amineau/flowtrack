import { Model, DataTypes } from "sequelize";
import type { Sequelize } from "sequelize/types";

export default (sequelize: Sequelize) => {
  class Activity extends Model {}
  Activity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stravaId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      movingTime: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      elapsedTime: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalElevationGain: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      averageSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      polyline: DataTypes.GEOMETRY("LINESTRING", 4326),
    },
    {
      sequelize,
    }
  );
  return Activity;
};
