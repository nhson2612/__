import React from 'react';
import PropTypes from 'prop-types';
import {Box, Text} from '@shopify/polaris';

export default function PositionOption({label, value, selected, onClick, positionClass}) {
  const borderColor = selected ? '2px solid #5c6ac4' : '2px solid #e1e3e5';
  const blockColor = selected ? '#5c6ac4' : '#e1e3e5';

  return (
    <div
      className="display-position-wrapper"
      onClick={() => onClick(value)}
      style={{cursor: 'pointer'}}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '96px',
          backgroundColor: '#fff',
          border: borderColor,
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '60px',
            height: '30px',
            backgroundColor: blockColor,
            ...parsePositionClass(positionClass)
          }}
        />
      </div>
      <Box paddingBlockStart="200">
        <Text
          variant="bodyXs"
          alignment="center"
          fontWeight="medium"
          tone={selected ? 'primary' : 'subdued'}
        >
          {label}
        </Text>
      </Box>
    </div>
  );
}

PositionOption.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  positionClass: PropTypes.string.isRequired
};

/**
 * Parses position class strings into CSS style objects.
 *
 * @param {string} className - Position class string (e.g., 'bottom-3 left-3')
 * @return {Object} CSS style object with position properties
 */
function parsePositionClass(className) {
  const style = {};
  if (className.includes('bottom-3')) style.bottom = '12px';
  if (className.includes('top-3')) style.top = '12px';
  if (className.includes('left-3')) style.left = '12px';
  if (className.includes('right-3')) style.right = '12px';
  return style;
}
