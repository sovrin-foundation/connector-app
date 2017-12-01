package utility;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.URL;
import java.util.concurrent.TimeUnit;

/**
 * Created by ankurmishra on 6/22/17.
 */

public class Setup {

	public static AppiumDriver driver = null;

	public static AppiumDriver ConfigureDriver(String DeviceType) throws Exception {


		try {

			DesiredCapabilities capabilities = new DesiredCapabilities();

			if (DeviceType == "App") {
				capabilities.setCapability("automationName", "XCUITest");
				capabilities.setCapability("platformVersion", "10.3");
				capabilities.setCapability("platformName", "iOS");
				capabilities.setCapability("useNewWDA", "true");
				capabilities.setCapability("bundleId", "com.evernym.connectme.callcenter");
				capabilities.setCapability("deviceName", "Ankur's iPhone");//device name
				capabilities.setCapability("udid", "42d9657d87b56203d1c4c5eb22fde827ca2c0090");//udid of device
				capabilities.setCapability("xcodeOrgId", "ES8QU3D2A4");
				capabilities.setCapability("xcodeSigningId", "iPhone Developer");
				driver = new IOSDriver(new URL("http://183.82.106.249:4723/wd/hub"), capabilities);
				/*driver = new IOSDriver(new URL("http://127.0.0.1:4723/wd/hub"),//if some one wants to run locally
			                capabilities);	/*
			                			
			 * We initialize the Appium driver that will connect us to the ios
			 * device with the capabilities that we have just set. The URL we
			 * are providing is telling Appium we
			 * http://183.82.106.249:4723/wd/hub
			 * 
			 * are going to run the test on Real ios Device lets say iphone 6s.
			 */

			driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
			// Setting DefauLt time out to 60 seconds
			System.out.println("Mobile application launched successfully");


		}
			else
			{
				capabilities.setCapability("platformVersion", "10.3");
				capabilities.setCapability("platformName", "iOS");
				capabilities.setCapability("useNewWDA", "true");
				capabilities.setCapability("deviceName", "Ankur's iPhone");//device name
				capabilities.setCapability("udid", "42d9657d87b56203d1c4c5eb22fde827ca2c0090");//udid of device
				capabilities.setCapability("browserName", "Safari");
				driver = new IOSDriver(new URL("http://183.82.106.249:4723/wd/hub"), capabilities);
             	/*driver = new IOSDriver(new URL("http://127.0.0.1:4723/wd/hub"),
			                capabilities);	/*for local test
			 * We initialize the Appium driver that will connect us to the ios
			 * device with the capabilities that we have just set. The URL we
			 * are providing is telling Appium we
			 * http://183.82.106.249:4723/wd/hub
			 * 
			 * are going to run the test on Real ios Device lets say iphone 6s.
			 */

			driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
			// Setting DefauLt time out to 60 seconds
			System.out.println("Safari browser launched successfully");

				
				
			}
		}	

		catch (Exception e)

		{

			System.out.println("Class Setup | Method OpenBrowser | Exception desc : " + e.getMessage());

		}

		return driver;

	}

}
