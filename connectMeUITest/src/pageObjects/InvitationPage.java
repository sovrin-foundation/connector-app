package pageObjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import io.appium.java_client.AppiumDriver;

public class InvitationPage {
	
	private static WebElement element = null;

	public static WebElement Allow_Button(AppiumDriver driver) throws Exception {

		try {
			element =  driver.findElementByXPath("(//XCUIElementTypeOther[@name='Allow'])[2]");
			System.out.println("Allow Button is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("Allow Button is not displayed");
			throw (e);
		}
	}

	public static WebElement Inviation_Text_Container(AppiumDriver driver) throws Exception {

		try {
			element =  driver.findElement(By.xpath("//XCUIElementTypeStaticText[@name='invitation-text-container-title']"));
			System.out.println("Inviation_Text_Container is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("Inviation_Text_Container is not displayed");
			throw (e);
		}
	}
	
	public static WebElement Deny_Button(AppiumDriver driver) throws Exception {

		try {
			element =  driver.findElementByXPath("(//XCUIElementTypeOther[@name='Deny'])[2]");
			System.out.println("Allow Button is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("Allow Button is not displayed");
			throw (e);
		}
	}

}
