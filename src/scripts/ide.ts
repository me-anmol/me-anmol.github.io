let isNavigating = false;

function setActiveTab(fileId: string): void {
  document.querySelectorAll<HTMLElement>('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tabId === fileId);
  });
  document.querySelectorAll<HTMLElement>('.file-row').forEach(row => {
    row.classList.toggle('active', row.dataset.fileId === fileId);
  });
}

let vimFlashTimer: ReturnType<typeof setTimeout> | null = null;

function flashVimInsert(): void {
  const modeEl = document.getElementById('vim-mode');
  if (!modeEl) return;
  if (vimFlashTimer !== null) clearTimeout(vimFlashTimer);
  modeEl.textContent = '-- INSERT --';
  modeEl.classList.add('insert');
  vimFlashTimer = setTimeout(() => {
    modeEl.textContent = '-- NORMAL --';
    modeEl.classList.remove('insert');
    vimFlashTimer = null;
  }, 600);
}

function updateStatusbarFilename(fileId: string): void {
  const filenameEl = document.getElementById('vim-filename');
  if (!filenameEl) return;
  const section = document.getElementById(fileId);
  filenameEl.textContent = section?.dataset.filename ?? '';
}

function navigateToSection(fileId: string): void {
  const section = document.getElementById(fileId);
  if (!section) return;
  isNavigating = true;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setActiveTab(fileId);
  updateStatusbarFilename(fileId);
  flashVimInsert();
  // Clear after scroll settles (smooth scroll takes ~500ms max)
  setTimeout(() => { isNavigating = false; }, 800);
}

// Sidebar file clicks
document.querySelectorAll<HTMLElement>('.file-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.dataset.fileId;
    if (id) navigateToSection(id);
  });
});

// Sidebar outline clicks
document.querySelectorAll<HTMLElement>('.outline-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.dataset.target;
    if (id) navigateToSection(id);
  });
});

// Tab clicks
document.querySelectorAll<HTMLElement>('.tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('tab-close')) return;
    const id = tab.dataset.tabId;
    if (id) navigateToSection(id);
  });
});

// IntersectionObserver — update active tab/filename as sections scroll into view
const visibleSections = new Set<Element>();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) visibleSections.add(e.target);
      else visibleSections.delete(e.target);
    });
    const sorted = Array.from(visibleSections)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    const topmost = sorted[0] as HTMLElement | undefined;
    if (topmost && !isNavigating) {
      setActiveTab(topmost.id);
      updateStatusbarFilename(topmost.id);
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll<HTMLElement>('.editor-section').forEach(section => {
  sectionObserver.observe(section);
});

// Scroll → Ln counter
const editorArea = document.getElementById('editor-area');
const lnEl = document.getElementById('vim-ln');

if (editorArea && lnEl) {
  editorArea.addEventListener('scroll', () => {
    const lineHeight = 20.8;
    const ln = Math.floor(editorArea.scrollTop / lineHeight) + 1;
    lnEl.textContent = `Ln ${ln}, Col 1`;
  });
}

// Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.querySelectorAll<HTMLElement>('.file-row, .outline-row').forEach(row => {
    row.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });
}
