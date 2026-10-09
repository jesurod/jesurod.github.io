/**
 * Main Application Controller: Project Inspector, Official PDF CV Viewer, Contact Telemetry
 * Jesús Rodríguez González
 */

const CV_DATA = {
  es: {
    langLabel: "Español",
    downloadFile: "assets/docs/CV_Jesus_Rodriguez_Gonzalez_ES.pdf",
    downloadText: "Descargar PDF (ES)",
    openText: "Abrir / Imprimir PDF ↗",
    title: "Jesús Rodríguez González — CV Oficial (Español)"
  },
  en: {
    langLabel: "English",
    downloadFile: "assets/docs/CV_Jesus_Rodriguez_Gonzalez_EN.pdf",
    downloadText: "Download PDF (EN)",
    openText: "Open / Print PDF ↗",
    title: "Jesús Rodríguez González — Official CV (English)"
  }
};

let currentCvLang = 'es';

document.addEventListener('DOMContentLoaded', () => {
  initProjectList();
  initProjectInspector();
  initCVModal();
  initCopyButtons();
  initQuickContactForm();
  initNavigationScroll();
});

const PROJECTS_PER_PAGE = 4;
let currentProjectPage = 1;

/**
 * 1. Render Project Cards into Grid & Attach Click Handlers with Pagination
 */
function initProjectList() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  renderProjectPage(currentProjectPage);

  const prevBtn = document.getElementById('projects-prev-btn');
  const nextBtn = document.getElementById('projects-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentProjectPage > 1) {
        currentProjectPage--;
        renderProjectPage(currentProjectPage);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const projects = window.PROJECTS_DATA || (typeof PROJECTS_DATA !== 'undefined' ? PROJECTS_DATA : []);
      const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
      if (currentProjectPage < totalPages) {
        currentProjectPage++;
        renderProjectPage(currentProjectPage);
      }
    });
  }
}

function renderProjectPage(page) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const projects = window.PROJECTS_DATA || (typeof PROJECTS_DATA !== 'undefined' ? PROJECTS_DATA : []);
  if (!projects || projects.length === 0) return;

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  currentProjectPage = Math.max(1, Math.min(page, totalPages));

  const startIdx = (currentProjectPage - 1) * PROJECTS_PER_PAGE;
  const endIdx = Math.min(startIdx + PROJECTS_PER_PAGE, projects.length);
  const pageProjects = projects.slice(startIdx, endIdx);

  container.style.opacity = '0';

  setTimeout(() => {
    container.innerHTML = pageProjects.map((proj, idx) => {
      const absoluteIdx = startIdx + idx + 1;
      return `
        <article 
          class="project-card group relative bg-brand-surface/90 backdrop-blur-sm border border-brand-border hover:border-brand-accent/60 rounded-xl p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-accent/5 flex flex-col justify-between cursor-pointer"
          data-project-id="${proj.id}"
        >
          <!-- Top Status & Category -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-4 text-xs font-mono">
              <span class="inline-flex items-center gap-1.5 text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md border border-brand-accent/20">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
                ${proj.badge}
              </span>
              <span class="text-brand-muted/70 tracking-wider font-mono">${proj.year}</span>
            </div>

            <h3 class="text-2xl font-serif font-bold text-white group-hover:text-brand-accent transition-colors mb-2">
              ${proj.title}
            </h3>

            <p class="text-xs font-mono text-brand-muted/80 uppercase tracking-wider mb-4">
              ${proj.category}
            </p>

            <p class="text-brand-muted text-sm leading-relaxed mb-6 font-light">
              ${proj.tagline}
            </p>

            <div class="bg-black/40 border border-white/5 rounded-lg px-3.5 py-2.5 mb-6 text-xs flex items-center justify-between gap-2 overflow-x-auto">
              <span class="text-[10px] font-mono text-brand-muted uppercase tracking-wider font-semibold shrink-0">OBJ. FN:</span>
              <div class="math-formula ml-2 text-slate-200 overflow-x-auto" data-math-latex="${escapeHtml(proj.lossOrObjective)}" data-math-block="false">
                ${renderMathFormula(proj, false)}
              </div>
            </div>
          </div>

          <!-- Bottom: Metrics Preview & Trigger -->
          <div>
            <div class="grid grid-cols-2 gap-2 mb-6">
              ${proj.metrics.slice(0, 2).map(m => `
                <div class="bg-brand-bg/80 border border-white/5 rounded-lg p-2.5">
                  <div class="text-[10px] uppercase tracking-wider text-brand-muted font-mono">${m.label}</div>
                  <div class="text-base font-mono font-bold text-white flex items-baseline gap-1 mt-0.5">
                    ${m.value}
                    <span class="text-[10px] text-emerald-400 font-normal font-sans">${m.delta.split(' ')[0]}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="flex flex-wrap gap-1.5 mb-5">
              ${proj.tags.slice(0, 4).map(t => `
                <span class="text-[11px] font-mono px-2 py-0.5 bg-white/5 text-slate-300 border border-white/5 rounded">
                  ${t}
                </span>
              `).join('')}
              ${proj.tags.length > 4 ? `
                <span class="text-[11px] font-mono px-2 py-0.5 bg-white/5 text-brand-muted border border-white/5 rounded">
                  +${proj.tags.length - 4}
                </span>
              ` : ''}
            </div>

            <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span class="text-brand-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 font-medium">
                Inspeccionar detalles & pipeline
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
              <span class="text-brand-muted/50 group-hover:text-brand-muted transition-colors">EXP-0${absoluteIdx}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-project-id');
        openProjectInspector(pId);
      });
    });

    container.style.opacity = '1';
    updatePaginationUI(currentProjectPage, totalPages, startIdx + 1, endIdx, projects.length);
  }, 140);
}

