# connect-me-indy-wrapper

ConnectMeIndy. High-level functions for libindy-objc.  
Pod uses source files from this repository. Podspecs are in Specs folder. 

## How to install

1. To your Podfile add:

```
source 'git@github.com:evernym/connect-me-indy-wrapper.git'
source 'git@github.com:hyperledger/indy-sdk.git'


pod 'ConnectMeIndy'
```

Don't place pod under `use_frameworks!`, it will lead to `pod install` error because of static libraries used in `libindy-objc` dependency. 

Two dependencies will be installed along with it:

- libindy-objc
- openssl-universal - for Base58 strings support.

2. In project settings set `Always Embed Swift Standart Libraries` to `YES`.

## How to use

All functions are performed by ConnectMeIndy singleton.
