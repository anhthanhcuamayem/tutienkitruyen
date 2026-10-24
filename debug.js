/**
 * Global client-side error recorder.
 * Console commands:
 *   getGameErrors()   - xem toàn bộ lỗi đã ghi
 *   clearGameErrors() - xóa bộ nhớ lỗi
 */
(function () {
  'use strict';

  const errors = [];
  const MAX_ERRORS = 100;

  function normalizeError(error) {
    if (error instanceof Error) {
      return { name: error.name, message: error.message, stack: error.stack || '' };
    }
    if (typeof error === 'string') return { name: 'Error', message: error, stack: '' };
    try {
      return { name: 'Error', message: JSON.stringify(error), stack: '' };
    } catch (_) {
      return { name: 'Error', message: String(error), stack: '' };
    }
  }

  const gameDebug = {
    errors,
    capture(error, context = {}) {
      const normalized = normalizeError(error);
      const entry = {
        time: new Date().toISOString(),
        ...normalized,
        context: { ...context },
        page: window.location.href
      };
      errors.push(entry);
      if (errors.length > MAX_ERRORS) errors.shift();
      console.error('[GAME ERROR]', entry);
      return entry;
    },
    getErrors() {
      return errors.slice();
    },
    clear() {
      errors.length = 0;
      console.info('[GAME DEBUG] Đã xóa bộ nhớ lỗi.');
    }
  };

  window.gameDebug = gameDebug;
  window.GAME_ERRORS = errors;
  window.getGameErrors = () => gameDebug.getErrors();
  window.clearGameErrors = () => gameDebug.clear();

  window.addEventListener('error', event => {
    gameDebug.capture(event.error || event.message, {
      type: 'window.error',
      file: event.filename || '',
      line: event.lineno || 0,
      column: event.colno || 0
    });
  });

  window.addEventListener('unhandledrejection', event => {
    gameDebug.capture(event.reason, { type: 'unhandledrejection' });
  });
})();
