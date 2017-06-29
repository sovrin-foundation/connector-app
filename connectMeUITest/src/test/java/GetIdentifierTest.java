
package test.java;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MultiTouchAction;
import io.appium.java_client.TouchAction;

import java.util.HashMap;

import org.apache.log4j.xml.DOMConfigurator;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.testng.annotations.*;

import pageObjects.HomePage;
import utility.Setup;

import utility.*;

public class GetIdentifierTest {

	public AppiumDriver driver;

	@BeforeMethod

	public void beforeMethod() throws Exception {

		DOMConfigurator.configure("log4j.xml");
		driver = Setup.openApp("Real Device");
		Log.startTestCase("Allow Flow");
	}

	@org.testng.annotations.Test

	public void main() throws Exception {

		//System.out.println("Click the Allow Button");
		//HomePage.AllowAlert_Button(driver).click();
		//Log.info("Click action is performed on Allow button of Alert");
		System.out.println("check starbuck is displayed");
		Log.info("Validating Starbuck image is displayed or not");
		HomePage.Starbuck_Image(driver).isDisplayed();
		System.out.println("Scroll down");
		JavascriptExecutor js = (JavascriptExecutor) driver;
		HashMap<String, String> scrollObject = new HashMap<String, String>();
		scrollObject.put("direction", "down");
		js.executeScript("mobile: scroll", scrollObject);
		System.out.println("Scroll down sucessfull");
		HomePage.avatar_photo(driver).click();
		HomePage.avatar_photo(driver).click();
		HomePage.avatar_photo(driver).click();
		System.out.println("tapped three type on avatar photo");
		driver.switchTo().alert();
		System.out.println("Switched to alert");
		String Identifier = HomePage.Alert_Box(driver).getAttribute("name");
		System.out.println("Getting the Identifier");
		Identifier = Identifier.substring(13);
		System.out.println("Identifier"+" "+"for installed app is "+Identifier);

	}

	@AfterMethod
	public void afterMethod() {

		Log.endTestCase("AllowFlow");
		System.out.println("Cleaning up");
		driver.quit();

	}
}