function updatePaginationUI(currentPage, totalPages, fromItem, toItem, totalItems) {
  const counter = document.getElementById('projects-counter-text');
  if (counter) {
    counter.textContent = `Mostrando ${fromItem} - ${toItem} de ${totalItems} proyectos`;
  }

  const prevBtn = document.getElementById('projects-prev-btn');
  const nextBtn = document.getElementById('projects-next-btn');

  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
    prevBtn.classList.toggle('opacity-40', currentPage <= 1);
    prevBtn.classList.toggle('cursor-not-allowed', currentPage <= 1);
  }

  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.classList.toggle('opacity-40', currentPage >= totalPages);
    nextBtn.classList.toggle('cursor-not-allowed', currentPage >= totalPages);
  }

  const indicators = document.getElementById('projects-page-indicators');
  if (indicators) {
    let html = '';
    for (let p = 1; p <= totalPages; p++) {
      const active = p === currentPage;
      html += `
        <button 
          data-page="${p}" 
          class="page-dot px-3 py-1 rounded-md text-xs font-mono transition-colors ${
            active 
              ? 'bg-brand-accent text-brand-bg font-bold shadow-md shadow-brand-accent/20' 
              : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-white'
          }"
        >
          0${p}
        </button>
      `;
    }
    indicators.innerHTML = html;

    indicators.querySelectorAll('.page-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        if (p && p !== currentProjectPage) {
          renderProjectPage(p);
        }
      });
    });
  }
}

/**
 * 2. Project Inspector Drawer
 */
let activeProject = null;

function initProjectInspector() {
  const backdrop = document.getElementById('project-backdrop');
  const closeBtn = document.getElementById('project-drawer-close');

  if (closeBtn) closeBtn.addEventListener('click', closeProjectInspector);
  if (backdrop) backdrop.addEventListener('click', closeProjectInspector);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectInspector();
      closeCVModal();
    }
  });

  document.querySelectorAll('.inspector-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchInspectorTab(targetTab);
    });
  });
}

