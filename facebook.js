const puppeteer = require("puppeteer");
const fs = require("fs");
const BASE_URL = "https://facebook.com";
const COOKIES_PATH = "./cookies.json";

const facebook = {
  browser: null,
  page: null,
  cookies: null,

  init: async () => {
    facebook.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    facebook.page = await facebook.browser.newPage();
    facebook.cookies();
  },

  cookies: () => {
    if (facebook.checkCookies()) {
      facebook.setCookies();
    }
  },

  autoLogin: async (email, password) => {
    await facebook.page.type("#email", email);
    await facebook.page.type("#pass", password);
    await facebook.page.click("[type='submit']");
    await facebook.page.waitForNavigation();
    await facebook.saveCookies();
  },

  login: async (email, password) => {
    await facebook.page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    if (facebook.checkCookies()) {
      await facebook.alreadyLogin();
    } else {
      await facebook.autoLogin(email, password);
    }
  },

  saveCookies: async () => {
    const cookies = await facebook.page.cookies();
    const cookieJSON = JSON.stringify(cookies);
    fs.writeFileSync(COOKIES_PATH, cookieJSON);
    console.log("cookies is saved");
  },

  alreadyLogin: async () => {
    await facebook.page.setCookie(...facebook.cookies);
    await facebook.page.reload();
  },

  getCookies() {
    return facebook.cookies;
  },

  setCookies() {
    const cookies = fs.readFileSync(COOKIES_PATH);
    const parseCookies = JSON.parse(cookies);
    facebook.cookies = parseCookies;
  },

  checkCookies: () => {
    return fs.existsSync(COOKIES_PATH);
  },
};

module.exports = facebook;
