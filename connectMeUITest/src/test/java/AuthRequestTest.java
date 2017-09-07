
package test.java;

import io.appium.java_client.AppiumDriver;
import java.util.HashMap;
import org.apache.log4j.xml.DOMConfigurator;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.SessionId;
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

	@Test
	public void main() throws Exception {
    	
		AppUtlis AppUtlisObj=new AppUtlis();
		AppUtlisObj.enterPincode(driver);
		String PairwiseDID= AppUtlis.ResponseSendSms;
		System.out.println(PairwiseDID);
		PairwiseDID=PairwiseDID.substring(PairwiseDID.indexOf("PairwiseDID") + 15 , PairwiseDID.indexOf("PairwiseDID") + 37);
    	String payload="{\"challenge\":\"{\\\"requesterName\\\":\\\"Ankur\\\"}\",\"signature\":\"5h8MR6AMCdU91ZU63gXU4UhdPPGuDGUBMHbg73u8MBoStE3Tt7PMxeEuD2RhRhp29JuS3d42e6kmGJ2yboWA4v9P\"}";
		String requestUrl="https://agency-ea-sandbox.evernym.com/agent/"+PairwiseDID+"/auth";
		System.out.println("Notification is send on phone");
		AppUtlisObj.acceptRequest(driver);
	    ConnectionDetailPage.Cross_Button(driver).click();


	}

	@AfterMethod
	public void afterMethod() {

		Log.endTestCase("Auth Request");
		driver.removeApp("com.evernym.connectme.callcenter");
		driver.quit();
		System.out.println("Cleaning up Completed for Auth Request");

	}
}