// Підключаємо необхідні бібліотеки
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// Створюємо сервер Express
const app = express();

// Дозволяємо запити з браузера
app.use(cors());

// Дозволяємо серверу приймати JSON-дані
app.use(express.json());

// Підключаємо папку public для статичних файлів
app.use(express.static(path.join(__dirname, "public")));

// ---------- ПІДКЛЮЧЕННЯ ДО MONGODB ----------
// Підключаємось до локальної бази MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/fitness_clients")
    .then(() => console.log("MongoDB підключено"))
    .catch(err => console.error("Помилка MongoDB:", err));

// ---------- СХЕМА ДАНИХ ----------
// Описуємо структуру клієнта фітнес-тренера
const ClientSchema = new mongoose.Schema({
    name: String,   // ім’я клієнта
    age: Number,    // вік
    weight: Number, // вага
    goal: String    // ціль тренувань
});

// Створюємо модель для роботи з колекцією
const Client = mongoose.model("Client", ClientSchema);

// ---------- ОТРИМАННЯ СПИСКУ КЛІЄНТІВ ----------
// Підтримує пошук по імені та сортування
app.get("/clients", async (req, res) => {
    const { search = "", sort = "name" } = req.query;

    // Пошук клієнтів за іменем (без врахування регістру)
    const clients = await Client.find({
        name: { $regex: search, $options: "i" }
    }).sort(sort);

    res.json(clients);
});

// ---------- ДОДАВАННЯ КЛІЄНТА ----------
app.post("/clients", async (req, res) => {
    const client = new Client(req.body);
    await client.save();
    res.json(client);
});

// ---------- РЕДАГУВАННЯ КЛІЄНТА ----------
app.put("/clients/:id", async (req, res) => {
    const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedClient);
});

// ---------- ВИДАЛЕННЯ КЛІЄНТА ----------
app.delete("/clients/:id", async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// ---------- ГОЛОВНА СТОРІНКА ----------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- ЗАПУСК СЕРВЕРА ----------
app.listen(3003, () => {
    console.log("Lab4 працює на http://localhost:3003");
});