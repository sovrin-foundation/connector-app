
package test.java;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MultiTouchAction;
import io.appium.java_client.TouchAction;

import java.util.HashMap;
import org.apache.log4j.xml.DOMConfigurator;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.*;

import appModules.AppUtlis;
import appModules.RestApi;
import pageObjects.ChooseLockPage;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.HomePage;
import pageObjects.PincodePage;
import utility.*;
@Test
public class AppPincodeSetupTest {

	public AppiumDriver driver;

    static String  ConnectMeLink;
	@BeforeMethod //testng 

	public void beforeMethod() throws Exception {

		DOMConfigurator.configure("log4j.xml");
    	Thread.sleep(15000);
		driver = Setup.ConfigureDriver("App");
		Log.startTestCase("Pincode Setup Flow");
	}

	@Test
	public void main() throws Exception {
		AppUtlis AppUtlisObj=new AppUtlis();
		ChooseLockPage.PinCodeLock_Button(driver).click();
		for(int j=0;j<2;j++)
		{
			AppUtlisObj.enterPincode(driver);
		}
		PincodePage.Close_Button(driver).click();
	}

	@AfterMethod
	public void afterMethod() {

		driver.quit();
		System.out.println("Cleaning up Completed");

	}
}