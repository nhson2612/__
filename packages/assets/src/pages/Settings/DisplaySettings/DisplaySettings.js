import React from 'react';
import PropTypes from 'prop-types';
import {BlockStack, Box, Checkbox, Text, InlineGrid} from '@shopify/polaris';
import AppRangeSlider from '@assets/components/AppRangeSlider/AppRageSlider';
import PositionOption from '@assets/components/PositionOption/PositionOption';
import styles from './DisplaySettings.module.css';

/**
 * DisplaySettings component for configuring popup display options.
 *
 * @param {object} settings - The settings object containing all display configurations
 * @param {function} onChange - Callback function to handle setting changes
 * @return {React.JSX.Element} The DisplaySettings component
 */
export default function DisplaySettings({settings, onChange}) {
  const {
    position,
    hideTimeAgo,
    truncateContent,
    displayDuration,
    firstPopDelay,
    gapTime,
    maxPopups
  } = settings;

  return (
    <div className={styles.displaySettings}>
      <BlockStack gap="500">
        <BlockStack gap="400">
          <Text variant="headingSm" as="h2" tone="subdued" textTransform="uppercase">
            Appearance
          </Text>
          <Box>
            <BlockStack gap="200">
              <Text variant="bodyMd" as="label">
                Desktop Position
              </Text>
              <InlineGrid columns={{xs: 1, sm: 2, md: 2, lg: 5, xl: 5}} gap="400">
                <PositionOption
                  value="bottom-left"
                  selected={position === 'bottom-left'}
                  onClick={value => onChange('position', value)}
                  color="bg-primary"
                  positionClass="bottom-3 left-3"
                />
                <PositionOption
                  value="bottom-right"
                  selected={position === 'bottom-right'}
                  onClick={value => onChange('position', value)}
                  color="bg-slate-200"
                  positionClass="bottom-3 right-3"
                />
                <PositionOption
                  value="top-left"
                  selected={position === 'top-left'}
                  onClick={value => onChange('position', value)}
                  color="bg-slate-200"
                  positionClass="top-3 left-3"
                />
                <PositionOption
                  value="top-right"
                  selected={position === 'top-right'}
                  onClick={value => onChange('position', value)}
                  color="bg-slate-200"
                  positionClass="top-3 right-3"
                />
                <div></div>
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
              onChange={value => onChange('hideTimeAgo', value)}
            />
            <Checkbox
              label="Truncate content text"
              checked={truncateContent}
              onChange={value => onChange('truncateContent', value)}
              helpText="If your product name is long for one line, it will be truncated to 'Product na...'"
            />
          </BlockStack>
        </BlockStack>

        {/* TIMING SECTION */}
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3" tone="subdued" textTransform="uppercase">
            TIMING
          </Text>

          <InlineGrid columns={{xs: 1, md: 2}} gap="600">
            <AppRangeSlider
              label="Display duration"
              value={displayDuration}
              onChange={value => onChange('displayDuration', value)}
              min={1}
              max={60}
              unitLabel="second(s)"
              helpText="How long each pop will display on your page."
            />
            <AppRangeSlider
              label="Time before the first pop"
              value={firstPopDelay}
              onChange={value => onChange('firstPopDelay', value)}
              min={1}
              max={60}
              unitLabel="second(s)"
              helpText="The delay time before the first notification."
            />
            <AppRangeSlider
              label="Gap time between two pops"
              value={gapTime}
              onChange={value => onChange('gapTime', value)}
              min={1}
              max={60}
              unitLabel="second(s)"
              helpText="The time interval between two popup notifications."
            />
            <AppRangeSlider
              label="Maximum of popups"
              value={maxPopups}
              onChange={value => onChange('maxPopups', value)}
              min={1}
              max={80}
              unitLabel="pop(s)"
              helpText="The maximum number of popups allowed to show after page loading. Maximum number is 80."
            />
          </InlineGrid>
        </BlockStack>
      </BlockStack>
    </div>
  );
}

DisplaySettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
