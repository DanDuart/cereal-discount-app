module.exports = {
  calculateDiscountedPrice: (cartData) => {
    const discountConfig = {
      prerequisite_skus: ["PEANUT-BUTTER", "COCOA", "FRUITY"],
      eligible_skus: ["BANANA-CAKE", "COCOA", "CHOCOLATE"],
      discount_unit: "percentage",
      discount_value: 50.0,
    };

    const { lineItems } = cartData.cart;

    let totalDiscountedPrice = 0.0;

    const isEligibleForDiscount = lineItems.some((item) =>
      discountConfig.prerequisite_skus.includes(item.sku)
    );

    lineItems.forEach((item) => {
      const { sku, price } = item;
      const itemPrice = parseFloat(price);

      if (isEligibleForDiscount) {
        const eligibleItems = lineItems.filter((el) =>
          discountConfig.eligible_skus.includes(el.sku)
        );

        const cheapestEligibleItem = eligibleItems.reduce(
          (minItem, currentItem) =>
            parseFloat(currentItem.price) < parseFloat(minItem.price)
              ? currentItem
              : minItem
        );

        if (cheapestEligibleItem.sku === sku) {
          const discountedPrice =
            itemPrice - itemPrice * (discountConfig.discount_value / 100);
          totalDiscountedPrice += discountedPrice;
        } else {
          totalDiscountedPrice += itemPrice;
        }
      } else {
        totalDiscountedPrice += itemPrice;
      }
    });

    return totalDiscountedPrice.toFixed(2);
  },
};
