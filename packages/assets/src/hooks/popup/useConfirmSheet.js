import React, {useRef, useState} from 'react';
import {Button, Sheet, Text} from '@shopify/polaris';
import {XSmallIcon} from '@shopify/polaris-icons';

/**
 * Build a confirm sheet with a custom content component.
 * @param {function(object): React.ReactNode} [Content=() => <></>]
 * @param {string} [title='']
 * @param {'small' | 'large' | string} [size='small']
 * @param {boolean} [isNested=false] Check if sheet is opened within other sheet.
 * @returns {{openSheet: function(any): void, closeSheet: function(boolean): void, sheet: JSX.Element, open: boolean}}
 */
export default function useConfirmSheet({
  Content = () => <></>,
  title = '',
  size = 'small',
  isNested = false
}) {
  const [open, setOpen] = useState(false);
  const input = useRef(null);
  const closeCallback = useRef(() => {});
  const width = (() => {
    switch (size) {
      case 'small':
        return '38rem';
      case 'large':
        return 'calc(100vw - 24rem - calc(env(safe-area-inset-left, 0)))';
      default:
        return size;
    }
  })();
  /**
   * Update the global sheet width variable.
   * @param {string | null} [width=null]
   * @returns {void}
   */
  const setWidth = (width = null) => {
    if (width || !isNested) {
      document.documentElement.style.setProperty('--sheet--width', width);
    }
  };

  /**
   * Open the sheet and capture the current input context.
   * @param {any} [currentInput=null]
   * @returns {void}
   */
  const openSheet = (currentInput = null) => {
    setWidth(width);
    setOpen(true);
    input.current = currentInput;
    closeCallback.current = () => {};
  };

  /**
   * Close the sheet and optionally re-open after animation.
   * @param {boolean} [reOpen=false]
   * @returns {void}
   */
  const closeSheet = (reOpen = false) => {
    setOpen(false);
    if (reOpen) setWidth();
    setTimeout(() => {
      if (!reOpen) setWidth();
      closeCallback.current();
    }, 500);
  };

  const params = {input, closeCallback, closeSheet, openSheet};

  const sheet = (
    <Sheet accessibilityLabel="" open={open} onClose={() => closeSheet()}>
      <div className="Avada-Sheet__Wrapper">
        {title && (
          <div className="Avada-Sheet__Header">
            <Text variant="headingLg" as="p">
              {title}
            </Text>
            <Button icon={XSmallIcon} onClick={() => closeSheet()} variant="plain" />
          </div>
        )}
        <Content {...params} />
      </div>
    </Sheet>
  );

  return {sheet, open, closeSheet, openSheet};
}
