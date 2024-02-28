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

      if (isEligibleForDiscount && lineItems.length > 1 && !discountApplied) {
        const eligibleItems = lineItems.filter((el) =>
          discountConfig.eligible_skus.includes(el.sku)
        );

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
