/* ============================================
   UI Module - Shared UI Components & Utilities
   ============================================ */
const UI = (() => {
  // Theme Management
  function initTheme() {
    const saved = localStorage.getItem('cm_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cm_theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;';
  }

  // Toast Notifications
  function toast(message, type = 'info', duration = 3000) {
    const existing = document.querySelectorAll('.toast');
    existing.forEach(t => t.remove());

    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${message}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  // Modal
  function showModal(title, content, footer) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'activeModal';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="UI.closeModal()">&times;</button>
        </div>
        <div class="modal-body">${content}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
  }

  function closeModal() {
    const modal = document.getElementById('activeModal');
    if (modal) modal.remove();
  }

  // Format Currency
  function formatPrice(amount) {
    return 'GHS ' + Number(amount).toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  // Format Date
  function formatDate(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-GH', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatTime(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });
  }

  function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  }

  // Generate initials
  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  // Car card HTML generator
  function createCarCard(car) {
    const imgSrc = car.images && car.images[0] && car.images[0] !== 'car-placeholder.svg'
      ? `assets/images/cars/${car.images[0]}`
      : '';
    const placeholderSVG = `<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#e8ecf1"/><g transform="translate(110,60)"><path d="M10 80h60V50c0-5 5-10 10-10h20l10-15h30l10 15h15c8 0 15 7 15 15v25h5v10H5V70h5v10z" fill="#a0aec0"/><circle cx="30" cy="80" r="10" fill="#718096"/><circle cx="50" cy="80" r="10" fill="#718096"/></g><text x="150" y="140" text-anchor="middle" fill="#a0aec0" font-size="12" font-family="sans-serif">${car.brand} ${car.model}</text></svg>`;

    return `
      <div class="car-card" onclick="window.location.href='car-details.html?id=${car.id}'">
        <div class="car-card-image">
          ${imgSrc
            ? `<img src="${imgSrc}" alt="${car.brand} ${car.model}" loading="lazy">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-alt)">${placeholderSVG}</div>`
          }
          ${car.featured ? '<span class="car-card-badge featured">Featured</span>' : ''}
          <button class="car-card-wishlist" onclick="event.stopPropagation();UI.toggleWishlist(${car.id},this)" data-car-id="${car.id}">&#9825;</button>
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">${car.year} ${car.brand} ${car.model}</h3>
          <div class="car-card-specs">
            <span class="car-spec"><i>&#9881;</i> ${car.transmission}</span>
            <span class="car-spec"><i>&#9879;</i> ${car.fuel}</span>
            <span class="car-spec"><i>&#8982;</i> ${Number(car.mileage).toLocaleString()} km</span>
          </div>
          <div class="car-card-footer">
            <span class="car-price">${formatPrice(car.price)}</span>
            <button class="car-card-action">View Details</button>
          </div>
        </div>
      </div>
    `;
  }

  // Skeleton card
  function createSkeletonCard() {
    return `
      <div class="car-card">
        <div class="skeleton skeleton-image"></div>
        <div class="car-card-body">
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div style="display:flex;justify-content:space-between;margin-top:16px">
            <div class="skeleton" style="width:80px;height:24px"></div>
            <div class="skeleton" style="width:80px;height:32px"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Wishlist toggle
  async function toggleWishlist(carId, btn) {
    const user = await Auth.getCurrentUser();
    if (!user) {
      toast('Please login to save cars', 'warning');
      return;
    }

    const existing = await CarDB.query('wishlist', w => w.userId === user.id && w.carId === carId);
    if (existing.length > 0) {
      await CarDB.remove('wishlist', existing[0].id);
      if (btn) { btn.innerHTML = '&#9825;'; btn.classList.remove('active'); }
      toast('Removed from wishlist', 'info');
    } else {
      await CarDB.add('wishlist', { userId: user.id, carId });
      if (btn) { btn.innerHTML = '&#9829;'; btn.classList.add('active'); }
      toast('Added to wishlist', 'success');
    }
  }

  // Header HTML
  function getHeaderHTML(activePage) {
    return `
    <header class="header" id="header">
      <div class="container">
        <a href="index.html" class="logo">
          <div class="logo-icon">&#9881;</div>
          Auto<span>Ghana</span>
        </a>
        <nav class="nav">
          <div class="nav-links">
            <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="inventory.html" class="${activePage === 'inventory' ? 'active' : ''}">Inventory</a>
            <a href="brands.html" class="${activePage === 'brands' ? 'active' : ''}">Brands</a>
          </div>
          <div class="nav-actions">
            <button class="theme-toggle" id="themeToggle" onclick="UI.toggleTheme()">&#9790;</button>
            <div id="navAuthArea"></div>
          </div>
          <button class="mobile-toggle" id="mobileToggle" onclick="UI.toggleMobileMenu()">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
    </header>
    <div class="mobile-menu" id="mobileMenu">
      <a href="index.html">Home</a>
      <a href="inventory.html">Inventory</a>
      <a href="brands.html">Brands</a>
      <div id="mobileAuthArea"></div>
    </div>
    `;
  }

  // Footer HTML
  function getFooterHTML() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a href="index.html" class="logo" style="color:#fff">
              <div class="logo-icon">&#9881;</div>
              Auto<span>Ghana</span>
            </a>
            <p>Ghana's trusted car marketplace. Buy, sell, and finance quality vehicles with confidence.</p>
            <div class="footer-social">
              <a href="#">f</a>
              <a href="#">t</a>
              <a href="#">in</a>
              <a href="#">ig</a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <div class="footer-links">
              <a href="inventory.html">Browse Cars</a>
              <a href="inventory.html?featured=true">Featured</a>
              <a href="brands.html">Brands</a>
              <a href="register.html">Create Account</a>
            </div>
          </div>
          <div>
            <h4>Popular Brands</h4>
            <div class="footer-links">
              <a href="brands.html?brand=Toyota">Toyota</a>
              <a href="brands.html?brand=Honda">Honda</a>
              <a href="brands.html?brand=Hyundai">Hyundai</a>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <div class="footer-links">
              <a href="#">Accra, Ghana</a>
              <a href="#">+233 20 123 4567</a>
              <a href="#">info@autoghana.com</a>
              <a href="#">Mon - Sat: 8am - 6pm</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} AutoGhana. All rights reserved.</span>
          <span>Terms &bull; Privacy &bull; Cookies</span>
        </div>
      </div>
    </footer>
    `;
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
  }

  // Update auth area in nav
  async function updateAuthNav() {
    const navAuth = document.getElementById('navAuthArea');
    const mobileAuth = document.getElementById('mobileAuthArea');
    const user = await Auth.getCurrentUser();

    if (user) {
      const dashLink = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
      const html = `
        <a href="${dashLink}" class="nav-user">
          <div class="nav-user-avatar">${getInitials(user.fullName)}</div>
          <span>${user.fullName.split(' ')[0]}</span>
        </a>
      `;
      if (navAuth) navAuth.innerHTML = html;
      if (mobileAuth) mobileAuth.innerHTML = `
        <a href="${dashLink}" style="padding:14px 20px;font-weight:600">Dashboard</a>
        <a href="#" onclick="Auth.logout();window.location.href='index.html'" style="padding:14px 20px;color:var(--primary)">Logout</a>
      `;
    } else {
      const html = `
        <a href="login.html" class="btn btn-outline btn-sm">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm" style="margin-left:8px">Register</a>
      `;
      if (navAuth) navAuth.innerHTML = html;
      if (mobileAuth) mobileAuth.innerHTML = `
        <a href="login.html" style="padding:14px 20px;font-weight:600">Login</a>
        <a href="register.html" style="padding:14px 20px;color:var(--primary);font-weight:600">Register</a>
      `;
    }
  }

  // Scroll header effect
  function initScrollHeader() {
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Scroll reveal animations
  function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Pagination
  function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return '';

    let html = '<div class="pagination">';
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="(${onPageChange})(${currentPage - 1})">&laquo;</button>`;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="(${onPageChange})(${i})">${i}</button>`;
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        html += '<button disabled>...</button>';
      }
    }

    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="(${onPageChange})(${currentPage + 1})">&raquo;</button>`;
    html += '</div>';
    return html;
  }

  // Init common page elements
  async function initPage(activePage) {
    await CarDB.open();
    await SeedData.seedAll();
    initTheme();
    initScrollHeader();
    await updateAuthNav();
    setTimeout(initRevealAnimations, 300);
  }

  return {
    initTheme, toggleTheme, toast, showModal, closeModal,
    formatPrice, formatDate, formatTime, timeAgo, getInitials,
    createCarCard, createSkeletonCard, toggleWishlist,
    getHeaderHTML, getFooterHTML, toggleMobileMenu, updateAuthNav,
    initScrollHeader, initRevealAnimations, createPagination, initPage
  };
})();

window.UI = UI;
