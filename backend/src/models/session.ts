import database from "../config/database";

export const SessionModel = database.model(
  "Session",
  new database.Schema(
    {
      _id: { type: String, required: true },
      user_id: database.Schema.Types.ObjectId,
      expires_at: { type: String, required: true },
    },
    { _id: false },
  ),
);
