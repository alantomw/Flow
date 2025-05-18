// Browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// YouTube FYP Blocker Content Script
(function() {
  // Check if the feature is enabled from storage
  let youtubeBlockerEnabled = false;
  
  // Function to apply or remove the blocking class
  function toggleYouTubeBlocking(enabled) {
    if (enabled) {
      document.documentElement.classList.add('ytd-fyp-blocker-enabled');
    } else {
      document.documentElement.classList.remove('ytd-fyp-blocker-enabled');
    }
  }
  
  // Initialize from storage
  browserAPI.storage.sync.get(['youtubeBlockerEnabled'], function(result) {
    youtubeBlockerEnabled = result.youtubeBlockerEnabled === true;
    toggleYouTubeBlocking(youtubeBlockerEnabled);
  });
  
  // Listen for changes to the setting
  browserAPI.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.youtubeBlockerEnabled) {
      youtubeBlockerEnabled = changes.youtubeBlockerEnabled.newValue;
      toggleYouTubeBlocking(youtubeBlockerEnabled);
    }
  });
})();
