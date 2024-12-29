import express from "express";
import path from "path";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/proxy", async (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.set("Content-Type", "application/rss+xml");
    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching the RSS feed");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
