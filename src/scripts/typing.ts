function typeContent(el: HTMLElement): void {
  const lines = Array.from(el.querySelectorAll<HTMLElement>('.code-line'));
  const originalHTML = lines.map(l => l.innerHTML);
  lines.forEach(l => { l.innerHTML = ''; });

  let lineIndex = 0;
  let charIndex = 0;

  function getVisibleHTML(html: string, visibleChars: number): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let remaining = visibleChars;
    function walk(node: Node): void {
      if (remaining <= 0) {
        if (node.parentNode) node.parentNode.removeChild(node);
        return;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (text.length <= remaining) {
          remaining -= text.length;
        } else {
          node.textContent = text.slice(0, remaining);
          remaining = 0;
        }
      } else {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(tmp);
    return tmp.innerHTML;
  }

  const textLengths = originalHTML.map(html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent?.length ?? 0;
  });

  function tick(): void {
    if (lineIndex >= lines.length) return;
    const maxChars = textLengths[lineIndex];
    charIndex++;
    lines[lineIndex].innerHTML = getVisibleHTML(originalHTML[lineIndex], charIndex);
    if (charIndex >= maxChars) {
      lineIndex++;
      charIndex = 0;
    }
    if (lineIndex < lines.length) {
      setTimeout(tick, 18);
    }
  }

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '█';
  lines[0].appendChild(cursor);

  setTimeout(() => {
    cursor.remove();
    tick();
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector<HTMLElement>('[data-typing="true"]');
  if (el) typeContent(el);
});
