# Pull Request Template
## Reason for Pull Request

- [ ] Bug fix
- [ ] Feature/Change request

## Link for jira ticket
[CO-](http://evernym.atlassian.net/browse/CO-)

## In case of Bug

### Root cause

- Backend API change
- Requirement was not clear

## In case of Feature/Change request

### High level description of changes done

- Added a store to save user response for push notification and then use it while onboarding user. We can't start onboarding process until we get push notification token from user

## Tests written for Bug/Feature/Refactoring

- `<Please write test file/test name here>`

## Checklist

- [ ] I have created new screen, and I have checked the header of new screen on Android. I have also set the status bar color in app.js
- [ ] I have checked the back button functionality required for the screens in Android. I have added the routeNames that are need to be handled for the back button in app.js
- [ ] I have checked the back behaviour by swiping left or swiping down on screens and they behave as expected. Back behaviour of these screens has been approved by product team