import {insertAfter} from '../helpers/insertHelpers';

export default class DomManager {
  /**
   * Insert the popup container into the DOM
   * @returns {HTMLElement}
   */
  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = 'Avada-SalePop';
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    const targetEl = document.querySelector('body').firstChild;

    if (targetEl) {
      insertAfter(popupEl, targetEl);
    } else {
      document.body.appendChild(popupEl);
    }

    return popupEl;
  }

  /**
   * Apply position styles to the popup container
   * @param {HTMLElement} container
   * @param {Object} displaySettings
   */
  applyPositionStyles(container, displaySettings) {
    const position = displaySettings?.position || 'bottom-left';
    const [yAxis, xAxis] = position.split('-');

    Object.assign(container.style, {
      position: 'fixed',
      zIndex: '999999',
      [yAxis || 'bottom']: '20px',
      [xAxis || 'left']: '20px'
    });
  }

  /**
   * Get the popup container element
   * @returns {HTMLElement|null}
   */
  getContainer() {
    return document.querySelector('#Avada-SalePop');
  }

  /**
   * Check if page passes restriction rules
   * @param {Object} settings
   * @returns {boolean}
   */
  checkPageRestriction(settings) {
    const {triggers} = settings;
    const {pageRestriction, specificPages, excludedPages} = triggers || {};
    const path = window.location.pathname;

    if (pageRestriction === 'specific') {
      return specificPages?.some(p => path.includes(p));
    }

    if (excludedPages?.some(p => path.includes(p))) {
      return false;
    }

    return true;
  }
}
