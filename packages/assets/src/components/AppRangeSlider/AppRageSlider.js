import {Box, InlineStack, LegacyCard, RangeSlider, Text} from '@shopify/polaris';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * @return {React.JSX.Element}
 * @constructor
 */
function AppRangeSlider({label, value, onChange, min, max, unitLabel, helpText}) {
  return (
    <RangeSlider
      label={label}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      output
      suffix={
        <LegacyCard>
          <Box padding="200" borderRadius="0">
            <InlineStack gap="200" blockAlign="center">
              <Text as={'h5'}>{value}</Text>
              <Text as={'p'}>{unitLabel}</Text>
            </InlineStack>
          </Box>
        </LegacyCard>
      }
      helpText={helpText}
    />
  );
}

AppRangeSlider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  unitLabel: PropTypes.string.isRequired,
  helpText: PropTypes.string
};

export default AppRangeSlider;
