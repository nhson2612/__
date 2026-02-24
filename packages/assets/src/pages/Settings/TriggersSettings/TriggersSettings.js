import React from 'react';
import PropTypes from 'prop-types';
import {BlockStack} from '@shopify/polaris';
import CustomSelect from '@assets/components/FormControls/CustomSelect';
import CustomTextField from '@assets/components/FormControls/CustomTextField';
import './TriggersSettings.css';

/**
 * TriggersSettings component for configuring page trigger restrictions.
 * @param {object} settings - The settings object containing all trigger configurations
 * @param {function} onChange - Callback function to handle setting changes
 * @return {React.JSX.Element} The TriggersSettings component
 */
export default function TriggersSettings({settings, onChange}) {
  const {pageRestriction, specificPages, excludedPages} = settings;

  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'}
  ];

  return (
    <BlockStack gap="400">
      <CustomSelect
        label="PAGES RESTRICTION"
        options={options}
        onChange={value => onChange('pageRestriction', value)}
        value={pageRestriction}
      />

      {pageRestriction === 'specific' && (
        <CustomTextField
          label="Included Pages"
          value={specificPages}
          onChange={value => onChange('specificPages', value)}
          placeholder="/products/my-product"
          helpText="Enter the page URLs where you WANT the notification to appear."
          autoComplete="off"
        />
      )}

      <CustomTextField
        label="Excluded Pages"
        value={excludedPages}
        onChange={value => onChange('excludedPages', value)}
        helpText="Page URLs NOT to show the pop-up (separated by new lines)"
        autoComplete="off"
        multiline={4}
      />
    </BlockStack>
  );
}

TriggersSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
