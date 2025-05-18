// Browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Background script for handling new tab blocking and YouTube FYP blocking
let newTabBlockerEnabled = false;
let youtubeBlockerEnabled = false;

// Initialize settings from storage
browserAPI.storage.sync.get(['newTabBlockerEnabled', 'youtubeBlockerEnabled'], function(result) {
  newTabBlockerEnabled = result.newTabBlockerEnabled === true;
  youtubeBlockerEnabled = result.youtubeBlockerEnabled === true;
});

// Listen for changes to settings
browserAPI.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.newTabBlockerEnabled) {
    newTabBlockerEnabled = changes.newTabBlockerEnabled.newValue;
  }
  if (changes.youtubeBlockerEnabled) {
    youtubeBlockerEnabled = changes.youtubeBlockerEnabled.newValue;
  }
});

// Track the last active tab
let lastActiveTabId = null;

// Update the last active tab when tabs change
browserAPI.tabs.onActivated.addListener(function(activeInfo) {
  lastActiveTabId = activeInfo.tabId;
});

// Handle new tab creation
browserAPI.tabs.onCreated.addListener(async function(tab) {
  // Only block if the feature is enabled
  if (!newTabBlockerEnabled) return;

  // Check if this is a new tab or about:blank
  const newTabUrls = [
    'chrome://newtab/',
    'edge://newtab/',
    'brave://newtab/',
    'opera://newtab/',
    'vivaldi://newtab/',
    'arc://newtab/',
    'about:blank'
  ];

  // Immediately close the tab if it matches any new tab URL
  if (newTabUrls.includes(tab.pendingUrl) || newTabUrls.includes(tab.url)) {
    try {
      // First switch back to the last active tab
      if (lastActiveTabId !== null) {
        await browserAPI.tabs.update(lastActiveTabId, { active: true });
      }
      
      // Then close the new tab
      await browserAPI.tabs.remove(tab.id);
    } catch (error) {
      // Ignore errors if tab was already closed
      console.error('Error handling tab:', error);
    }
  }
});
