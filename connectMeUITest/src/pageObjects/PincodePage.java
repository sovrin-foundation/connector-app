package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Created by ankurmishra on 6/22/17.
 */
public class PincodePage {

	private static WebElement element = null;
	public static WebElement PinCodeLock_TextBox(AppiumDriver driver,int i) throws Exception {

		try {
			element = driver.findElement(By.name("pin-code-digit-"+i+""));
			System.out.println("PinCodeLock_TextBox"+i+"is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("PinCodeLock_TextBox"+i+"is not displayed");
			throw (e);
		}
	}
		
	public static WebElement Close_Button(AppiumDriver driver) throws Exception {

			try {
				element = driver.findElement(By.name(("Close")));
				System.out.println("Close Button is displayed");
				return element;
			} catch (Exception e) {

				System.out.println(" Code Button is not displayed");
				throw (e);
			}
	}
	
	public static WebElement Message_PinCodeSetup(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.name(("Enter pin code to unlock app")));
			System.out.println("Message_PinCodeSetup is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("Message_PinCodeSetup is not displayed");
			throw (e);
		}
}







}
