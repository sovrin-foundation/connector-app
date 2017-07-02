CONTENTS OF THIS FILE
---------------------  
 * Introduction
 * Requirements
 * How to Run Tc
 
 INTRODUCTION
 ------------
 ConnectMeUITest is properitary UI Automation framework for Evernym ,its designed to cover almost 100 % UI Scenario
 
 
  REQUIREMENTS
  ------------
1.Eclipse//Optional <<one can run maven build comand from command line > 
2.Maven
3.Appium setup https://github.com/appium/appium/blob/master/docs/en/appium-setup/real-devices-ios.md
4.Appium server up and running

Note:this setup will be obsolete once we have our mobile lab setup done

  How to Run TC
  ------------
  Go to Src/utility/Setup.java
  
  Change Line no  31 to 33
  
  
  capabilities.setCapability("deviceName", "Ankur's iPhone");//device name of your device
  capabilities.setCapability("udid", "42d9657d87b56203d1c4c5eb22fde827ca2c0090");//udid of your device
  capabilities.setCapability("app","Users/ankurmishra/Downloads/ConnectMe-4.ipa");//ipa path of app in your system
  
  Run Maven build either from cmd or Eclipse
  
  /**
  Note:this setup will be obsolete once we have our mobile lab setup done
                                                                      **/


