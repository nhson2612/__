import React from 'react';
import PropTypes from 'prop-types';
import {BlockStack, Select, TextField} from '@shopify/polaris';
import './TriggersSettings.css';

/**
 * TriggersSettings component for configuring page trigger restrictions.
 * @param {string} pageRestriction - Current page restriction setting ('all' or 'specific')
 * @param {function} onPageRestrictionChange - Callback for page restriction changes
 * @param {string} specificPages - Comma-separated list of specific pages to include
 * @param {function} onSpecificPagesChange - Callback for specific pages changes
 * @param {string} excludedPages - Newline-separated list of pages to exclude
 * @param {function} onExcludedPagesChange - Callback for excluded pages changes
 * @return {React.JSX.Element} The TriggersSettings component
 */
export default function TriggersSettings({
  pageRestriction,
  onPageRestrictionChange,
  specificPages,
  onSpecificPagesChange,
  excludedPages,
  onExcludedPagesChange
}) {
  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'}
  ];

  return (
    <BlockStack gap="400">
      <Select
        label="PAGES RESTRICTION"
        options={options}
        onChange={onPageRestrictionChange}
        value={pageRestriction}
      />

      {pageRestriction === 'specific' && (
        <TextField
          label="Included Pages"
          value={specificPages}
          onChange={onSpecificPagesChange}
          placeholder="/products/my-product"
          helpText="Enter the page URLs where you WANT the notification to appear."
          autoComplete="off"
        />
      )}

      <TextField
        label="Excluded Pages"
        value={excludedPages}
        onChange={onExcludedPagesChange}
        helpText="Page URLs NOT to show the pop-up (separated by new lines)"
        autoComplete="off"
        multiline={4}
      />
    </BlockStack>
  );
}

TriggersSettings.propTypes = {
  pageRestriction: PropTypes.string.isRequired,
  onPageRestrictionChange: PropTypes.func.isRequired,
  specificPages: PropTypes.string.isRequired,
  onSpecificPagesChange: PropTypes.func.isRequired,
  excludedPages: PropTypes.string.isRequired,
  onExcludedPagesChange: PropTypes.func.isRequired
};
