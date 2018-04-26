// @flow

// the component in which user can enter payment address, validation on address, error and how the text input would expand on the basis of how much text user has typed
// and other things would be combined into a component which could be used as
// <ControlInput validation={this.throttledAsyncValidationFunction} name="payment address" label="To" />
// <ControlInput label="For" />
// if validation prop is not specified then validation will not be applied
// if validation prop is specified, then we would throttle the function calls and assumes that validation function is async
// we should also be canceling the previous validation function calls, because ordering in async results are not guaranteed
// we could use saga to throttle and cancel previous calls if a new call is made during the progress of previous call
// we could use throttle and takeLatest combined to make this happen
// This input control does not need to over designed whatever can satisfy our requirements for now
// when and if we would new features, we would add those later
