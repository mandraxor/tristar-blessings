/**
 * TRiSTAR - MAIN APPLICATION & MODALS SCRIPT
 * Navigation, Pre-Save Modal, Lyrics Viewer, Lightbox, and Toast Notifications
 */

(function() {
  'use strict';

  // Toast Notification System
  window.showToast = function(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  };

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.innerHTML = isOpen 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (menuToggle) {
          menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        }
      });
    });
  }

  // Pre-Save Modal Handlers
  window.openPreSaveModal = function() {
    const modal = document.getElementById('presave-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closePreSaveModal = function() {
    const modal = document.getElementById('presave-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.handlePreSaveSubmit = function(platform) {
    window.showToast(`✨ BLESSING$ Pre-Saved to your ${platform} library!`);
    const successBox = document.getElementById('presave-success');
    if (successBox) {
      successBox.style.display = 'block';
    }
  };

  // Lyrics & Credits Modal
  const LYRICS_DATA = {
    "BLESSING$": {
      title: "BLESSING$",
      album: "BLESSING$",
      producer: "HOLLYWOOD",
      writers: "Eric TRiSTAR McKinney, Cary “Chase” Johnson",
      copyright: "© 2025 TRiSTAR | ℗ 2025 PSG4L Presents",
      lyrics: `[Intro: TRiSTAR]
Yeah, west side in the building
PSG4L, PSG4L... you already know what time it is
Count up the blessings, let the diamonds speak
Hollywood on the boards... let's ride

[Verse 1: TRiSTAR]
Stepped up out the ashes, turning struggle into platinum
Heavy on my collar, 3-star pendant got 'em looking
West Coast sunshine shining on the candy paint
Roll down Crenshaw, praying for the souls that ain't
They said it wouldn't happen, look at where we standing now
Standing on the stage, whole arena screaming loud
Every late night in the studio with the SSL glowing
Pouring out my soul, you can hear the blessings flowing

[Chorus]
Count the blessings, count the wins
Never folding, never giving in
Diamond chains, chrome rims in the night
West Coast legacy, we doing this right
Yeah we blessed, yeah we blessed
PSG for life, put your heart to the test
Count the blessings, count the wins
Turn the pain into diamonds again

[Verse 2: TRiSTAR]
Look, shoutout Slo Stallone, we keeping legacy alive
From the Originals to Streetlights, watch the vision thrive
Anterazh energy, Kurupt know how we step
Disko Boogie on the groove, honor and respect
Now it's PSG4L time, independent kingpin
Roll the dice, hit the jackpot, let the story begin
Blessings upon blessings, tell the world that we here
TRiSTAR on top, this our year

[Outro]
Yeah... BLESSING$.
PSG4L. PSG4L Presents.
TRiSTAR.
Hollywood.`
    },
    "PSG4L Anthem (RIP SLO)": {
      title: "PSG4L Anthem (RIP SLO)",
      album: "PSG4L vol.1 RIP SLO",
      producer: "PSG4L / PSG4L Presents",
      writers: "Eric TRiSTAR McKinney",
      copyright: "© 2025 TRiSTAR | ℗ 2025 PSG4L LLC",
      lyrics: `[Intro]
For my brother Slo... forever PSG4L.
TRiSTAR in the building.

[Chorus]
PSG4L, we ride for the crown
From the West to the world, never letting you down
Legends live forever when the music in your vein
Pour a little liquor, turn the memory to reign!`
    }
  };

  window.openLyricsModal = function(songTitle = "BLESSING$") {
    const modal = document.getElementById('lyrics-modal');
    if (!modal) return;
    const song = LYRICS_DATA[songTitle] || LYRICS_DATA["BLESSING$"];

    document.getElementById('lyrics-title').textContent = song.title;
    document.getElementById('lyrics-meta').textContent = `Album: ${song.album} • Produced by ${song.producer}`;
    document.getElementById('lyrics-writers').textContent = `Writers: ${song.writers}`;
    document.getElementById('lyrics-legal').textContent = song.copyright;
    document.getElementById('lyrics-text').textContent = song.lyrics;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLyricsModal = function() {
    const modal = document.getElementById('lyrics-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Lightbox Modal for Gallery
  window.openLightbox = function(src, caption) {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-caption').textContent = caption;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // VIP / Newsletter Submission
  window.handleVipSubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('vip-email')?.value;
    if (email) {
      window.showToast(`🎉 VIP Welcome Pass sent to ${email}!`);
      const form = document.getElementById('vip-form');
      if (form) form.reset();
    }
  };

  // Booking Form Submission
  window.handleBookingSubmit = function(e) {
    e.preventDefault();
    window.showToast(`📩 Inquiry sent to PSG4L Presents Booking & Management!`);
    const form = document.getElementById('booking-form');
    if (form) form.reset();
  };

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePreSaveModal();
      closeLyricsModal();
      closeLightbox();
    }
  });

  // Highlight Active Nav Link
  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

})();
  // MERCHANDISE CART & STORE HANDLERS
  let cart = [
    { title: '"Blessings" Heavyweight Graphic Tee', price: 35.00, size: 'L', img: 'assets/images/merch_tee.jpg', qty: 1 }
  ];

  window.openCart = function() {
    let drawer = document.getElementById('cart-drawer');
    if (!drawer) {
      createCartDrawer();
      drawer = document.getElementById('cart-drawer');
    }
    renderCart();
    drawer.classList.add('open');
  };

  window.closeCart = function() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.remove('open');
  };

  window.addToCart = function(title, price, img) {
    let selectedSize = 'L';
    const activeSizeBtn = event && event.target ? event.target.closest('.merch-card')?.querySelector('.size-btn.active') : null;
    if (activeSizeBtn) {
      selectedSize = activeSizeBtn.textContent.trim();
    }
    const existing = cart.find(item => item.title === title && item.size === selectedSize);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ title, price, size: selectedSize, img, qty: 1 });
    }
    window.showToast(`🛍️ Added ${title} (${selectedSize}) to your bag!`);
    window.openCart();
  };

  window.removeCartItem = function(idx) {
    cart.splice(idx, 1);
    renderCart();
  };

  function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-subtotal');
    const countEl = document.getElementById('cart-count');
    if (!list) return;

    list.innerHTML = '';
    let subtotal = 0;
    let totalQty = 0;

    if (cart.length === 0) {
      list.innerHTML = '<div style="text-align:center; color: var(--chrome-400); padding: 2rem;">Your cart is currently empty.</div>';
    } else {
      cart.forEach((item, idx) => {
        subtotal += item.price * item.qty;
        totalQty += item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <img src="${item.img}" class="cart-item-thumb" alt="${item.title}">
          <div style="flex-grow: 1;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">${item.title}</div>
            <div style="font-size: 0.75rem; color: var(--diamond-cyan);">$${item.price.toFixed(2)} • Size: ${item.size} • Qty: ${item.qty}</div>
          </div>
          <button onclick="removeCartItem(${idx})" style="background:none; border:none; color: var(--chrome-500); cursor:pointer; font-size:1rem;">✕</button>
        `;
        list.appendChild(itemEl);
      });
    }

    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (countEl) countEl.textContent = totalQty;
  }

  function createCartDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-header">
        <div style="display:flex; align-items:center; gap: 0.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1rem; color: #fff;">YOUR BAG (<span id="cart-count">1</span>)</span>
        </div>
        <button onclick="closeCart()" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;">✕</button>
      </div>
      <div id="cart-items-list" class="cart-items-list"></div>
      <div class="cart-footer">
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 700;">
          <span style="color: var(--chrome-300);">SUBTOTAL:</span>
          <span id="cart-subtotal" style="color: #fff; font-size: 1.1rem;">$35.00</span>
        </div>
        <button class="btn-diamond" style="width: 100%; justify-content: center; padding: 0.9rem;" onclick="handleCheckout()">
          PROCEED TO CHECKOUT
        </button>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  window.handleCheckout = function() {
    window.showToast("💎 Redirecting to Secure Record Label Checkout...");
    setTimeout(() => {
      window.showToast("🎉 Mock Order Placed! Thank you for supporting TRiSTAR & PSG4L Presents.");
      cart = [];
      renderCart();
      closeCart();
    }, 1500);
  };

  window.filterMerch = function(cat) {
    document.querySelectorAll('.merch-filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.merch-card').forEach(card => {
      if (cat === 'all' || card.getAttribute('data-cat') === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  window.selectSize = function(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
