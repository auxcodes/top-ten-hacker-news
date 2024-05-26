class ArticleRow extends HTMLElement {
  set article(article) {
    this.innerHTML = `
              <a id='articleUrl' class='article-title' href='${article.url}' target='_blank'>${article.title}</a>
          `;
  }
}

customElements.define("article-row", ArticleRow);
