const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- MongoDB ---
mongoose.connect("mongodb://127.0.0.1:27017/fitness_clients")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// --- Схема ---
const ClientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    weight: Number,
    goal: String
});

const Client = mongoose.model("Client", ClientSchema);

// --- Маршрути ---
app.get("/clients", async (req, res) => {
    const data = await Client.find();
    res.json(data);
});

app.post("/clients", async (req, res) => {
    const client = new Client(req.body);
    await client.save();
    res.json(client);
});

app.put("/clients/:id", async (req, res) => {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete("/clients/:id", async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(3002, () => {
    console.log("Lab3 running at http://localhost:3002");
});