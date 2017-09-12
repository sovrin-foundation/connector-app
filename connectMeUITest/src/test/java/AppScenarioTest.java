
package test.java;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MultiTouchAction;
import io.appium.java_client.TouchAction;

import java.util.HashMap;
import org.apache.log4j.xml.DOMConfigurator;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Actions;
import org.testng.SkipException;
import org.testng.annotations.*;

import appModules.AppUtlis;
import appModules.RestApi;
import pageObjects.ChooseLockPage;
import pageObjects.ConnectionDetailPage;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.HomePage;
import pageObjects.PincodePage;
import utility.*;
@Test
public class AppScenarioTest {

	public AppiumDriver driver;

    static String  ConnectMeLink;
	AppUtlis AppUtlisObj=new AppUtlis();

	@BeforeClass //testng 
	public void BeforeClass() throws Exception {

    	Thread.sleep(10000);
		driver = Setup.ConfigureDriver("App");

	}

	@Test
	public void AppPincodeSetup() throws Exception {

		AppUtlisObj.CheckSkip();
		ChooseLockPage.PinCodeLock_Button(driver).click();
		for(int j=0;j<2;j++)
		{
			AppUtlisObj.enterPincode(driver);
		}
		PincodePage.Close_Button(driver).click();
		AppUtlis.Success=true;

	}
	@Test
	public void AppProvisioning() throws Exception {
    	
		AppUtlisObj.CheckSkip();
		AppUtlis.Success=false;
		AppUtlisObj.acceptRequest(driver);
		driver.switchTo().alert().accept();
		ConnectionDetailPage.Continue_Button(driver).click();
		AppUtlis.Success=true;

	}
	@Test
	public void AuthRequestTest() throws Exception {

		AppUtlisObj.CheckSkip();
		String PairwiseDID= AppUtlis.ResponseSendSms;
		PairwiseDID=PairwiseDID.substring(PairwiseDID.indexOf("pairwiseDID") + 14 , PairwiseDID.indexOf("pairwiseDID") + 36);
		System.out.println(PairwiseDID);
		String payload="{\"challenge\":\"{\\\"requesterName\\\":\\\"Ankur\\\"}\",\"signature\":\"59GtUGNsPcDpzYz2Hh4M3VcZWMzuDGXivdZq6SiTQaqetxVRgw58szohZiAMDcmGS8PJcjPqywDq4tE2tZt1dZ7f\"}";
		String requestUrl="https://agency-ea.evernym.com/agent/"+PairwiseDID+"/auth";
		String requestType="POST";
		RestApi RestApiObj=new RestApi();
		RestApiObj.sendPostRequest(requestUrl, payload,requestType);	
		System.out.println("Notification is send on phone");
		AppUtlisObj.acceptRequest(driver);
	    ConnectionDetailPage.Cross_Button(driver).click();
		AppUtlis.Success=true;

	}

	
@AfterClass
	public void afterClass() {
		 driver.removeApp("com.evernym.connectme.callcenter");
		 driver.quit();
		 System.out.println("Cleaning up Completed");

	}
}