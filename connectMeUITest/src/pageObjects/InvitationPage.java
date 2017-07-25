package pageObjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import io.appium.java_client.AppiumDriver;
import utility.Log;

public class InvitationPage {
	
	private static WebElement element = null;

	public static WebElement Allow_Button(AppiumDriver driver) throws Exception {

		try {
			element =  driver.findElementByXPath("(//XCUIElementTypeOther[@name='Allow'])[2]");
			System.out.println("Allow Button is displayed");
			return element;
		} catch (Exception e) {

			Log.error("Allow Button is not found.");
			System.out.println("Allow Button is not displayed");


			throw (e);
		}
	}

	public static WebElement Inviation_Text_Container(AppiumDriver driver) throws Exception {

		try {
			element =  driver.findElement(By.xpath("//*[@name='invitation-text-container-title']"));
			System.out.println("Inviation_Text_Container is displayed");
			return element;
		} catch (Exception e) {

			Log.error("Allow Button is not found.");
			System.out.println("Inviation_Text_Container is not displayed");


			throw (e);
		}
	}

}
