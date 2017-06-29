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

	public static WebElement AllowAlert_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.id("Allow"));
			System.out.println("Allow Button is displayed");
			return element;
		} catch (Exception e) {

			Log.error("Allow Button is not found.");
			System.out.println("Allow Button not   is displayed");


			throw (e);
		}
	}

	public static WebElement avatar_photo(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("(//XCUIElementTypeOther[@name=" + " 76" + "])[3]/XCUIElementTypeImage"));
			return element;
		} catch (Exception e) {

			Log.error("Avatar Photo is not found.");

			throw (e);
		}

	}

	public static WebElement Starbuck_Image(AppiumDriver driver) throws Exception {
		try {

			element = driver.findElement(By.name("assets/app/images/cbStarbucks@2x.png"));
			System.out.println("starbuck Image is displayed");
			return element;

		} catch (Exception e) {
			Log.error("Starbuck Image  is not found.");
			System.out.println("starbuck Image is not displayed");

			throw (e);

		}
	}

	public static WebElement Alert_Box(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("//XCUIElementTypeAlert"));
			System.out.println("Alert is displayed");

			return element;
		    } catch (Exception e) {

			Log.error("Alert is not found.");
			System.out.println("Alert is not displayed");

			throw (e);
		}

	}

}
