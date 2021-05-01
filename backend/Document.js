import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  _id: String,
  data: Object,
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
