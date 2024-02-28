const restify = require("restify");
const errors = require("restify-errors");

const discountCalculator = require("./discountCalculator");

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.post("/calculateDiscount", (req, res, next) => {
  try {
    const cartData = req.body;

    const discountConfig = {
      prerequisite_skus: ["PEANUT-BUTTER", "COCOA", "FRUITY"],
      eligible_skus: ["BANANA-CAKE", "COCOA", "CHOCOLATE"],
      discount_unit: "percentage",
      discount_value: 50.0,
    };

    const unknownSku = cartData.cart.lineItems.some(
      (item) =>
        !discountConfig.prerequisite_skus.includes(item.sku) &&
        !discountConfig.eligible_skus.includes(item.sku)
    );

    if (unknownSku) {
      return next(new errors.BadRequestError("Unknown SKU found in the cart."));
    }

    const discountedPrice = discountCalculator.calculateDiscountedPrice(
      discountConfig,
      cartData
    );
    res.send({ discountedPrice });
  } catch (error) {
    return next(new errors.InternalServerError("Internal Server Error."));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
