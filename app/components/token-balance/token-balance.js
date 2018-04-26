// @flow

// this component is used to show token balance wherever we need to show in app
// the reason why we are creating this as component are as follows:
// - We need to show zero balance, if there is no balance
// - we need to have same formatting applied
// - we would need to show available balance in other places such as credential offer or may be inside a pop up to tell user of current balance
// - if we don't make this as a component, then we would have to add redux store and use same selector to get token balance at every place where we need to show it
// We can take approaches to design this component
// 1. We can design this component to take props and change the aspects of it by passing different props. For example:
// -- on home screen, the size and color of token balance along with sovrin icon is different
// -- however, on token screen, color, size and icon are of different color
// we can use props to change these aspects
// 2. We can use children as render function and pass formatted amount value to children
// - whatever screen uses this component has to take care of the rendering text
//
// 1. <TokenBalance white h6 /> or <TokenBalance orange h2 onPress={this.doSomething} />
//     OR
// 2. <TokenBalance>{(amount) => <CustomText h5 onPress={this.doSomething}>{amount}</CustomText>}</TokenBalance>
//
// Preference would be second approach or we can really support both the APIs, we can check if children is passed and it is a function
// we use second approach otherwise we would go for first approach. Having this flexibility would free from lot of other choices that we would have to make
//
