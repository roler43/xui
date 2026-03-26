const express = require('express');
const app = express();
const path = require('path');

// Рендер сам подставит порт, или будет 3000
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Твой ID для админки и профиля
const MY_ID = 2046759833;

let data = {
    userData: {
        id: MY_ID,
        username: "Кровавый флакон",
        balance: 5000.0,
        isAdmin: true
    },
    cases: [
        { id: "c1", name: "FARM Case", price: 0, image: "images/refcase15.webp" },
        { id: "c2", name: "STARS Case", price: 500, image: "images/StarsBanner.webp" }
    ]
};

// --- API ---
app.get('/api/user-data', (req, res) => res.json(data.userData));
app.get('/api/get-cases', (req, res) => res.json({ "all": data.cases }));

// ВШИТАЯ АДМИНКА (теперь файл admin.html не нужен)
app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Force Admin</title>
            <style>
                body { background: #0d0d0d; color: #fff; font-family: sans-serif; padding: 20px; text-align: center; }
                .card { background: #161616; padding: 20px; border-radius: 15px; border: 1px solid #333; margin: 15px auto; max-width: 400px; }
                input { width: 90%; padding: 12px; margin: 10px 0; background: #222; border: 1px solid #444; color: #fff; border-radius: 8px; }
                button { width: 90%; padding: 15px; background: #007bff; border: none; color: #fff; border-radius: 10px; font-weight: bold; }
                h2 { color: #007bff; font-size: 14px; text-transform: uppercase; }
            </style>
        </head>
        <body>
            <h1>Управление Force</h1>
            <div class="card">
                <h2>📦 Добавить кейс</h2>
                <input id="n" placeholder="Название (ALL IN SWISS)">
                <input id="p" type="number" placeholder="Цена в звездах">
                <input id="i" placeholder="Картинка (images/force.jpg)">
                <button onclick="send('/api/admin/add-case', {name:v('n'), price:v('p'), image:v('i')})">Добавить</button>
            </div>
            <div class="card">
                <h2>💰 Баланс (Твой ID: ${MY_ID})</h2>
                <input id="b" type="number" placeholder="Сумма">
                <button onclick="send('/api/admin/set-balance', {amount:v('b')})">Установить баланс</button>
            </div>
            <script>
                const v = id => document.getElementById(id).value;
                async function send(p, d) {
                    await fetch(p, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d)});
                    alert('Готово!');
                }
            </script>
        </body>
        </html>
    `);
});

// Роуты для админки
app.post('/api/admin/add-case', (req, res) => {
    data.cases.push({ id: "c" + Date.now(), ...req.body });
    res.json({ success: true });
});

app.post('/api/admin/set-balance', (req, res) => {
    data.userData.balance = Number(req.body.amount);
    res.json({ success: true });
});

app.listen(PORT, () => console.log('🚀 Сервер летит!'));

