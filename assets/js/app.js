/**
 * Page controller: project grid and inspector, CV viewer, contact helpers.
 * Jesús Rodríguez González
 */

const CV_DATA = {
  es: {
    file: "assets/docs/CV_Jesus_Rodriguez_Gonzalez_ES.pdf",
    downloadText: "Descargar PDF (ES)"
  },
  en: {
    file: "assets/docs/CV_Jesus_Rodriguez_Gonzalez_EN.pdf",
    downloadText: "Download PDF (EN)"
  }
};

const PROJECTS = window.PROJECTS_DATA || [];
const PROJECT_HASH_PREFIX = '#proyecto/';
const LAYER_TRANSITION_MS = 300;

// Mobile browsers either lack an inline PDF viewer or only show the first page.
const CAN_EMBED_PDF = navigator.pdfViewerEnabled !== false && !window.matchMedia('(pointer: coarse)').matches;

let inspector;
let cvLayer;

document.addEventListener('DOMContentLoaded', () => {
  inspector = createLayer({
    panel: document.getElementById('project-drawer'),
    backdrop: document.getElementById('project-backdrop'),
    closedClasses: ['translate-x-full'],
    initialFocus: document.getElementById('project-drawer-close')
  });
  cvLayer = createLayer({
    panel: document.getElementById('cv-modal'),
    backdrop: document.getElementById('cv-backdrop'),
    closedClasses: ['opacity-0', 'scale-95'],
    initialFocus: document.getElementById('cv-modal-close')
  });

  initMobileNav();
  initProjectList();
  initProjectInspector();
  initCVModal();
  initCopyButtons();
  initQuickContactForm();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeMobileNav();
    requestCloseInspector();
    cvLayer.close();
  });

  window.addEventListener('hashchange', syncInspectorWithHash);
  syncInspectorWithHash();
});

/**
 * Modal surface with its backdrop. While open, everything behind it is inert,
 * which keeps keyboard focus inside and hides the page from assistive tech.
 */
function createLayer({ panel, backdrop, closedClasses, initialFocus }) {
  const background = document.querySelectorAll('body > a, body > header, body > main, body > footer');
  let hideTimer = null;
  let lastFocused = null;

  const layer = {
    isOpen: false,

    open() {
      if (layer.isOpen) return;
      layer.isOpen = true;
      clearTimeout(hideTimer);
      lastFocused = document.activeElement;

      backdrop.classList.remove('hidden');
      panel.classList.remove('hidden');
      void panel.offsetWidth; // Commit the closed state so the transition runs.
      backdrop.classList.remove('opacity-0');
      panel.classList.remove(...closedClasses);

      background.forEach(el => { el.inert = true; });
      document.body.classList.add('overflow-hidden');
      initialFocus.focus({ preventScroll: true });
    },

    close() {
      if (!layer.isOpen) return;
      layer.isOpen = false;

      backdrop.classList.add('opacity-0');
      panel.classList.add(...closedClasses);
      background.forEach(el => { el.inert = false; });
      document.body.classList.remove('overflow-hidden');

      hideTimer = setTimeout(() => {
        backdrop.classList.add('hidden');
        panel.classList.add('hidden');
      }, LAYER_TRANSITION_MS);

      if (lastFocused && lastFocused.isConnected) lastFocused.focus({ preventScroll: true });
    }
  };

  return layer;
}

/**
 * Mobile navigation
 */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');

  toggle.addEventListener('click', () => {
    setMobileNavOpen(panel.classList.contains('hidden'));
  });

  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMobileNav();
  });
}

function setMobileNavOpen(open) {
  document.getElementById('mobile-nav').classList.toggle('hidden', !open);
  document.getElementById('nav-toggle').setAttribute('aria-expanded', String(open));
  document.getElementById('nav-toggle-open').classList.toggle('hidden', open);
  document.getElementById('nav-toggle-close').classList.toggle('hidden', !open);
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

/**
 * Project grid
 */
function initProjectList() {
  const container = document.getElementById('projects-container');
  if (!container || PROJECTS.length === 0) return;

  container.innerHTML = PROJECTS.map((project, idx) => renderProjectCard(project, idx + 1)).join('');

  // The whole card is clickable. The title link is what keyboards and
  // "open in new tab" use, so modified clicks keep their default behaviour.
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;
    if (e.target.closest('a') && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)) return;

    e.preventDefault();
    history.pushState({ inspector: true }, '', projectHash(card.dataset.projectId));
    syncInspectorWithHash();
  });
}

function projectHash(projectId) {
  return PROJECT_HASH_PREFIX + encodeURIComponent(projectId);
}

