package pageObjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import io.appium.java_client.AppiumDriver;
import utility.Log;

public class ConnectionDetailPage {
	
	private static WebElement element = null;

	public static WebElement Cross_Button(AppiumDriver driver) throws Exception {

		try {
			element =   driver.findElementByXPath("//XCUIElementTypeOther[@name='connection-header-close']");
			System.out.println("Cross Button is displayed");
			return element;
		} catch (Exception e) {

			Log.error("Cross Button is not found.");
			System.out.println("Cross Button is not displayed");
			throw (e);
		}
	}


}
