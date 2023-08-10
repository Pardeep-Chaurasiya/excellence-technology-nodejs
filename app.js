const express = require("express");
const app = express();
const PORT = process.env.PORT;

require("./config/db")();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
