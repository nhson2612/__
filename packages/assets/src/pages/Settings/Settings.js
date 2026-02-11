import React, {useState, useEffect} from 'react';
import {Layout, Page, LegacyCard, BlockStack, LegacyTabs} from '@shopify/polaris';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import DisplaySettings from './DisplaySettings/DisplaySettings';
import TriggersSettings from './TriggersSettings/TriggersSettings';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import SettingsSkeleton from '@assets/components/SettingsSkeleton/SettingsSkeleton';
import styles from './style.module.css';

const defaultSettings = {
  position: 'bottom-left',
  hideTimeAgo: false,
  truncateContent: true,
  displayDuration: 5,
  firstPopDelay: 10,
  gapTime: 2,
  maxPopups: 20,
  pageRestriction: 'all',
  specificPages: '',
  excludedPages: ''
};

/**
 * Settings component for managing popup notification configuration.
 *
 * @return {JSX.Element} The Settings component with display and triggers tabs
 */
export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);
  const {data: settingsData, loading, fetchApi} = useFetchApi({url: '/settings'});
  const {editing, handleEdit} = useEditApi({url: '/settings'});
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (settingsData) {
      const {display, triggers} = settingsData;
      setSettings(prev => ({
        ...prev,
        ...display,
        ...triggers,
        specificPages: Array.isArray(triggers?.specificPages)
          ? triggers.specificPages.join('\n')
          : '',
        excludedPages: Array.isArray(triggers?.excludedPages)
          ? triggers.excludedPages.join('\n')
          : ''
      }));
    }
  }, [settingsData]);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTabChange = selectedTabIndex => setSelectedTab(selectedTabIndex);

  const handleSave = async () => {
    const payload = {
      display: {
        position: settings.position,
        hideTimeAgo: settings.hideTimeAgo,
        truncateContent: settings.truncateContent,
        displayDuration: settings.displayDuration,
        firstPopDelay: settings.firstPopDelay,
        gapTime: settings.gapTime,
        maxPopups: settings.maxPopups
      },
      triggers: {
        pageRestriction: settings.pageRestriction,
        specificPages: settings.specificPages.split('\n').filter(x => x.trim()),
        excludedPages: settings.excludedPages.split('\n').filter(x => x.trim())
      }
    };
    await handleEdit(payload);
    await fetchApi();
  };

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
    <div className={styles.settings}>
      <Page
        fullWidth
        title="Settings"
        subtitle="Decide how your notifications will display"
        primaryAction={{
          content: 'Save',
          onAction: handleSave,
          loading: editing
        }}
      >
        <Layout>
          <Layout.Section variant="oneThird">
            <BlockStack align="center" inlineAlign="center">
              <NotificationPopup
                firstName="John Doe"
                city="New York"
                country="United States"
                productName="Puffer Jacket With Hidden Hood"
                timestamp={settings.hideTimeAgo ? '' : 'a day ago'}
                truncateContent={settings.truncateContent}
                displayCloseBtn={true}
              />
            </BlockStack>
          </Layout.Section>

          <Layout.Section>
            <LegacyCard>
              <LegacyTabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                <LegacyCard.Section>
                  {selectedTab === 0 ? (
                    <DisplaySettings
                      position={settings.position}
                      onPositionChange={value => handleChange('position', value)}
                      hideTimeAgo={settings.hideTimeAgo}
                      onHideTimeAgoChange={value => handleChange('hideTimeAgo', value)}
                      truncateContent={settings.truncateContent}
                      onTruncateContentChange={value => handleChange('truncateContent', value)}
                      displayDuration={settings.displayDuration}
                      onDisplayDurationChange={value => handleChange('displayDuration', value)}
                      firstPopDelay={settings.firstPopDelay}
                      onFirstPopDelayChange={value => handleChange('firstPopDelay', value)}
                      gapTime={settings.gapTime}
                      onGapTimeChange={value => handleChange('gapTime', value)}
                      maxPopups={settings.maxPopups}
                      onMaxPopupsChange={value => handleChange('maxPopups', value)}
                    />
                  ) : (
                    <TriggersSettings
                      pageRestriction={settings.pageRestriction}
                      onPageRestrictionChange={value => handleChange('pageRestriction', value)}
                      specificPages={settings.specificPages}
                      onSpecificPagesChange={value => handleChange('specificPages', value)}
                      excludedPages={settings.excludedPages}
                      onExcludedPagesChange={value => handleChange('excludedPages', value)}
                    />
                  )}
                </LegacyCard.Section>
              </LegacyTabs>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

Settings.propTypes = {};