function openProjectInspector(projectId) {
  const projects = window.PROJECTS_DATA || (typeof PROJECTS_DATA !== 'undefined' ? PROJECTS_DATA : []);
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  activeProject = project;

  const drawer = document.getElementById('project-drawer');
  const backdrop = document.getElementById('project-backdrop');
  if (!drawer || !backdrop) return;

  document.getElementById('drawer-project-title').textContent = project.title;
  document.getElementById('drawer-project-badge').textContent = project.badge;
  document.getElementById('drawer-project-category').textContent = project.category;
  document.getElementById('drawer-project-tagline').textContent = project.tagline;

  const githubBtn = document.getElementById('drawer-github-link');
  if (githubBtn) {
    githubBtn.href = project.githubUrl || project.fallbackGithubUrl || "https://github.com/jesurod";
    githubBtn.setAttribute('title', `Abrir ${project.title} en GitHub`);
  }

  document.getElementById('drawer-project-abstract').textContent = project.abstract;
  document.getElementById('drawer-project-business').textContent = project.businessImpact;
  
  const drawerLoss = document.getElementById('drawer-project-loss');
  if (drawerLoss) {
    drawerLoss.setAttribute('data-math-latex', project.lossOrObjective);
    drawerLoss.setAttribute('data-math-block', 'true');
    drawerLoss.innerHTML = renderMathFormula(project, true);
  }

  const metricsContainer = document.getElementById('drawer-metrics-container');
  if (metricsContainer) {
    metricsContainer.innerHTML = project.metrics.map(m => `
      <div class="bg-brand-bg/90 border border-white/10 rounded-xl p-4">
        <div class="text-xs font-mono text-brand-muted uppercase tracking-wider mb-1">${m.label}</div>
        <div class="text-2xl font-mono font-bold text-white mb-0.5">${m.value}</div>
        <div class="text-xs text-emerald-400 font-sans flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          ${m.delta}
        </div>
      </div>
    `).join('');
  }

  const pipelineContainer = document.getElementById('drawer-pipeline-container');
  if (pipelineContainer) {
    pipelineContainer.innerHTML = project.pipeline.map((step, idx) => `
      <div class="relative pl-8 pb-6 last:pb-0">
        ${idx < project.pipeline.length - 1 ? '<div class="absolute left-3.5 top-5 w-0.5 h-full bg-brand-border"></div>' : ''}
        <div class="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-brand-surface border-2 border-brand-accent flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
        </div>
        <div>
          <h4 class="font-mono text-sm font-semibold text-white tracking-wide">${step.step}</h4>
          <p class="text-xs text-brand-muted mt-1 leading-relaxed font-light">${step.desc}</p>
        </div>
      </div>
    `).join('');
  }

  const codeEl = document.getElementById('drawer-code-block');
  if (codeEl) codeEl.textContent = project.codeSnippet.code;

  const codeLangEl = document.getElementById('drawer-code-lang');
  if (codeLangEl) codeLangEl.textContent = project.codeSnippet.lang.toUpperCase();

  const tagsContainer = document.getElementById('drawer-tags-container');
  if (tagsContainer) {
    tagsContainer.innerHTML = project.tags.map(t => `
      <span class="text-xs font-mono px-3 py-1 bg-brand-bg text-brand-accent border border-brand-accent/20 rounded-md">
        ${t}
      </span>
    `).join('');
  }

  switchInspectorTab('overview');

  backdrop.classList.remove('hidden');
  setTimeout(() => {
    backdrop.classList.remove('opacity-0');
    drawer.classList.remove('translate-x-full');
  }, 10);
  document.body.classList.add('overflow-hidden');
}

function closeProjectInspector() {
  const drawer = document.getElementById('project-drawer');
  const backdrop = document.getElementById('project-backdrop');
  if (!drawer || !backdrop) return;

  drawer.classList.add('translate-x-full');
  backdrop.classList.add('opacity-0');
  setTimeout(() => {
    backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }, 300);
}

function switchInspectorTab(tabId) {
  document.querySelectorAll('.inspector-tab-btn').forEach(btn => {
    const isCurrent = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('text-brand-accent', isCurrent);
    btn.classList.toggle('border-brand-accent', isCurrent);
    btn.classList.toggle('text-brand-muted', !isCurrent);
    btn.classList.toggle('border-transparent', !isCurrent);
  });

  document.querySelectorAll('.inspector-tab-content').forEach(pane => {
    pane.classList.toggle('hidden', pane.id !== `tab-content-${tabId}`);
  });
}

