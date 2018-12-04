package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Created by ankurmishra on 6/22/17.
 */
public class ChooseLockPage {
	
	AppiumDriver driver;

	private static WebElement element = null;

	public static WebElement PinCodeLock_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.name("pin-code-selection-touchable"));
			System.out.println("Pin Code Selection Button is displayed");
			return element;
		} catch (Exception e) {

			System.out.println(" Pin Code Selection Button is not displayed");
			throw (e);
		}
	}

}
