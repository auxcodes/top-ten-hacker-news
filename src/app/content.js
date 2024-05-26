import "./components/article-row.js";
import { convertArticlesToCSV, saveCsvUrl } from "./exportCSV.js";

const contentUrl = ".netlify/functions/articles";
const method = "POST";
const shouldBeAsync = true;

const articles = [];

export function sendContentRequest(requestData) {
  const XHR = new XMLHttpRequest();
  const url = contentUrl;

  XHR.open(method, url, shouldBeAsync);
  XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  XHR.setRequestHeader("Access-Control-Allow-Origin", "*");
  XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  XHR.onload = (event) => {
    const response = JSON.parse(event.target.responseText);

    if (response.msg === "Content Retrieval Successful") {
      console.log("Content request successful.");

      response.content.forEach((article) => {
        if (article) {
          articles.push(article);
        }
      });
      generateContent(response.content);
    } else {
      console.error("Content response error: ", response);
    }
  };

  XHR.onerror = (event) => {
    console.error("Content request sending error: ", event);
  };

  XHR.send();
}

function generateContent(articles) {
  const contentElement = document.getElementById("articlesSection");
  articles.forEach((article) => {
    const el = document.createElement("article-row");
    el.classList.add("article-row");
    el.article = article;
    contentElement.append(el);
  });
  generateDownloadButton(contentElement);
}

function generateDownloadButton(parentElement) {
  const button = document.createElement("a");
  button.classList.add("download-btn");
  button.innerText = "Download CSV";
  button.download = "toptenCSV.csv";
  // create CSV and Blobify
  const articlesCSV = convertArticlesToCSV(articles);
  button.href = saveCsvUrl(articlesCSV);
  // add to DOM
  parentElement.append(button);
}
