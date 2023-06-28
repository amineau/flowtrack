import db from "@/server/db";

db.sequelize.sync({ force: true });
