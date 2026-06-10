// Dark mode feature (Icon matching & toggle binding, class is set synchronously in body)
const initDarkMode = () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = toggleBtn?.querySelector('span');

  const updateIcon = (isDark) => {
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  };

  // Sync icon with currently applied class on load
  const isDark = document.body.classList.contains('dark-mode');
  updateIcon(isDark);

  toggleBtn?.addEventListener('click', () => {
    const active = document.body.classList.toggle('dark-mode');
    updateIcon(active);
    localStorage.setItem('theme', active ? 'dark' : 'light');
  });
};

// Client-side search and category filtering
const initBlogFilters = () => {
  const searchInput = document.getElementById('search-input');
  const categoryBadges = document.querySelectorAll('.category-badge');
  const cards = document.querySelectorAll('.article-card');
  const emptyState = document.getElementById('empty-state');

  let currentCategory = '';
  let searchQuery = '';

  // Get category from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    currentCategory = catParam;
    const badge = document.querySelector(`.category-badge[data-category="${catParam}"]`);
    if (badge) {
      categoryBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
    }
  }

  const filterArticles = () => {
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.getAttribute('data-title').toLowerCase();
      const summary = card.getAttribute('data-summary').toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesSearch = title.includes(searchQuery) || summary.includes(searchQuery);
      const matchesCategory = !currentCategory || category === currentCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Bind search input
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterArticles();
  });

  // Bind category badges
  categoryBadges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      // If we are not on the homepage (no article cards to filter), let the link jump naturally to index.html
      if (cards.length === 0) {
        return;
      }

      e.preventDefault();

      const targetCategory = badge.getAttribute('data-category');

      if (badge.classList.contains('active')) {
        badge.classList.remove('active');
        currentCategory = '';
        // Clear query param without page reload
        window.history.pushState({}, '', window.location.pathname);
      } else {
        categoryBadges.forEach(b => b.classList.remove('active'));
        badge.classList.add('active');
        currentCategory = targetCategory;
        // Update URL query param
        window.history.pushState({}, '', `?category=${targetCategory}`);
      }

      filterArticles();
    });
  });

  // Run initial filter if category query param exists
  if (currentCategory) {
    filterArticles();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initBlogFilters();
});

