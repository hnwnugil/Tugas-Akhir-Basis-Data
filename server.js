import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import playerRouter from "./routes/playerRoute.js"
import gamesRouter from "./routes/gamesRoute.js"
import mapsRouter from "./routes/mapsRoute.js"
import tasksRouter from "./routes/tasksRoute.js"
import playerTasksRouter from "./routes/playerTasksRoute.js"
import killsRouter from "./routes/killsRoute.js"
import reportsRouter from "./routes/reportsRoute.js"
import meetingsRouter from "./routes/meetingsRoute.js"
import votesRouter from "./routes/votesRoute.js"
import sabotageRouter from "./routes/sabotageRoute.js"


const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI


mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure   
});

app.use("/api/player", playerRouter);
app.use("/api/games", gamesRouter);
app.use("/api/maps", mapsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/playertasks", playerTasksRouter);
app.use("/api/kills", killsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/meetings", meetingsRouter);
app.use("/api/votes", votesRouter);
app.use("/api/sabotage", sabotageRouter);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});