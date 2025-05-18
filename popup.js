// Popup script to handle UI interactions and settings
document.addEventListener('DOMContentLoaded', function() {
  const youtubeBlockerCheckbox = document.getElementById('youtube-blocker');
  const newTabBlockerCheckbox = document.getElementById('new-tab-blocker');
  
  // Load saved settings
  chrome.storage.sync.get(['youtubeBlockerEnabled', 'newTabBlockerEnabled'], function(result) {
    youtubeBlockerCheckbox.checked = result.youtubeBlockerEnabled === true;
    newTabBlockerCheckbox.checked = result.newTabBlockerEnabled === true;
  });
  
  // Save settings when checkboxes are toggled
  youtubeBlockerCheckbox.addEventListener('change', function() {
    chrome.storage.sync.set({ youtubeBlockerEnabled: this.checked });
  });
  
  newTabBlockerCheckbox.addEventListener('change', function() {
    chrome.storage.sync.set({ newTabBlockerEnabled: this.checked });
  });
});
