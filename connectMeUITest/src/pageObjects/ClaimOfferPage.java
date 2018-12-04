package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Created by ankurmishra on 6/22/17.
 */
public class ClaimOfferPage {
	
	AppiumDriver driver;

	private static WebElement element = null;

	public static WebElement Accept_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("(//XCUIElementTypeOther[@name='Accept'])[3]"));
			System.out.println("Accept Button is displayed on CLAIM OFFER screen");
			return element;
		} catch (Exception e) {

			System.out.println("ACCEPT Button is not displayed");
			throw (e);
		}
	}
	
	public static WebElement Continue_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("//XCUIElementTypeOther[@name='Continue']"));
			System.out.println("Continue Button is displayed on CLAIM OFFER screen");
			return element;
		} catch (Exception e) {

			System.out.println("Continue Button is not displayed");
			throw (e);
		}
	}

}
