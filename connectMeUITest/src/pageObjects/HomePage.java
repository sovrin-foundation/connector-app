package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import utility.Log;

/**
 * Created by ankurmishra on 6/22/17.
 */
public class HomePage {

	private static WebElement element = null;

	public static WebElement Setting_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("(//XCUIElementTypeOther[@name=' '])[2]/XCUIElementTypeOther[2]"));
			System.out.println("Allow Button is displayed");
			return element;
		} catch (Exception e) {

			Log.error("Allow Button is not found.");
			System.out.println("Allow Button not   is displayed");


			throw (e);
		}
	}

	public static WebElement Avatar_Photo(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("//XCUIElementTypeImage[@name='tab-active-avatar-icon']"));
			return element;
		} catch (Exception e) {

			Log.error("Avatar Photo is not found.");

			throw (e);
		}

	}

	public static WebElement AddConnection_Button(AppiumDriver driver) throws Exception {
		try {

			element = driver.findElement(By.xpath("//XCUIElementTypeImage[@name='tab-add-connection-icon']"));
			System.out.println("Add connection button is displayed");
			return element;

		} catch (Exception e) {
			Log.error("Add connection button  is not found.");
			System.out.println("Add connection button is not displayed");

			throw (e);

		}
	}


}
