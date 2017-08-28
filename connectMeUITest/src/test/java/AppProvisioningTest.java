
package test.java;

import io.appium.java_client.AppiumDriver;
import java.util.HashMap;
import org.apache.log4j.xml.DOMConfigurator;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.*;

import appModules.AppUtlis;
import appModules.RestApi;
import pageObjects.ConnectionDetailPage;
import pageObjects.HomePage;
import pageObjects.InvitationPage;
import utility.Setup;
import utility.*;

public class AppProvisioningTest {

	public AppiumDriver driver;


	@BeforeMethod

	public void beforeMethod() throws Exception {
		

		DOMConfigurator.configure("log4j.xml");
    	Thread.sleep(15000);
		driver = Setup.ConfigureDriver("App");
		Log.startTestCase("Provisioning Flow");
	}

	@org.testng.annotations.Test

	public void main() throws Exception {
    	

		AppUtlis AppUtlisObj=new AppUtlis();
		AppUtlisObj.acceptRequest(driver);
		driver.switchTo().alert().accept();
		ConnectionDetailPage.Continue_Button(driver).click();
		ConnectionDetailPage.Cross_Button(driver).click();

	}

	@AfterMethod
	public void afterMethod() {

		Log.endTestCase("Provisioning Flow");
		System.out.println("Cleaning up Completed for Provisioning flow");
		driver.quit();

	}
}