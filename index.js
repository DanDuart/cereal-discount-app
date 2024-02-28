const restify = require("restify");
const discountCalculator = require("./discountCalculator");

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.post("/calculateDiscount", (req, res, next) => {
  try {
    const cartData = req.body;
    const discountedPrice =
      discountCalculator.calculateDiscountedPrice(cartData);
    res.json({ discountedPrice });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  return next();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
