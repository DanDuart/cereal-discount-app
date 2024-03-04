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

    // Question: Why are you raising an error if an unknown SKU is found in the cart?
    if (unknownSku) {
      return next(new errors.BadRequestError("Unknown SKU found in the cart."));
    }

    const discountedPrice = discountCalculator.calculateDiscountedPrice(
      discountConfig,
      cartData
    );
    // CON: Challenge requirement partially met, from the description:
    //
    // "Your mission is to write an API to calculate the price of any conceivable shopping cart"
    // (containing multiple cereal boxes), returning the discounted price for each individual
    // item and the final discounted price for the entire cart."
    //
    // The API only returns the final discounted price for the entire cart, but not the discounted
    // price for each individual line item.
    //
    res.send({ discountedPrice });
  } catch (error) {
    return next(new errors.InternalServerError("Internal Server Error."));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
