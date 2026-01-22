const r = require("express").Router();
const a = require("../middleware/auth.middleware");
const c = require("../controllers/chat.controller");

r.get("/conversation", a, c.getConversation);
r.post("/message", a, c.sendMessage);
r.put("/message/:id", a, c.editMessage);
r.delete("/message/:id", a, c.deleteMessage);
r.post("/close", a, c.closeConversation);
r.get("/messages", a, c.getMessages);

module.exports = r;
