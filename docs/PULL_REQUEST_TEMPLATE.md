## Reason for Pull Request

- [ ] Bug fix
- [ ] Feature/Change request
- [ ] Refactoring

## Link for jira ticket
[CO-](http://evernym.atlassian.net/browse/CO-)

### Is this PR to move code to stage

- [ ] I have checked that default url in config store is pointing to DEMO
- [ ] I have checked that api resources are using base urls from config and are not hard coded

### Is this PR to move code to stable

- [ ] I have checked that default url in config store is pointing to PRODUCTION
- [ ] I have checked that api resources are using base urls from config and are not hard coded

## In case of Bug

### Root cause

- Backend API change
- Requirement was not clear

## In case of Feature/Change request

### High level description of changes done

- Added a store to save user response for push notification and then use it while onboarding user. We can't start onboarding process until we get push notification token from user

## Tests written for Bug/Feature/Refactoring

- `__tests__/index.ios.spec.js` -> `testName` or `describe` or `it` description

## Checklist

- [ ] I went through my PR once by myself and contain no unnecessary changes