/**
 * 3. Official PDF CV Modal Engine (Exact Original Documents)
 */
function initCVModal() {
  const cvOpenBtns = document.querySelectorAll('.trigger-cv-modal');
  const cvCloseBtn = document.getElementById('cv-modal-close');
  const cvBackdrop = document.getElementById('cv-backdrop');
  const cvPrintBtn = document.getElementById('cv-print-btn');

  cvOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const requestedLang = btn.getAttribute('data-cv-lang') || 'es';
      openCVModal(requestedLang);
    });
  });

  if (cvCloseBtn) cvCloseBtn.addEventListener('click', closeCVModal);
  if (cvBackdrop) cvBackdrop.addEventListener('click', closeCVModal);

  // Print button opens official PDF in dedicated print view
  if (cvPrintBtn) {
    cvPrintBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = CV_DATA[currentCvLang] || CV_DATA.es;
      window.open(data.downloadFile, '_blank');
    });
  }

  // Language switcher tabs inside modal
  document.querySelectorAll('.cv-lang-switch').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      renderCVContent(lang);
    });
  });
}

function openCVModal(lang = 'es') {
  renderCVContent(lang);

  const modal = document.getElementById('cv-modal');
  const backdrop = document.getElementById('cv-backdrop');
  if (!modal || !backdrop) return;

  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  setTimeout(() => {
    backdrop.classList.remove('opacity-0');
    modal.classList.remove('opacity-0', 'scale-95');
  }, 10);
  document.body.classList.add('overflow-hidden');
}

function closeCVModal() {
  const modal = document.getElementById('cv-modal');
  const backdrop = document.getElementById('cv-backdrop');
  if (!modal || !backdrop) return;

  backdrop.classList.add('opacity-0');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    backdrop.classList.add('hidden');
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }, 250);
}

function renderCVContent(lang = 'es') {
  currentCvLang = lang;
  const data = CV_DATA[lang] || CV_DATA.es;

  // Update switcher buttons
  document.querySelectorAll('.cv-lang-switch').forEach(btn => {
    const isThis = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('bg-brand-accent', isThis);
    btn.classList.toggle('text-brand-bg', isThis);
    btn.classList.toggle('font-bold', isThis);
    btn.classList.toggle('bg-white/5', !isThis);
    btn.classList.toggle('text-brand-muted', !isThis);
  });

  // Update the embedded PDF iframe
  const iframe = document.getElementById('cv-pdf-frame');
  if (iframe) {
    iframe.src = data.downloadFile;
  }

  // Update external open / print link
  const openLink = document.getElementById('cv-open-pdf-link');
  if (openLink) {
    openLink.href = data.downloadFile;
    openLink.title = data.openText;
  }

  // Update direct download link
  const downloadLink = document.getElementById('cv-download-btn');
  if (downloadLink) {
    downloadLink.href = data.downloadFile;
    downloadLink.setAttribute('download', data.downloadFile.split('/').pop());
    const label = downloadLink.querySelector('.cv-download-text');
    if (label) label.textContent = data.downloadText;
  }

  // Update fallback link inside iframe
  const fallbackLink = document.getElementById('cv-fallback-link');
  if (fallbackLink) {
    fallbackLink.href = data.downloadFile;
  }
}

/**
 * 4. Clipboard Copy Utilities
 */
function initCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-target');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyToast(btn.getAttribute('data-copy-label') || 'Copiado al portapapeles');
      }).catch(err => {
        console.error('Error al copiar:', err);
      });
    });
  });

  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeBlock = document.getElementById('drawer-code-block');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          showCopyToast('Fragmento de código copiado');
        });
      }
    });
  }
}

