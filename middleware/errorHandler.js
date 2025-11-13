function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
}

module.exports = errorHandler;
