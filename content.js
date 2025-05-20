// Configuration
let settings = {
  blockNewTabs: true,
  hideRecommendations: true
};

// Load settings from storage
chrome.storage.sync.get(['blockNewTabs', 'hideRecommendations'], (result) => {
  settings = {
    blockNewTabs: result.blockNewTabs ?? true,
    hideRecommendations: result.hideRecommendations ?? true
  };
  applySettings();
});

// Listen for setting changes from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateBlockNewTabs') {
    settings.blockNewTabs = message.value;
  } else if (message.action === 'updateHideRecommendations') {
    settings.hideRecommendations = message.value;
    applySettings();
  }
});

// Function to apply current settings
function applySettings() {
  if (settings.hideRecommendations) {
    hideRecommendations();
    expandVideoPlayer();
  } else {
    showRecommendations();
  }
}

// Function to hide recommendations
function hideRecommendations() {
  const selectors = [
    'ytd-rich-section-renderer',
    'ytd-reel-shelf-renderer',
    'ytd-horizontal-card-list-renderer',
    'ytd-shelf-renderer'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.closest('ytd-two-column-browse-results-renderer')) {
        element.style.display = 'none';
      }
    });
  });
}

// Function to show recommendations
function showRecommendations() {
  const selectors = [
    'ytd-rich-section-renderer',
    'ytd-reel-shelf-renderer',
    'ytd-horizontal-card-list-renderer',
    'ytd-shelf-renderer'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.closest('ytd-two-column-browse-results-renderer')) {
        element.style.display = '';
      }
    });
  });
}

// Intercept link clicks to prevent new tabs
document.addEventListener('click', (e) => {
  if (!settings.blockNewTabs) return;

  const link = e.target.closest('a');
  if (link && link.href?.includes('youtube.com')) {
    // Prevent middle-click and ctrl+click
    if (e.button === 1 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      window.location.href = link.href;
    }
  }
});

// Intercept window.open calls
const originalWindowOpen = window.open;
window.open = function(url, ...args) {
  if (settings.blockNewTabs && url?.includes('youtube.com')) {
    window.location.href = url;
    return null;
  }
  return originalWindowOpen.call(this, url, ...args);
};

// Create a MutationObserver to watch for dynamically added content
const observer = new MutationObserver((mutations) => {
  if (settings.hideRecommendations) {
    hideRecommendations();
    expandVideoPlayer();
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
});

function ensureBlockerClass() {
  document.documentElement.classList.add('ytd-fyp-blocker-enabled');
}

function onYouTubeNavigation() {
  ensureBlockerClass();
  applySettings();
  expandVideoPlayer();
}

// Function to expand the video player and hide the sidebar
function expandVideoPlayer() {
  // Primary video container
  const primary = document.querySelector('ytd-watch-flexy #primary');
  if (primary) {
    primary.style.setProperty('max-width', '100%', 'important');
    primary.style.setProperty('width', '100%', 'important');
    primary.style.setProperty('flex', '1 1 100%', 'important');
    primary.style.setProperty('margin-right', '0px', 'important');
  }
  // Hide secondary (sidebar)
  const secondary = document.querySelector('ytd-watch-flexy #secondary');
  if (secondary) {
    secondary.style.setProperty('display', 'none', 'important');
  }
  // Flex parent
  const columns = document.querySelector('ytd-watch-flexy[flex-layout] #columns');
  if (columns) {
    columns.style.setProperty('display', 'flex', 'important');
    columns.style.setProperty('flex-direction', 'row', 'important');
    columns.style.setProperty('align-items', 'stretch', 'important');
  }

  // Ensure masthead container is full width and correctly positioned
  const mastheadContainer = document.getElementById('masthead-container');
  if (mastheadContainer) {
    mastheadContainer.style.setProperty('position', 'sticky', 'important');
    mastheadContainer.style.setProperty('left', '0px', 'important');
    mastheadContainer.style.setProperty('width', '100%', 'important');
    mastheadContainer.style.setProperty('margin-left', '0px', 'important');
    mastheadContainer.style.setProperty('padding-left', '0px', 'important');
    mastheadContainer.style.setProperty('padding-right', '0px', 'important'); // Make container edge-to-edge
    mastheadContainer.style.setProperty('box-sizing', 'border-box', 'important');
  }

  // Ensure the masthead itself and its inner container are set up for flexible content
  const masthead = document.querySelector('ytd-masthead');
  if (masthead) {
    masthead.style.setProperty('width', '100%', 'important'); // Ensure ytd-masthead itself is full width
    masthead.style.setProperty('box-sizing', 'border-box', 'important');

    const mastheadInnerContainer = masthead.querySelector('#container'); // This is ytd-masthead > div#container
    if (mastheadInnerContainer) {
        mastheadInnerContainer.style.setProperty('display', 'flex', 'important');
        mastheadInnerContainer.style.setProperty('align-items', 'center', 'important');
        mastheadInnerContainer.style.setProperty('width', '100%', 'important');
        // Apply padding here for the content, as mastheadContainer is now edge-to-edge
        mastheadInnerContainer.style.setProperty('padding', '0 24px', 'important');
        mastheadInnerContainer.style.setProperty('box-sizing', 'border-box', 'important');
    }

    const startElement = masthead.querySelector('#container > #start');
    const centerElement = masthead.querySelector('#container > #center');
    const endElement = masthead.querySelector('#container > #end');

    if (startElement) {
        startElement.style.setProperty('flex', '0 0 auto', 'important'); // Don't grow or shrink
    }

    if (centerElement) {
      // Make flex-basis 0% to be more aggressive in growing, allow shrinking.
      centerElement.style.setProperty('flex', '1 1 0%', 'important');
      // Increase min-width for better usability of search bar.
      centerElement.style.setProperty('min-width', '250px', 'important');
      centerElement.style.setProperty('margin', '0 24px', 'important'); // Keep existing margin for spacing

      const searchbox = centerElement.querySelector('ytd-searchbox');
      if (searchbox) {
          // Ensure the searchbox itself tries to fill the centerElement.
          searchbox.style.setProperty('width', '100%', 'important');
          // Ensure ytd-searchbox behaves as a flex container for its internal elements
          searchbox.style.setProperty('display', 'flex', 'important');
          searchbox.style.setProperty('flex', '1 1 auto', 'important'); // Allow it to grow within its own flex context
      }
    }

    if (endElement) {
        endElement.style.setProperty('flex', '0 0 auto', 'important'); // Don't grow or shrink
    }
  }
}

// Initial run
ensureBlockerClass();
expandVideoPlayer();

// Listen for YouTube SPA navigation events to re-apply settings
window.addEventListener('yt-navigate-finish', onYouTubeNavigation);
window.addEventListener('yt-page-data-updated', onYouTubeNavigation);