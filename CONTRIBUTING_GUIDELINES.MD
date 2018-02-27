## Steps to contribute
- Create branch for each feature
- Follow TDD for each component/store
- Use flow to define types
- DO NOT use `npm` to install packages, not even `npm 5`. Always use `yarn` to install dependencies
- Tests are run by default when you try to push. If tests fail then code will not be pushed, not even to local branch.
- Push will fail even if there are any lint errors
- Raise pull request to merge any change to master
- Fill Pull request template properly while raising the PR

## Process
- PR template is made for submitting PR
- PR is `squashed and merged`
- Tests are run before each push
- Files are automatically formatted by prettier before committing
- Hooks for pre-commit and pre-push are in `package.json`


### How to test screens without any external dependency

#### Create connection without generating build and clicking deep link

- Go to config store and find line with something like this `...baseUrls[SERVER_ENVIRONMENT.STAGING]`. Change `STAGING` with `DEVELOPMENT` or `SANDBOX`.
- In deep-link/index.js. Find method `onDeepLinkData` and add this line at the start of method
```js
this.props.deepLinkData('6a3e8fd0')
```
The string that we have passed inside `deepLinkData` comes from email. Contact other developers for email account access.

#### Proof request screen

Add these lines to import statement
```js
// TODO Remove these lines after testing is done
import { proofRequest, proofRequestId } from '../../__mocks__/static-data'
import { proofRequestRoute } from '../common/route-constants'
import { proofRequestReceived } from '../proof-request/proof-request-store'
```

Add this method to Home screen component
```js

  // TODO Remove this whole function, this is for testing purpose
  componentDidMount() {
    // $FlowFixMe
    this.props.proofRequestReceived(
      proofRequest.payload,
      proofRequest.payloadInfo
    )
    setTimeout(() => {
      this.props.navigation.navigate(proofRequestRoute, { uid: proofRequestId })
    }, 100)
  }
```

Bind methods to Home props
```js
// TODO: Remove this, Only for testing purpose
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      proofRequestReceived,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)
```

Go to `mapStateToProps` in proof-request.js and find logoUrl
```js
// TODO: Un-comment this line and remove line next to this line
// logoUrl: getConnectionLogoUrl(state, remotePairwiseDID),
logoUrl: 'https://image.flaticon.com/icons/png/128/174/174851.png',
```

In proof-store.js. Import static-data for proof
```js
// TODO Remove below import, only for testing
import { proofWith10Attributes } from '../../__mocks__/static-data'
```

Find the call to `generateProof` in `generateProofSaga`. Comment out the actual call to native bridge and use this instead
```js
// TODO Remove below line and un-comment above line, only for testing
const proofJson = JSON.stringify(proofWith10Attributes)
```

## How to know what tests to write

Check this small video https://drive.google.com/open?id=1t83ZTe4RdgozuIRs6Pi140fU7cIp-8wx
