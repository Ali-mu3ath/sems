// routes/chat.routes.js
const r = require("express").Router();
const a = require("../middleware/auth.middleware");
const c = require("../controllers/chat.controller");

// --- User routes ---
r.get("/conversation", a, c.getConversation);
r.post("/message", a, c.sendMessage);
r.put("/message/:id", a, c.editMessage);
r.delete("/message/:id", a, c.deleteMessage);
r.post("/close", a, c.closeConversation);
r.get("/messages", a, c.getMessages);

// --- Admin routes ---
r.get("/admin/conversations", a, c.getOpenConversations); // 👈 جديد
r.post("/admin/message", a, c.sendAdminMessage);         // 👈 جديد

module.exports = r;