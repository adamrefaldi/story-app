import UrlParser from "@/scripts/routes/url-parser.js";
import routes from "@/scripts/routes/routes.js";
import DrawerInitiator from "@/scripts/utils/drawer-initiator.js";
import AppShell from "@/scripts/views/app-shell.js";

class App {
  constructor({ content, button, drawer }) {
    this._content = content;
    this._button = button;
    this._drawer = drawer;
    this._appShell = new AppShell({
      content: this._content,
    });

    this._initialAppShell();
    this._initSkipToContent();
  }

  _initialAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });
  }

  _initSkipToContent() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#mainContent');
    
    if (skipLink && mainContent) {
      skipLink.addEventListener('click', function(event) {
        event.preventDefault(); // Mencegah refresh halaman
        skipLink.blur(); // Menghilangkan fokus skip to content
        
        mainContent.focus(); // Fokus ke konten utama
        mainContent.scrollIntoView(); // Halaman scroll ke konten utama
      });
    }
  }

  async renderPage() {
    try {
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          await this._transitionPage();
        }).finished;
      } else {
        await this._transitionPage();
      }
    } catch (error) {
      console.error("Error rendering page:", error);
    }
  }

  async _transitionPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];

    if (page) {
      this._content.innerHTML = await page.render();
      await page.afterRender();

      const mainContent = document.querySelector("#mainContent");
      if (mainContent) {
        mainContent.focus();
        mainContent.setAttribute("tabindex", "-1");
      }
    } else {
      this._content.innerHTML = `<div class="error-container">
        <h2>404 - Halaman tidak ditemukan</h2>
        <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
      </div>`;
    }
  }
}

const app = new App({
  content: document.querySelector("#mainContent"),
  button: document.querySelector("#hamburgerButton"),
  drawer: document.querySelector("#navigationDrawer"),
});

function updateAuthMenu() {
  const authNavItem = document.querySelector("#authNavItem");

  if (localStorage.getItem("token")) {
    authNavItem.innerHTML = `
      <a href="#/" id="logoutButton"><i class="fas fa-sign-out-alt"></i> Logout</a>
    `;

    document.querySelector("#logoutButton").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      updateAuthMenu();
      window.location.hash = "#/";
    });
  } else {
    authNavItem.innerHTML = `
      <a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a>
    `;
  }
}

window.addEventListener("hashchange", () => {
  app.renderPage();
});

window.addEventListener("load", () => {
  app.renderPage();
});

window.addEventListener("load", updateAuthMenu);
window.addEventListener("hashchange", updateAuthMenu);

export default app;