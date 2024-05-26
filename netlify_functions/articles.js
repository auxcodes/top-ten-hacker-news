const { chromium } = require("playwright");

const headers = {
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "Authorization",
  "Content-Type": "application/json",
};

const numberOfArticles = process.env.NUMBER_OF_ARTICLES;

exports.handler = async (event, context, callback) => {
  const articles = await getHackerNewsArticles();
  callback(null, {
    statusCode: 200,
    headers,
    body: JSON.stringify({ msg: "Content Retrieval Successful", content: articles }),
  });
};

async function getHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // get top 10 articles
  const anchorLocators = await getArticleAnchorLocators(page);
  const articleDetails = await getArticleDetails(anchorLocators);

  // close browser
  browser.close();

  return articleDetails;
}

async function getArticleAnchorLocators(page) {
  try {
    const articleClassName = "span.titleLine";
    const allSpanLocators = await page.locator(articleClassName).all();
    const spanLocators = allSpanLocators.slice(0, numberOfArticles);

    const anchorLocators = await Promise.all(
      spanLocators.map((spanLocator) => {
        const anchorLocator = spanLocator.getByRole("link").first();
        return anchorLocator;
      })
    );

    return anchorLocators;
  } catch (error) {
    console.error("Error getting articles: ", error);
  }
}

async function getArticleDetails(anchorLocators) {
  try {
    const articleDetails = await Promise.all(
      anchorLocators.map(async (anchorLocator) => {
        const articleTitle = await anchorLocator.innerText();
        const articleUrl = await anchorLocator.getAttribute("href");
        //console.log("Title: ", articleTitle, "\nURL: ", articleUrl);
        return { title: articleTitle, url: articleUrl };
      })
    );
    return articleDetails;
  } catch (error) {
    console.error("Error getting article details: ", error);
  }
}
