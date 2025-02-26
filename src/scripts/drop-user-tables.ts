import { db } from "@/db";

async function dropTables() {
  try {
    throw new Error("This script is for development purposes only");
    await db.execute(`DROP TABLE IF EXISTS verification CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS account CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS session CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "user" CASCADE`);
    console.log("All tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

dropTables();
