import database from "../config/database";

export const UserModel = database.model(
  "User",
  new database.Schema(
    {
      name: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    } as const,
    {
      timestamps: true,
    },
  ),
);