function renderProjectCard(project, position) {
  const featured = position === 1;

  return `
    <article
      class="project-card panel group relative p-6 sm:p-8 flex flex-col cursor-pointer hover:border-brand-accent/50 transition-colors ${featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-x-14' : ''}"
      data-project-id="${project.id}"
    >
      <div>
        <p class="flex items-baseline justify-between gap-4 font-mono text-xs text-brand-muted">
          <span><span class="text-brand-accent">EXP-0${position}</span> · ${project.category}</span>
          <span class="shrink-0">${project.year}</span>
        </p>

        <h3 class="mt-4 font-serif font-medium text-white group-hover:text-brand-accent transition-colors leading-tight ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}">
          <a href="${projectHash(project.id)}" class="project-link after:absolute after:inset-0 after:rounded-lg">${project.title}</a>
        </h3>

        <p class="mt-3 text-[15px] copy">${project.tagline}</p>
      </div>

      <div class="${featured ? 'mt-6 lg:mt-0' : 'mt-auto pt-6'}">
        <div class="relative z-10 border-y border-white/[0.08] py-3 text-sm text-slate-200 overflow-x-auto">
          <div class="math-formula">${renderMathFormula(project, false)}</div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-5">
          ${project.metrics.slice(0, 2).map(metric => `
            <div>
              <div class="font-mono text-[11px] uppercase tracking-wider text-brand-muted">${metric.label}</div>
              <div class="mt-1 font-mono text-lg text-white">${metric.value}</div>
              <div class="mt-0.5 text-xs text-brand-muted">${metric.delta}</div>
            </div>
          `).join('')}
        </div>

        <div class="mt-5 flex items-center justify-between gap-4 font-mono text-xs">
          <span class="text-brand-muted truncate">${project.tags.slice(0, 3).join(' · ')}</span>
          <span class="shrink-0 text-brand-accent group-hover:translate-x-1 transition-transform">Ver detalles →</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Project inspector drawer. The URL hash is the source of truth, which makes
 * every project linkable and lets the browser back button close the drawer.
 */
function initProjectInspector() {
  document.getElementById('project-drawer-close').addEventListener('click', requestCloseInspector);
  document.getElementById('project-backdrop').addEventListener('click', requestCloseInspector);

  document.querySelectorAll('.inspector-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchInspectorTab(btn.dataset.tab));
  });
}

function syncInspectorWithHash() {
  const { hash } = window.location;
  const projectId = hash.startsWith(PROJECT_HASH_PREFIX)
    ? decodeURIComponent(hash.slice(PROJECT_HASH_PREFIX.length))
    : null;
  const project = PROJECTS.find(p => p.id === projectId);

  if (project) {
    openProjectInspector(project);
  } else {
    inspector.close();
  }
}

function requestCloseInspector() {
  if (!inspector.isOpen) return;

  // Opened from a card: undo that history entry. Opened from a shared link:
  // there is nothing to go back to inside the site, so just drop the hash.
  if (history.state && history.state.inspector) {
    history.back();
  } else {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    inspector.close();
  }
}

function openProjectInspector(project) {
  document.getElementById('drawer-project-title').textContent = project.title;
  document.getElementById('drawer-project-badge').textContent = project.badge;
  document.getElementById('drawer-project-category').textContent = project.category;
  document.getElementById('drawer-project-tagline').textContent = project.tagline;

  const githubBtn = document.getElementById('drawer-github-link');
  githubBtn.href = project.githubUrl || project.fallbackGithubUrl || "https://github.com/jesurod";
  githubBtn.setAttribute('title', `Abrir ${project.title} en GitHub`);

  document.getElementById('drawer-project-abstract').textContent = project.abstract;
  document.getElementById('drawer-project-business').textContent = project.businessImpact;
  document.getElementById('drawer-project-loss').innerHTML = renderMathFormula(project, true);

  document.getElementById('drawer-metrics-container').innerHTML = project.metrics.map(metric => `
    <div>
      <div class="font-mono text-[11px] uppercase tracking-wider text-brand-muted">${metric.label}</div>
      <div class="mt-1 font-mono text-2xl text-white">${metric.value}</div>
      <div class="mt-0.5 text-[13px] text-brand-muted">${metric.delta}</div>
    </div>
  `).join('');

  document.getElementById('drawer-pipeline-container').innerHTML = project.pipeline.map((step, idx) => `
    <div class="relative pl-7 pb-7 last:pb-0">
      ${idx < project.pipeline.length - 1 ? '<div class="absolute left-[5px] top-3 w-px h-full bg-white/15"></div>' : ''}
      <div class="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border border-brand-accent bg-brand-surface"></div>
      <h4 class="font-mono text-sm text-white">${step.step}</h4>
      <p class="mt-1.5 text-[15px] copy">${step.desc}</p>
    </div>
  `).join('');

  document.getElementById('drawer-code-block').textContent = project.codeSnippet.code;
  document.getElementById('drawer-code-lang').textContent = project.codeSnippet.lang.toUpperCase();

  document.getElementById('drawer-tags-container').innerHTML = project.tags.map(tag => `
    <span class="font-mono text-xs text-brand-muted">${tag}</span>
  `).join('');

  switchInspectorTab('overview');
  cvLayer.close();
  inspector.open();
}

function switchInspectorTab(tabId) {
  document.querySelectorAll('.inspector-tab-btn').forEach(btn => {
    const isCurrent = btn.dataset.tab === tabId;
    btn.classList.toggle('text-brand-accent', isCurrent);
    btn.classList.toggle('border-brand-accent', isCurrent);
    btn.classList.toggle('text-brand-muted', !isCurrent);
    btn.classList.toggle('border-transparent', !isCurrent);
    btn.setAttribute('aria-selected', String(isCurrent));
  });

  document.querySelectorAll('.inspector-tab-content').forEach(pane => {
    pane.classList.toggle('hidden', pane.id !== `tab-content-${tabId}`);
  });
}

/**
 * CV viewer. The PDF only loads when the modal is opened.
 */
function initCVModal() {
  document.querySelectorAll('.trigger-cv-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderCVContent(btn.dataset.cvLang || 'es');
      cvLayer.open();
    });
  });

  document.getElementById('cv-modal-close').addEventListener('click', () => cvLayer.close());
  document.getElementById('cv-backdrop').addEventListener('click', () => cvLayer.close());

  document.querySelectorAll('.cv-lang-switch').forEach(btn => {
    btn.addEventListener('click', () => renderCVContent(btn.dataset.lang));
  });

  document.getElementById('cv-pdf-frame').classList.toggle('hidden', !CAN_EMBED_PDF);
  document.getElementById('cv-fallback').classList.toggle('hidden', CAN_EMBED_PDF);
}

function renderCVContent(lang) {
  const data = CV_DATA[lang] || CV_DATA.es;

  document.querySelectorAll('.cv-lang-switch').forEach(btn => {
    const isCurrent = btn.dataset.lang === lang;
    btn.classList.toggle('bg-brand-accent', isCurrent);
    btn.classList.toggle('text-brand-bg', isCurrent);
    btn.classList.toggle('font-bold', isCurrent);
    btn.classList.toggle('bg-white/5', !isCurrent);
    btn.classList.toggle('text-brand-muted', !isCurrent);
    btn.setAttribute('aria-pressed', String(isCurrent));
  });

  const frame = document.getElementById('cv-pdf-frame');
  if (CAN_EMBED_PDF && frame.getAttribute('src') !== data.file) {
    frame.setAttribute('src', data.file);
  }

  document.getElementById('cv-open-pdf-link').href = data.file;
  document.getElementById('cv-fallback-link').href = data.file;

  const downloadLink = document.getElementById('cv-download-btn');
  downloadLink.href = data.file;
  downloadLink.setAttribute('download', data.file.split('/').pop());
  downloadLink.querySelector('.cv-download-text').textContent = data.downloadText;
}

/**
 * Clipboard helpers
 */
function initCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyText(btn.dataset.copyTarget, btn.dataset.copyLabel || 'Copiado al portapapeles');
    });
  });

  document.getElementById('copy-code-btn').addEventListener('click', () => {
    copyText(document.getElementById('drawer-code-block').textContent, 'Fragmento de código copiado');
  });

  document.getElementById('copy-project-link-btn').addEventListener('click', () => {
    copyText(window.location.href, 'Enlace al proyecto copiado');
  });
}

function copyText(text, confirmation) {
  navigator.clipboard.writeText(text)
    .then(() => showCopyToast(confirmation))
    .catch(() => showCopyToast('No se pudo copiar al portapapeles'));
}

let toastTimer = null;

function showCopyToast(message) {
  let toast = document.getElementById('toast-feedback');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-feedback';
    toast.setAttribute('role', 'status');
    toast.className = 'fixed bottom-6 right-6 z-[100] bg-brand-surface border border-white/15 text-white font-mono text-xs px-4 py-3 rounded-md flex items-center gap-2.5 transition-all duration-300 transform translate-y-6 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span>${message}</span>
  `;

  toast.classList.remove('translate-y-6', 'opacity-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-6', 'opacity-0');
  }, 2400);
}

/**
 * Contact form: builds a pre-filled email
 */
function initQuickContactForm() {
  const form = document.getElementById('quick-contact-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value || 'Contacto Profesional';
    const company = document.getElementById('contact-company').value;
    const subject = document.getElementById('contact-subject').value || 'Propuesta / Oportunidad de colaboración';
    const message = document.getElementById('contact-message').value;

    const mailtoBody = encodeURIComponent(
      `Hola Jesús,\n\nMi nombre es ${name}${company ? ` de ${company}` : ''}.\n\nMensaje:\n${message}\n\nUn cordial saludo.`
    );
    const mailtoSubject = encodeURIComponent(`[Portafolio Data/ADE] ${subject}`);

    window.location.href = `mailto:jesurod24@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  });
}

/**
 * Typesets a project's formula, or falls back to its pre-formatted HTML if
 * KaTeX failed to load.
 */
function renderMathFormula(project, isBlock) {
  if (window.katex) {
    try {
      return window.katex.renderToString(project.lossOrObjective, {
        throwOnError: false,
        displayMode: isBlock
      });
    } catch (err) {
      console.warn('KaTeX could not render formula:', err);
    }
  }
  return project.formattedObjective;
}
