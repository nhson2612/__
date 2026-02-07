import React from 'react';
import PropTypes from 'prop-types';
import {
  BlockStack,
  Box,
  Checkbox,
  RangeSlider,
  Text,
  InlineGrid,
  Divider,
  LegacyCard,
  InlineStack
} from '@shopify/polaris';
import PositionOption from '@assets/components/PositionOption/PositionOption';
import styles from './DisplaySettings.module.css';

/**
 * DisplaySettings component for configuring popup display options.
 *
 * @param {string} position - Current position of popups (e.g., 'bottom-left')
 * @param {function} onPositionChange - Callback for position changes
 * @param {boolean} hideTimeAgo - Whether to hide time ago display
 * @param {function} onHideTimeAgoChange - Callback for hideTimeAgo changes
 * @param {boolean} truncateContent - Whether to truncate content text
 * @param {function} onTruncateContentChange - Callback for truncateContent changes
 * @param {number} displayDuration - Duration to display each popup in seconds
 * @param {function} onDisplayDurationChange - Callback for displayDuration changes
 * @param {number} firstPopDelay - Delay before first popup appears in seconds
 * @param {function} onFirstPopDelayChange - Callback for firstPopDelay changes
 * @param {number} gapTime - Time between popups in seconds
 * @param {function} onGapTimeChange - Callback for gapTime changes
 * @param {number} maxPopups - Maximum number of popups to show
 * @param {function} onMaxPopupsChange - Callback for maxPopups changes
 * @return {React.JSX.Element} The DisplaySettings component
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
    <div className={styles.displaySettings}>
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
              <InlineGrid columns={{xs: 2, sm: 5}} gap="400">
                <PositionOption
                  value="bottom-left"
                  selected={position === 'bottom-left'}
                  onClick={onPositionChange}
                  color="bg-primary"
                  positionClass="bottom-3 left-3"
                />
                <PositionOption
                  value="bottom-right"
                  selected={position === 'bottom-right'}
                  onClick={onPositionChange}
                  color="bg-slate-200"
                  positionClass="bottom-3 right-3"
                />
                <PositionOption
                  value="top-left"
                  selected={position === 'top-left'}
                  onClick={onPositionChange}
                  color="bg-slate-200"
                  positionClass="top-3 left-3"
                />
                <PositionOption
                  value="top-right"
                  selected={position === 'top-right'}
                  onClick={onPositionChange}
                  color="bg-slate-200"
                  positionClass="top-3 right-3"
                />
                <div>

                </div>
              </InlineGrid>
              <Text variant="bodySm" tone="subdued" as="p">
                The display position of the pop on your website.
              </Text>
            </BlockStack>
          </Box>

          <BlockStack gap="200">
            <Checkbox label="Hide time ago" checked={hideTimeAgo} onChange={onHideTimeAgoChange} />
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
          <Text variant="headingSm" as="h3" tone="subdued" textTransform="uppercase">
            TIMING
          </Text>

          <InlineGrid columns={{xs: 1, md: 2}} gap="600">
            <RangeSlider
              label="Display duration"
              value={displayDuration}
              onChange={onDisplayDurationChange}
              min={1}
              max={60}
              output
              helpText="How long each pop will display on your page."
              suffix={
                <LegacyCard>
                  <Box padding="200" borderRadius="0">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as={'h5'}>{displayDuration}</Text>
                      <Text as={'p'}>second(s)</Text>
                    </InlineStack>
                  </Box>
                </LegacyCard>
              }
            />
            <RangeSlider
              label="Time before the first pop"
              value={firstPopDelay}
              onChange={onFirstPopDelayChange}
              min={1}
              max={60}
              output
              suffix={
                <LegacyCard>
                  <Box padding="200" borderRadius="0">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as={'h5'}>{firstPopDelay}</Text>
                      <Text as={'p'}>second(s)</Text>
                    </InlineStack>
                  </Box>
                </LegacyCard>
              }
              helpText="The delay time before the first notification."
            />
            <RangeSlider
              label="Gap time between two pops"
              value={gapTime}
              onChange={onGapTimeChange}
              min={0}
              max={60}
              output
              suffix={
                <LegacyCard>
                  <Box padding="200" borderRadius="0">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as={'h5'}>{gapTime}</Text>
                      <Text as={'p'}>second(s)</Text>
                    </InlineStack>
                  </Box>
                </LegacyCard>
              }
              helpText="The time interval between two popup notifications."
            />
            <RangeSlider
              label="Maximum of popups"
              value={maxPopups}
              onChange={onMaxPopupsChange}
              min={1}
              max={80}
              output
              suffix={
                <LegacyCard>
                  <Box padding="200" borderRadius="0">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as={'h5'}>{maxPopups}</Text>
                      <Text as={'p'}>pop(s)</Text>
                    </InlineStack>
                  </Box>
                </LegacyCard>
              }
              helpText="The maximum number of popups allowed to show after page loading. Maximum number is 80."
            />
          </InlineGrid>
        </BlockStack>
      </BlockStack>
    </div>
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
