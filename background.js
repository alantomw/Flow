// Background script for handling new tab blocking and YouTube FYP blocking
let newTabBlockerEnabled = false;
let youtubeBlockerEnabled = false;

// Initialize settings from storage
chrome.storage.sync.get(['newTabBlockerEnabled', 'youtubeBlockerEnabled'], function(result) {
  newTabBlockerEnabled = result.newTabBlockerEnabled === true;
  youtubeBlockerEnabled = result.youtubeBlockerEnabled === true;
});

// Listen for changes to settings
chrome.storage.onChanged.addListener(function(changes, namespace) {
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
chrome.tabs.onActivated.addListener(function(activeInfo) {
  lastActiveTabId = activeInfo.tabId;
});

// Handle new tab creation
chrome.tabs.onCreated.addListener(function(tab) {
  // Only block if the feature is enabled
  if (!newTabBlockerEnabled) return;
  
  // Check if this is a blank new tab (not opened by a link)
  if (tab.pendingUrl === 'chrome://newtab/' || tab.url === 'chrome://newtab/') {
    // Close the new tab
    chrome.tabs.remove(tab.id);
    
    // Switch back to the last active tab if available
    if (lastActiveTabId !== null) {
      chrome.tabs.update(lastActiveTabId, { active: true });
    }
  }
});
