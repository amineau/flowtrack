import { Sequelize } from "sequelize";
import User from "./user";
import Activity from "./activity";
import Stream from "./stream";

const models = [User, Activity, Stream];

const sequelize = new Sequelize({
  dialect: "postgres",
  database: "geotracker",
  username: "geotracker",
  password: "geotracker",
  host: "localhost",
  port: 5433,
  logQueryParameters: true,
});

const db: {
  models: { [key: string]: any };
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
} = {
  models: {},
  sequelize,
  Sequelize,
};

models.forEach(async (model) => {
  db.models[model.name] = model(sequelize);
});

Object.values(db.models).forEach((model) => {
  if (model.associate) {
    model.associate(db.models);
  }
});

const syncDb = async () => {
  console.log("synchronizing database...");
  await db.sequelize.sync({ force: true });
  console.log("... synchronization Ok");
};

// syncDb();

export default db;
