/**
 * ABC Auto — Main JavaScript Application
 * Senior Frontend Architecture (Vanilla ES6+, Modular, Performant)
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroCarousel();
    initQuickFilter();
    initCreditCalculator();
    initCatalogFilters();
    initCardInteractions();
    initModals();
    initForms();
    initFAQ();
});

/* ==========================================================================
   1. Header & Navigation (Sticky, Mobile Drawer)
   ========================================================================== */
function initHeader() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
    const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

    function openMobileMenu() {
        if (!mobileMenuDrawer) return;
        mobileMenuDrawer.classList.remove('translate-x-full');
        mobileMenuBackdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileMenuDrawer) return;
        mobileMenuDrawer.classList.add('translate-x-full');
        mobileMenuBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

    // City Selector Popup Mock
    const citySelector = document.getElementById('citySelector');
    if (citySelector) {
        citySelector.addEventListener('click', () => {
            showToast('Выбран город: Москва (Официальный автоцентр 38 км МКАД)');
        });
    }
}

/* ==========================================================================
   2. Hero Banner Carousel
   ========================================================================== */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');

    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideTimer = null;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove('bg-white', 'w-8');
            dots[currentSlide].classList.add('bg-white/50', 'w-2.5');
        }

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove('bg-white/50', 'w-2.5');
            dots[currentSlide].classList.add('bg-white', 'w-8');
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startAutoSlide();
        });
    });

    // Pause on hover
    const carouselContainer = document.getElementById('heroCarousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
}

/* ==========================================================================
   3. Quick Car Filter Widget (Быстрый подбор)
   ========================================================================== */
function initQuickFilter() {
    const bodyTypeBtns = document.querySelectorAll('.body-type-btn');
    const quickPriceRange = document.getElementById('quickPriceRange');
    const quickPriceVal = document.getElementById('quickPriceVal');
    const quickFilterCount = document.getElementById('quickFilterCount');
    const quickBrandSelect = document.getElementById('quickBrandSelect');
    const quickGearboxSelect = document.getElementById('quickGearboxSelect');

    let selectedBody = 'all';

    bodyTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bodyTypeBtns.forEach(b => {
                b.classList.remove('bg-red-50', 'border-red-600', 'text-red-700');
                b.classList.add('border-slate-200', 'text-slate-700');
            });
            btn.classList.remove('border-slate-200', 'text-slate-700');
            btn.classList.add('bg-red-50', 'border-red-600', 'text-red-700');
            selectedBody = btn.dataset.body || 'all';
            updateQuickCount();
        });
    });

    if (quickPriceRange && quickPriceVal) {
        quickPriceRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            quickPriceVal.textContent = (val / 1000000).toFixed(1) + ' млн ₽';
            updateQuickCount();
        });
    }

    if (quickBrandSelect) quickBrandSelect.addEventListener('change', updateQuickCount);
    if (quickGearboxSelect) quickGearboxSelect.addEventListener('change', updateQuickCount);

    function updateQuickCount() {
        if (!quickFilterCount) return;
        // Deterministic realistic simulated car count
        let baseCount = 73;
        if (selectedBody !== 'all') baseCount -= 15;
        if (quickBrandSelect && quickBrandSelect.value !== 'all') baseCount = Math.max(12, Math.floor(baseCount / 2));
        quickFilterCount.textContent = `Показать ${baseCount} авто`;
    }
}

/* ==========================================================================
   4. Auto Loan Credit Calculator (Заявка на кредит)
   ========================================================================== */
function initCreditCalculator() {
    const calcPriceRange = document.getElementById('calcPriceRange');
    const calcPriceInput = document.getElementById('calcPriceInput');
    const calcInitialRange = document.getElementById('calcInitialRange');
    const calcInitialInput = document.getElementById('calcInitialInput');
    const calcTermRange = document.getElementById('calcTermRange');
    const calcTermVal = document.getElementById('calcTermVal');

    const resultPayment = document.getElementById('calcResultPayment');
    const resultLoanSum = document.getElementById('calcResultLoanSum');
    const resultRate = document.getElementById('calcResultRate');

    if (!calcPriceRange || !resultPayment) return;

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function calculate() {
        const price = parseInt(calcPriceRange.value, 10);
        const initialPercent = parseInt(calcInitialRange.value, 10);
        const months = parseInt(calcTermRange.value, 10);

        const initialRub = Math.round(price * (initialPercent / 100));
        const loanSum = Math.max(0, price - initialRub);

        // Synchronize displays
        if (calcPriceInput) calcPriceInput.value = formatNumber(price) + ' ₽';
        if (calcInitialInput) calcInitialInput.value = `${formatNumber(initialRub)} ₽ (${initialPercent}%)`;
        if (calcTermVal) {
            const years = (months / 12).toFixed(months % 12 === 0 ? 0 : 1);
            calcTermVal.textContent = `${months} мес. (${years} г.)`;
        }

        // Annual interest rate (from 1.9% for high downpayment, up to 4.9%)
        const annualRate = initialPercent >= 30 ? 0.019 : 0.049;
        const monthlyRate = annualRate / 12;

        let monthlyPayment = 0;
        if (loanSum > 0 && months > 0) {
            if (monthlyRate > 0) {
                monthlyPayment = Math.round(
                    loanSum * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
                );
            } else {
                monthlyPayment = Math.round(loanSum / months);
            }
        }

        // Update UI
        resultPayment.textContent = `${formatNumber(monthlyPayment)} ₽/мес.`;
        if (resultLoanSum) resultLoanSum.textContent = `${formatNumber(loanSum)} ₽`;
        if (resultRate) resultRate.textContent = `${(annualRate * 100).toFixed(1)}%`;
    }

    calcPriceRange.addEventListener('input', calculate);
    calcInitialRange.addEventListener('input', calculate);
    calcTermRange.addEventListener('input', calculate);

    // Initial calculation run
    calculate();
}

