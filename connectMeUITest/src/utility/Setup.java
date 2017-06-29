package utility;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.URL;
import java.util.concurrent.TimeUnit;

/**
 * Created by ankurmishra on 6/22/17.
 */

public class Setup {

	public static AppiumDriver driver = null;

	public static AppiumDriver openApp(String Device) throws Exception {

		String sBrowserName;

		try {

			DesiredCapabilities capabilities = new DesiredCapabilities();

			if (Device == "Real Device") {
				capabilities.setCapability("deviceName", "Ankur's iPhone");
				capabilities.setCapability("automationName", "XCUITest");
				capabilities.setCapability("platformVersion", "10.0");
				capabilities.setCapability("platformName", "iOS");
				capabilities.setCapability("bundleId", "com.evernym.connectme.callcenter");
				capabilities.setCapability("udid", "42d9657d87b56203d1c4c5eb22fde827ca2c0090");
				// capabilities.setCapability("udid",
				// "b78a49129d22c79c81e303b812d14abaa6fc817d");
				capabilities.setCapability("xcodeOrgId", "ES8QU3D2A4");
				capabilities.setCapability("xcodeSigningId", "iPhone Developer");
				capabilities.setCapability("autoAcceptAlerts", true);
				// capabilities.setCapability("app",
				// "Users/ankurmishra/Downloads/ConnectMe-2.ipa");//ipath
				driver = new IOSDriver(new URL("http://127.0.0.1:4723/wd/hub"), capabilities);
				// capabilities.setCapability("fullReset","true");
				// capabilities.setCapability("noReset","false");
			} else {
				capabilities.setCapability("testobject_device", "iPhone_5_16GB_real");
				capabilities.setCapability("testobject_api_key", "C4B377A5412C477DA2E5649E12B82397");
				driver = new IOSDriver(new URL("https://eu1.appium.testobject.com/wd/hub"), capabilities);
			}

			/*
			 * We initialize the Appium driver that will connect us to the ios
			 * device with the capabilities that we have just set. The URL we
			 * are providing is telling Appium we
			 * https://eu1.appium.testobject.com/wd/hub
			 * 
			 * are going to run the test on Real ios Device lets say iphone 6s.
			 */

			driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
			// Setting DefauLt time out to 60 seconds
			Log.info("Mobile application launched successfully");

		}

		catch (Exception e)

		{

			Log.error("Class Setup | Method OpenBrowser | Exception desc : " + e.getMessage());

		}

		return driver;

	}

}
