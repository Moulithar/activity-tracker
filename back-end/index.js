import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => {
  return res.json("Activity tracker API is live");
});

app.get("/events", (req, res) => {
  return res.json([{ id: 1, title: "Sample event" }]);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Activity tracker API running on http://localhost:${PORT}`);
});
