package pageObjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import io.appium.java_client.AppiumDriver;

public class ConnectionDetailPage {
	
	private static WebElement element = null;

	public static WebElement Cross_Button(AppiumDriver driver) throws Exception {

		try {
			element =   driver.findElementByXPath("//XCUIElementTypeOther[@name='connection-header-close']");
			System.out.println("Cross Button is displayed");
			return element;
		} catch (Exception e) {
			System.out.println("Cross Button is not displayed");
			throw (e);
		}
	}

	public static WebElement Continue_Button(AppiumDriver driver) throws Exception {

		try {
			element =   driver.findElementByXPath("//XCUIElementTypeOther[@name='Continue']");
			System.out.println("Continue Button is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("Continue Button is not displayed");
			throw (e);
		}
	}

	
	

}
