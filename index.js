const shopee = require("./shopee");
(async () => {
  try {
    await shopee.init();
    await shopee.getTrendingProduct();
    // debugger;
  } catch (error) {
    console.log("Catch Error", error);
  }
})();
