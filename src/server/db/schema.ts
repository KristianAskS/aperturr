import { auth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `aperturr_${name}`);

export const user = createTable("user", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  clerkUserId: varchar("clerk_user_id", { length: 256 }).notNull().unique(),
  discordId: varchar("discord_id", { length: 256 }).unique(), // optional
  profilePicture: varchar("profile_picture", { length: 256 }),
});

// paragraph table
export const paragraph = createTable("paragraph", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  maxFines: integer("max_fines").notNull(),
  shortId: varchar("short_id", { length: 256 }).notNull().unique(),
});

// fine 
export const fine = createTable("fine", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  paragraphTitle: varchar("paragraph_title", { length: 256 }).notNull(),
  paragraphShortId: varchar("paragraph_short_id", { length: 256 }).notNull(),
  description: text("description").notNull(),
  numFines: integer("num_fines").notNull(),
  imageLink: text("image_link"),
  approved: boolean("approved").default(false).notNull(),
  reimbursed: boolean("reimbursed").default(false).notNull(),
  offenderClerkId: varchar("offender_id", { length: 256 }).notNull(),
  offenderName: varchar("offender_name", { length: 256 }).notNull(),
  issuerName: varchar("issuer_name", { length: 256 }).notNull(),
  date: timestamp("date", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type ParagraphType = typeof paragraph.$inferSelect;

export type ParagraphInsertType = typeof paragraph.$inferInsert;