/* ==========================================================================
   5. Catalog Filter Tabs & Show More
   ========================================================================== */
function initCatalogFilters() {
    const filterTabs = document.querySelectorAll('.catalog-tab-btn');
    const carCards = document.querySelectorAll('.catalog-car-item');
    const loadMoreBtn = document.getElementById('loadMoreCarsBtn');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('bg-red-600', 'text-white', 'shadow-md');
                t.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
            });
            tab.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
            tab.classList.add('bg-red-600', 'text-white', 'shadow-md');

            const filter = tab.dataset.filter || 'all';

            carCards.forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Загрузка автомобилей...';
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Все 73 автомобиля загружены';
                loadMoreBtn.classList.add('opacity-60', 'pointer-events-none');
                showToast('Все актуальные автомобили с ПТС успешно отображены!');
            }, 600);
        });
    }
}

/* ==========================================================================
   6. Car Card Interactions (Favorites, Compare, Modal Trigger)
   ========================================================================== */
function initCardInteractions() {
    const favCountEl = document.getElementById('favCount');
    const compareCountEl = document.getElementById('compareCount');
    let favCount = 12;
    let compareCount = 10;

    document.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const icon = btn.querySelector('i');
            const isActive = icon.classList.contains('fa-solid');

            if (isActive) {
                icon.classList.remove('fa-solid', 'text-red-500');
                icon.classList.add('fa-regular', 'text-slate-400');
                favCount--;
                showToast('Удалено из избранного');
            } else {
                icon.classList.remove('fa-regular', 'text-slate-400');
                icon.classList.add('fa-solid', 'text-red-500');
                favCount++;
                showToast('Добавлено в избранное');
            }
            if (favCountEl) favCountEl.textContent = favCount;
        });
    });

    document.querySelectorAll('.btn-compare').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const icon = btn.querySelector('i');
            const isActive = btn.classList.contains('text-red-600');

            if (isActive) {
                btn.classList.remove('text-red-600', 'bg-red-50');
                btn.classList.add('text-slate-400');
                compareCount--;
                showToast('Удалено из сравнения');
            } else {
                btn.classList.remove('text-slate-400');
                btn.classList.add('text-red-600', 'bg-red-50');
                compareCount++;
                showToast('Добавлено в сравнение');
            }
            if (compareCountEl) compareCountEl.textContent = compareCount;
        });
    });
}

/* ==========================================================================
   7. Modals System (Booking, Callback, Test Drive)
   ========================================================================== */
function initModals() {
    const bookingModal = document.getElementById('bookingModal');
    const callbackModal = document.getElementById('callbackModal');
    const modalCarTitle = document.getElementById('modalCarTitle');
    const modalCarPrice = document.getElementById('modalCarPrice');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Trigger Book Car Modal from Card buttons
    document.querySelectorAll('.btn-book-car').forEach(btn => {
        btn.addEventListener('click', () => {
            const carName = btn.dataset.carName || 'Автомобиль в наличии';
            const carPrice = btn.dataset.carPrice || 'Выгодная цена';
            if (modalCarTitle) modalCarTitle.textContent = carName;
            if (modalCarPrice) modalCarPrice.textContent = carPrice;
            openModal(bookingModal);
        });
    });

    // Trigger Callback Modal
    document.querySelectorAll('.btn-open-callback').forEach(btn => {
        btn.addEventListener('click', () => openModal(callbackModal));
    });

    // Close buttons inside modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal-backdrop'));
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal(backdrop);
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
        }
    });
}

/* ==========================================================================
   8. Form Handlers & Toast System
   ========================================================================== */
function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Отправить';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Отправка...';
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                form.reset();
                document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
                document.body.style.overflow = '';
                showToast('Спасибо за заявку! Менеджер свяжется с вами в течение 5 минут.');
            }, 800);
        });
    });
}

function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 max-w-md';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
            <i class="fa-solid fa-check"></i>
        </div>
        <div class="text-sm font-medium leading-tight">${message}</div>
    `;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* ==========================================================================
   9. FAQ Accordion
   ========================================================================== */
function initFAQ() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}
