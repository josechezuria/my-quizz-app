import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware and Static Files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.render("index");
  });

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/", (req, res) => {
    console.log(req.body);
    res.redirect("/signup");
  });

app.post("/signup", (req, res) => {
  console.log(req.body);
  res.redirect("/language-selection");
});

app.post("/signin", (req, res) => {
  console.log(req.body);
  res.redirect("/language-selection");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
