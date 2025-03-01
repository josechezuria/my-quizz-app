import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { router as quizRoutes } from "./routes/quizRoutes.js"
import session  from "express-session";

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

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true
}));

app.use("/quiz", quizRoutes);

app.get("/", (req, res) => {
    res.render("index");
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
