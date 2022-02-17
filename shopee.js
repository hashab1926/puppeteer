const puppeteer = require("puppeteer");
const BASE_URL = "https://shopee.co.id";

const shopee = {
  browser: null,
  page: null,
  scroll: {
    maxTimeout: 10000, // 10000ms / 10 seconds
    countTimeout: 0,
    interval: 200,
    yScroll: 0,
  },

  init: async () => {
    shopee.browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      executablePath: "/chrome-win/chrome.exe",
    });
    shopee.page = await shopee.browser.newPage();
  },

  scrollToY: () => {
    const windowHeight = document.getElementById("main").offsetHeight;
    yScroll += interval;
    if (windowHeight <= yScroll) {
      yScroll = 0;
    }
    window.scrollTo(0, yScroll);
  },

  getTrendingProduct: async () => {
    await shopee.page.goto(BASE_URL);
    const getTrendingProduct = await shopee.page.evaluate(async () => {
      console.log("evaluate");
      const response = await fetch(
        "https://shopee.co.id/api/v4/search/trending_search?bundle=popsearch"
      );
      if (response.status !== 200) {
        throw new Error(
          "Sedang terjadi masalah, silahkan coba beberapa saat lagi"
        );
      }

      let getTrending = await response.json();
      if (getTrending?.error) {
        throw new Error(getTrending.error);
      }
      return getTrending.data.querys;
    });

    console.log(getTrendingProduct);
  },
};

module.exports = shopee;
