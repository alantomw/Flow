# Chrome Extension Development Todo List

## Design Phase
- [x] Clarify user requirements for YouTube FYP blocking feature
- [x] Clarify user requirements for new tab blocking feature
- [x] Review UI reference image
- [x] Design extension file structure
- [x] Design manifest.json
- [x] Design popup UI with dark theme matching reference
- [x] Plan CSS styling for checkboxes and UI elements

## Implementation Phase
- [x] Create manifest.json
- [x] Implement popup HTML/CSS with dark theme
- [x] Create background script for extension functionality
- [x] Implement YouTube FYP blocking feature
  - [x] Create content script for YouTube pages
  - [x] Implement CSS to hide recommendations
  - [x] Implement CSS to hide channels/notifications
  - [x] Add toggle functionality
- [x] Implement new tab blocking feature
  - [x] Create event listeners for new tab creation
  - [x] Implement tab closing and return to previous tab
  - [x] Add exception for links opening in new tabs
  - [x] Add toggle functionality
- [x] Implement storage for saving user preferences

## Testing Phase
- [ ] Test YouTube FYP blocking on YouTube website
- [ ] Test new tab blocking functionality
- [ ] Verify toggle functionality for both features
- [ ] Test that links opening in new tabs are exempt from blocking

## Delivery Phase
- [ ] Package extension files
- [ ] Create installation instructions
- [ ] Deliver extension to user
