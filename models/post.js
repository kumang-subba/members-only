const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true, maxLength: 250 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post_time: { type: Date },
});

PostSchema.virtual("post_time_formatted").get(function () {
  return DateTime.fromJSDate(this.post_time).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Post", PostSchema);
