import { foreignKey, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  viewerId: one(users, {
    fields: [subscriptions.viewerId],
    references: [users.id],
    relationName: "subscriptions_viewer_id_fk",
  }),
  creatorId: one(users, {
    fields: [subscriptions.creatorId],
    references: [users.id],
    relationName: "subscriptions_creator_id_fk",
  }),
}));
