
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

public class AuthRequestTest {

	public AppiumDriver driver;


	@BeforeMethod

	public void beforeMethod() throws Exception {
		

		DOMConfigurator.configure("log4j.xml");
    	Thread.sleep(10000);

		driver = Setup.ConfigureDriver("App");
		Log.startTestCase("Auth Request");
	}

	@org.testng.annotations.Test

	public void main() throws Exception {
    	
		
		System.out.println("check starbuck is displayed");
		Log.info("Validating Starbuck image is displayed or not");
		HomePage.Starbuck_Image(driver).isDisplayed();
		AppUtlis AppUtlisObj=new AppUtlis();
		String Identifier=AppUtlisObj.getIdentifier(driver);
    	String payload="{\"authRequesterName\":\"amit\"}";
		String requestUrl="https://agency-ea.evernym.com/agent/id/"+Identifier+"/auth";
		RestApi.sendPostRequest(requestUrl, payload, "POST");//check the response
		System.out.println("Notification is send on phone");
		AppUtlisObj.acceptRequest(driver);
		ConnectionDetailPage.Cross_Button(driver).click();


	}

	@AfterMethod
	public void afterMethod() {

		Log.endTestCase("Auth Request");
	    driver.removeApp("com.evernym.connectme.callcenter");
		System.out.println("Cleaning up Completed for Auth Request");
		driver.quit();

	}
}