import React, {useState, useCallback, useEffect} from 'react';
import {Layout, Page, LegacyCard, BlockStack, LegacyTabs} from '@shopify/polaris';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import DisplaySettings from './DisplaySettings/DisplaySettings';
import TriggersSettings from './TriggersSettings/TriggersSettings';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import SettingsSkeleton from '@assets/components/SettingsSkeleton/SettingsSkeleton';

/**
 * Settings component for managing popup notification configuration.
 *
 * This component provides a comprehensive settings interface for configuring
 * popup notifications, including display settings and trigger restrictions.
 * It handles API communication for fetching and saving settings data.
 *
 * @return {JSX.Element} The Settings component with display and triggers tabs
 */
export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);
  const {data: settingsData, loading, fetchApi} = useFetchApi({url: '/settings'});
  const {editing, handleEdit} = useEditApi({url: '/settings'});

  // Display Settings State
  const [position, setPosition] = useState('bottom-left');
  const [hideTimeAgo, setHideTimeAgo] = useState(false);
  const [truncateContent, setTruncateContent] = useState(true);
  const [displayDuration, setDisplayDuration] = useState(5);
  const [firstPopDelay, setFirstPopDelay] = useState(10);
  const [gapTime, setGapTime] = useState(2);
  const [maxPopups, setMaxPopups] = useState(20);

  // Triggers Settings State
  const [pageRestriction, setPageRestriction] = useState('all');
  const [specificPages, setSpecificPages] = useState('');
  const [excludedPages, setExcludedPages] = useState('');

  useEffect(() => {
    if (settingsData) {
      const {display, triggers} = settingsData;
      if (display) {
        setPosition(display.position || 'bottom-left');
        setHideTimeAgo(display.hideTimeAgo || false);
        setTruncateContent(display.truncateContent || false);
        setDisplayDuration(display.displayDuration || 5);
        setFirstPopDelay(display.firstPopDelay || 10);
        setGapTime(display.gapTime || 2);
        setMaxPopups(display.maxPopups || 20);
      }
      if (triggers) {
        setPageRestriction(triggers.pageRestriction || 'all');
        setSpecificPages(
          Array.isArray(triggers.specificPages) ? triggers.specificPages.join('\n') : ''
        );
        setExcludedPages(
          Array.isArray(triggers.excludedPages) ? triggers.excludedPages.join('\n') : ''
        );
      }
    }
  }, [settingsData]);

  /**
   * Handles tab selection changes in the settings interface.
   * 
   * @param {number} selectedTabIndex - Index of the selected tab (0 for Display, 1 for Triggers)
   */
  const handleTabChange = useCallback(selectedTabIndex => setSelectedTab(selectedTabIndex), []);

  /**
   * Handles saving the current settings configuration.
   * 
   * Collects all display and trigger settings, formats them appropriately,
   * sends them to the API, and refreshes the data to ensure synchronization.
   * 
   * @async
   * @return {Promise<void>} Resolves when settings are successfully saved
   */
  const handleSave = useCallback(async () => {
    const settings = {
      display: {
        position,
        hideTimeAgo,
        truncateContent,
        displayDuration,
        firstPopDelay,
        gapTime,
        maxPopups
      },
      triggers: {
        pageRestriction,
        specificPages: specificPages.split('\n').filter(x => x.trim()),
        excludedPages: excludedPages.split('\n').filter(x => x.trim())
      }
    };
    await handleEdit(settings);
    // Refresh data after save to ensure sync
    await fetchApi();
  }, [
    position,
    hideTimeAgo,
    truncateContent,
    displayDuration,
    firstPopDelay,
    gapTime,
    maxPopups,
    pageRestriction,
    specificPages,
    excludedPages,
    handleEdit,
    fetchApi
  ]);

  const tabs = [
    {
      id: 'display-tab',
      content: 'Display',
      panelID: 'display-panel'
    },
    {
      id: 'triggers-tab',
      content: 'Triggers',
      panelID: 'triggers-panel'
    }
  ];

  if (loading) return <SettingsSkeleton />;

  return (
    <Page
      fullWidth
      title="Settings"
      primaryAction={{
        content: 'Save',
        onAction: handleSave,
        loading: editing
      }}
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <LegacyCard sectioned>
            <BlockStack align="center" inlineAlign="center">
              <NotificationPopup
                firstName="John Doe"
                city="New York"
                country="United States"
                productName="Puffer Jacket With Hidden Hood"
                timestamp={hideTimeAgo ? '' : 'a day ago'}
                truncateContent={truncateContent}
                displayCloseBtn={false}
              />
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard>
            <LegacyTabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              <LegacyCard.Section>
                {selectedTab === 0 ? (
                  <DisplaySettings
                    position={position}
                    onPositionChange={setPosition}
                    hideTimeAgo={hideTimeAgo}
                    onHideTimeAgoChange={setHideTimeAgo}
                    truncateContent={truncateContent}
                    onTruncateContentChange={setTruncateContent}
                    displayDuration={displayDuration}
                    onDisplayDurationChange={setDisplayDuration}
                    firstPopDelay={firstPopDelay}
                    onFirstPopDelayChange={setFirstPopDelay}
                    gapTime={gapTime}
                    onGapTimeChange={setGapTime}
                    maxPopups={maxPopups}
                    onMaxPopupsChange={setMaxPopups}
                  />
                ) : (
                  <TriggersSettings
                    pageRestriction={pageRestriction}
                    onPageRestrictionChange={setPageRestriction}
                    specificPages={specificPages}
                    onSpecificPagesChange={setSpecificPages}
                    excludedPages={excludedPages}
                    onExcludedPagesChange={setExcludedPages}
                  />
                )}
              </LegacyCard.Section>
            </LegacyTabs>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
