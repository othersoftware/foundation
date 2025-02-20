export const ErrorModal = {
  modal: undefined as HTMLDialogElement | undefined,
  listener: undefined as any,

  show(html: Record<string, unknown> | string): void {
    if (typeof html === 'object') {
      html = `All requests must receive a valid MVC response, however a plain JSON response was received.<hr>${JSON.stringify(html)}`;
    }

    const page = document.createElement('html');
    page.innerHTML = html;
    page.querySelectorAll('a').forEach((a) => a.setAttribute('target', '_top'));

    this.modal = document.createElement('dialog') as HTMLDialogElement;
    this.modal.style.display = 'flex';
    this.modal.style.width = '100%';
    this.modal.style.height = '100dvh';
    this.modal.style.maxWidth = '100%';
    this.modal.style.maxHeight = '100dvh';
    this.modal.style.padding = '2rem';
    this.modal.style.boxSizing = 'border-box';
    this.modal.style.border = 'none';
    this.modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    this.modal.style.backdropFilter = 'blur(0.125rem)';
    this.modal.addEventListener('click', () => this.hide());

    const iframe = document.createElement('iframe');
    iframe.style.backgroundColor = 'white';
    iframe.style.borderRadius = '0.5rem';
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    this.modal.appendChild(iframe);

    document.body.prepend(this.modal);
    document.body.style.overflow = 'hidden';

    if (!iframe.contentWindow) {
      throw new Error('iframe not yet ready.');
    }

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(page.outerHTML);
    iframe.contentWindow.document.close();

    this.listener = this.hideOnEscape.bind(this);

    this.modal.showModal();

    document.addEventListener('keydown', this.listener);
  },

  hide(): void {
    this.modal!.outerHTML = '';
    this.modal = undefined;
    document.body.style.overflow = 'visible';
    document.removeEventListener('keydown', this.listener!);
  },

  hideOnEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.hide();
    }
  },
};
