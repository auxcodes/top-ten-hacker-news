class ArticleRow extends HTMLElement {
  set article(article) {
    this.innerHTML = `
          <div class='article-header'>
              <a id='articleUrl' class='article-title' href='${article.url}' target='_blank'>${article.title}</a>
          </div>
          `;
  }
}

customElements.define("article-row", ArticleRow);
