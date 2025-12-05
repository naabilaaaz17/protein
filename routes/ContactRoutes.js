const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "✅ Contact message sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        replyDate: new Date(),
        status: "Replied",
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Reply sent successfully", data: contact });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
