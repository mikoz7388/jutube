import { foreignKey, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { primaryKey } from "drizzle-orm/pg-core";

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id").notNull(),
    creatorId: uuid("creator_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId],
    }),
    foreignKey({
      name: "subscriptions_viewer_id_fk",
      columns: [t.viewerId],
      foreignColumns: [users.id],
    }),
    foreignKey({
      name: "subscriptions_creator_id_fk",
      columns: [t.creatorId],
      foreignColumns: [users.id],
    }),
  ],
);
