export function convertArticlesToCSV(articles) {
  let csvString = "TITLE, URL \n";
  articles.map((article) => {
    const title = cleanStringforCSV(article["title"]);
    const url = absoluteUrlCheck(article["url"]);
    csvString = csvString + title + url;
  });
  //console.log(csvString);
  return csvString;
}

function cleanStringforCSV(dirtyString) {
  // escape all double quotes
  let cleanString = dirtyString.replaceAll('"', '\\"');
  // wrap in double quotes to contain commas in string
  cleanString = '"' + cleanString + '", ';
  return cleanString;
}

function absoluteUrlCheck(url) {
  let checkedURL = url + " \n";
  // some urls on hacker news urls are relative paths to news.ycombinator.com
  if (!url.includes("https://") && !url.includes("http://")) {
    checkedURL = "https://news.ycombinator.com/" + url;
  }
  return checkedURL;
}

export function saveCsvUrl(csvString) {
  const csvBlob = new Blob([csvString], { type: "text/plain" });
  return URL.createObjectURL(csvBlob);
}
