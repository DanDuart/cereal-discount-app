// CON: Logic is concentraded in a single function which adds a lot to the complexity,
// besieds that, it's hard to understand the logic of the function, and it's hard to test.

module.exports = {
  calculateDiscountedPrice: (discountConfig, cartData) => {
    const { lineItems } = cartData.cart;

    let totalDiscountedPrice = 0.0;
    let discountApplied = false;

    const isEligibleForDiscount = lineItems.some((item) =>
      discountConfig.prerequisite_skus.includes(item.sku)
    );

    lineItems.forEach((item) => {
      const { sku, price } = item;
      const itemPrice = parseFloat(price);

      // PRO: Checking the correct logic for the discount
      if (isEligibleForDiscount && lineItems.length > 1 && !discountApplied) {
        // CON: We're re-iterating the lineItems to find the eligible items
        // on every iteration of the lineItems, which is unnecessary.
        // Should move this function to ouside the forEach.
        const eligibleItems = lineItems.filter((el) =>
          discountConfig.eligible_skus.includes(el.sku)
        );

        // CON: Same as the comment above, could be moved to outside the forEach.
        const cheapestEligibleItem =
          eligibleItems.length > 0 &&
          eligibleItems.reduce((minItem, currentItem) =>
            parseFloat(currentItem.price) < parseFloat(minItem.price)
              ? currentItem
              : minItem
          );

        if (cheapestEligibleItem.sku === sku) {
          let discountMultiplier = 1.0;

          if (discountConfig.discount_unit === "percentage") {
            discountMultiplier = 1 - discountConfig.discount_value / 100;
          } else if (discountConfig.discount_unit === "value") {
            discountMultiplier = 1 - discountConfig.discount_value / itemPrice;
          }

          const discountedPrice = itemPrice * discountMultiplier;
          totalDiscountedPrice += discountedPrice;
          discountApplied = true;
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
