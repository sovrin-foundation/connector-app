
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
import appModules.RestApi;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.HomePage;
import utility.Setup;
import utility.*;

public class AppInstallTest {

	public AppiumDriver driver;


	@BeforeMethod

	public void beforeMethod() throws Exception {

		DOMConfigurator.configure("log4j.xml");
		driver = Setup.ConfigureDriver("Safari");
		Log.startTestCase("Install ConnectMe App");
	}

	@org.testng.annotations.Test

	public void main() throws Exception {
		
		String payload="{\"name\":\"Ankur Mishra\"}";
		String requestUrl="https://agency-ea.evernym.com/agent/phone/8327364896/connection-offer";
		String requestType="PUT";
		RestApi.sendPostRequest(requestUrl, payload,requestType);//check response for API COMMENT BY Rajesh
		driver.get("https://gmail.com");
		GmailPage.UserNameText(driver).sendKeys("evernym.number@gmail.com");
		GmailPage.UserNameNextButton(driver).click();
		GmailPage.PasswordText(driver).sendKeys("evernym123");
		GmailPage.PasswordNextButton(driver).click();
    	Thread.sleep(20000);//used sleep which is not recommended as we have issue with synch of gmail opening 
    	GmailPage.MobileGmailSiteLink(driver).click();
    	GmailPage.FirstEmailLink(driver).click();
    	String ConnectMeLink =GmailPage.ConnectMeLink(driver).getAttribute("href");
		System.out.println(ConnectMeLink);
		driver.get(ConnectMeLink);
		HockeyAppPage.UserNameText(driver).sendKeys("ankur.mishra@evernym.com");
		HockeyAppPage.PasswordText(driver).sendKeys("Password12$");
		HockeyAppPage.SigninButton(driver).click();    	
     	HockeyAppPage.QAConnectIcon(driver).click();  	
    	String InstallConnectMeLink =HockeyAppPage.InstallButton(driver).getAttribute("href");
		System.out.println();
    	driver.get(InstallConnectMeLink);
    	Thread.sleep(5000);//used sleep which is not recommended as we have issue with synch of alert box
    	driver.switchTo().alert().accept();


	}

	@AfterMethod
	public void afterMethod() {

		Log.endTestCase("Install ConnectMe App");
		System.out.println("Cleaning up Completed");
		driver.quit();

	}
}