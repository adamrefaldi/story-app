class AppShell {
  constructor({ content }) {
    this._content = content;
  }

  renderPage(page) {
    this._content.innerHTML = page;
  }
}

export default AppShell;
