import React from 'react';
import PropTypes from 'prop-types';
import {BlockStack, Box, Checkbox, RangeSlider, Text, InlineGrid, Divider} from '@shopify/polaris';

/**
 * @return {React.JSX.Element}
 */
export default function DisplaySettings({
  position,
  onPositionChange,
  hideTimeAgo,
  onHideTimeAgoChange,
  truncateContent,
  onTruncateContentChange,
  displayDuration,
  onDisplayDurationChange,
  firstPopDelay,
  onFirstPopDelayChange,
  gapTime,
  onGapTimeChange,
  maxPopups,
  onMaxPopupsChange
}) {
  return (
    <BlockStack gap="500">
      <BlockStack gap="400">
        <Text variant="headingSm" as="h2" tone="subdued" textTransform="uppercase">
          Appearance
        </Text>

        <Box>
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="medium" as="label">
              Desktop Position
            </Text>
            <InlineGrid columns={{xs: 2, sm: 4}} gap="400">
              <PositionOption
                label="Bottom Left"
                value="bottom-left"
                selected={position === 'bottom-left'}
                onClick={onPositionChange}
                color="bg-primary"
                positionClass="bottom-3 left-3"
              />
              <PositionOption
                label="Bottom Right"
                value="bottom-right"
                selected={position === 'bottom-right'}
                onClick={onPositionChange}
                color="bg-slate-200"
                positionClass="bottom-3 right-3"
              />
              <PositionOption
                label="Top Left"
                value="top-left"
                selected={position === 'top-left'}
                onClick={onPositionChange}
                color="bg-slate-200"
                positionClass="top-3 left-3"
              />
              <PositionOption
                label="Top Right"
                value="top-right"
                selected={position === 'top-right'}
                onClick={onPositionChange}
                color="bg-slate-200"
                positionClass="top-3 right-3"
              />
            </InlineGrid>
            <Text variant="bodySm" tone="subdued" as="p">
              The display position of the pop on your website.
            </Text>
          </BlockStack>
        </Box>

        <BlockStack gap="200">
          <Checkbox
            label="Hide time ago"
            checked={hideTimeAgo}
            onChange={onHideTimeAgoChange}
          />
          <Checkbox
            label="Truncate content text"
            checked={truncateContent}
            onChange={onTruncateContentChange}
            helpText="If your product name is long for one line, it will be truncated to 'Product na...'"
          />
        </BlockStack>
      </BlockStack>

      <Divider />

      {/* TIMING SECTION */}
      <BlockStack gap="400">
        <Text variant="headingSm" as="h2" tone="subdued" textTransform="uppercase">
          Timing
        </Text>

        <InlineGrid columns={{xs: 1, md: 2}} gap="600">
          <RangeSlider
            label="Display duration"
            value={displayDuration}
            onChange={onDisplayDurationChange}
            min={1}
            max={60}
            output
            suffix="second(s)"
            helpText="How long each pop will display on your page."
          />
          <RangeSlider
            label="Time before the first pop"
            value={firstPopDelay}
            onChange={onFirstPopDelayChange}
            min={1}
            max={60}
            output
            suffix="second(s)"
            helpText="The delay time before the first notification."
          />
          <RangeSlider
            label="Gap time between two pops"
            value={gapTime}
            onChange={onGapTimeChange}
            min={0}
            max={60}
            output
            suffix="second(s)"
            helpText="The time interval between two popup notifications."
          />
          <RangeSlider
            label="Maximum of popups"
            value={maxPopups}
            onChange={onMaxPopupsChange}
            min={1}
            max={80}
            output
            suffix="pop(s)"
            helpText="The maximum number of popups allowed to show after page loading. Maximum number is 80."
          />
        </InlineGrid>
      </BlockStack>
    </BlockStack>
  );
}

DisplaySettings.propTypes = {
  position: PropTypes.string.isRequired,
  onPositionChange: PropTypes.func.isRequired,
  hideTimeAgo: PropTypes.bool.isRequired,
  onHideTimeAgoChange: PropTypes.func.isRequired,
  truncateContent: PropTypes.bool.isRequired,
  onTruncateContentChange: PropTypes.func.isRequired,
  displayDuration: PropTypes.number.isRequired,
  onDisplayDurationChange: PropTypes.func.isRequired,
  firstPopDelay: PropTypes.number.isRequired,
  onFirstPopDelayChange: PropTypes.func.isRequired,
  gapTime: PropTypes.number.isRequired,
  onGapTimeChange: PropTypes.func.isRequired,
  maxPopups: PropTypes.number.isRequired,
  onMaxPopupsChange: PropTypes.func.isRequired
};

/**
 *
 * @param label
 * @param value
 * @param selected
 * @param onClick
 * @param positionClass
 * @returns {React.JSX.Element}
 * @constructor
 */
function PositionOption({label, value, selected, onClick, positionClass}) {
  const borderColor = selected ? '2px solid #5c6ac4' : '1px solid #e1e3e5';
  const blockColor = selected ? '#5c6ac4' : '#e1e3e5';

  return (
    <div onClick={() => onClick(value)} style={{cursor: 'pointer'}}>
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
            width: '40px',
            height: '20px',
            backgroundColor: blockColor,
            borderRadius: '4px',
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
 *
 * @param className
 * @returns {{}}
 */
function parsePositionClass(className) {
  const style = {};
  if (className.includes('bottom-3')) style.bottom = '12px';
  if (className.includes('top-3')) style.top = '12px';
  if (className.includes('left-3')) style.left = '12px';
  if (className.includes('right-3')) style.right = '12px';
  return style;
}