function showCopyToast(message) {
  let toast = document.getElementById('toast-feedback');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-feedback';
    toast.className = 'fixed bottom-8 right-8 z-[100] bg-brand-surface border border-brand-accent/40 text-white font-mono text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 transition-all duration-300 transform translate-y-6 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span>${message}</span>
  `;

  toast.classList.remove('translate-y-6', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-6', 'opacity-0');
  }, 2400);
}

/**
 * 5. Quick Contact Form / Mailto Constructor
 */
function initQuickContactForm() {
  const form = document.getElementById('quick-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Contacto Profesional';
    const company = document.getElementById('contact-company')?.value || '';
    const subject = document.getElementById('contact-subject')?.value || 'Propuesta / Oportunidad de colaboración';
    const message = document.getElementById('contact-message')?.value || '';

    const mailtoBody = encodeURIComponent(
      `Hola Jesús,\n\nMi nombre es ${name}${company ? ` de ${company}` : ''}.\n\nMensaje:\n${message}\n\nUn cordial saludo.`
    );
    const mailtoSubject = encodeURIComponent(`[Portafolio Data/ADE] ${subject}`);

    window.location.href = `mailto:jesurod24@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  });
}

/**
 * 6. Smooth Scrolling
 */
function initNavigationScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders LaTeX math expressions using KaTeX if available,
 * falling back to formatted readable math notation.
 */
function renderMathFormula(project, isBlock = false) {
  if (!project) return '';
  const latex = typeof project === 'string' ? project : (project.lossOrObjective || '');
  const htmlFallback = (typeof project === 'object' && project.formattedObjective) 
    ? project.formattedObjective 
    : formatLatexFallback(latex);

  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(latex, {
        throwOnError: false,
        displayMode: isBlock
      });
    } catch (e) {
      console.warn('KaTeX fallback triggered:', e);
    }
  }

  return htmlFallback;
}

/**
 * Robust Unicode fallback for LaTeX math formulas when KaTeX is not yet initialized
 */
function formatLatexFallback(latex) {
  if (!latex) return '';
  return latex
    .replace(/\\max_\{([^}]+)\}/g, 'max_{$1}')
    .replace(/\\min_\{([^}]+)\}/g, 'min_{$1}')
    .replace(/\\max/g, 'max')
    .replace(/\\min/g, 'min')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\boldsymbol\{([^}]+)\}/g, '$1')
    .replace(/\\mathcal\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑_{$1}^{$2}')
    .replace(/\\sum/g, '∑')
    .replace(/\\cdot/g, '·')
    .replace(/\\otimes/g, '⊗')
    .replace(/\\iff/g, ' ⟺ ')
    .replace(/\\implies/g, ' ⟹ ')
    .replace(/\\le_p/g, '≤ₚ')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\in/g, ' ∈ ')
    .replace(/\\notin/g, ' ∉ ')
    .replace(/\\ne/g, '≠')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\ell/g, 'ℓ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    .replace(/\^T/g, 'ᵀ')
    .replace(/\\\|/g, '‖')
    .replace(/\\quad/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\,/g, ' ')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Automatically upgrades any math container with KaTeX typography
 * as soon as the KaTeX script finishes loading.
 */
function upgradeAllMathFormulas() {
  if (typeof window === 'undefined' || !window.katex || typeof window.katex.renderToString !== 'function') return;
  document.querySelectorAll('.math-formula[data-math-latex]').forEach(el => {
    const latex = el.getAttribute('data-math-latex');
    const isBlock = el.getAttribute('data-math-block') === 'true';
    if (latex) {
      try {
        el.innerHTML = window.katex.renderToString(latex, { throwOnError: false, displayMode: isBlock });
      } catch (err) {}
    }
  });

  const drawerLoss = document.getElementById('drawer-project-loss');
  if (drawerLoss && drawerLoss.getAttribute('data-math-latex')) {
    const latex = drawerLoss.getAttribute('data-math-latex');
    try {
      drawerLoss.innerHTML = window.katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch (err) {}
  }
}

// Watch for KaTeX readiness and upgrade formulas
if (typeof window !== 'undefined') {
  if (window.katex) {
    upgradeAllMathFormulas();
  } else {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.katex) {
        clearInterval(interval);
        upgradeAllMathFormulas();
      } else if (attempts > 50) {
        clearInterval(interval);
      }
    }, 100);
  }
}
