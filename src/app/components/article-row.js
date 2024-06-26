class ArticleRow extends HTMLElement {
  set article(article) {
    this.innerHTML = `
              <a id='articleUrl' class='article-title' href='${article.url}' target='_blank' rel="noreferrer">${article.title}</a>
          `;
  }
}

customElements.define("article-row", ArticleRow);
