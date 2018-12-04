package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Created by ankurmishra on 6/22/17.
 */
public class ProofRequestPage {
	
	AppiumDriver driver;

	private static WebElement element = null;

	public static WebElement Send_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("(//XCUIElementTypeOther[@name='Send'])[3]"));
			System.out.println("Send Button is displayed on Proof Request screen");
			return element;
		} catch (Exception e) {

			System.out.println("Send Button is not displayed");
			throw (e);
		}
	}
	
	public static WebElement Continue_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("//XCUIElementTypeOther[@name='Continue']"));
			System.out.println("Continue Button is displayed on Proof Request screen");
			return element;
		} catch (Exception e) {

			System.out.println("Continue Button is not displayed");
			throw (e);
		}
	}

}
