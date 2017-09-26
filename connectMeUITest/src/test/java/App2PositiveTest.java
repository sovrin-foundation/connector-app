
package test.java;

import io.appium.java_client.AppiumDriver;
import org.testng.annotations.*;
import appModules.AppUtlis;
import funcModules.ConnectionModules;
import funcModules.LockModules;
import pageObjects.ChooseLockPage;
import pageObjects.HomePage;
import utility.*;
@Test
public class App2PositiveTest {

	public AppiumDriver driver;

    static String  ConnectMeLink;
	AppUtlis AppUtlisObj=new AppUtlis();
	LockModules LockModlesObj=new LockModules();
	ConnectionModules ConnectionModulesObj =new ConnectionModules();


	@BeforeClass //testng 
	public void BeforeClass() throws Exception {

    	Thread.sleep(20000);
		driver = Setup.ConfigureDriver("App");


	}

	
    @Test (groups = { "Smoke","Regression"})
    public void App1PincodeSetup() throws Exception {
		AppUtlisObj.CheckSkip();
		ChooseLockPage.PinCodeLock_Button(driver).click();
		LockModlesObj.PinCodeSetup(driver);
		AppUtlis.Success=true;		

	}
    @Test (groups = { "Smoke","Regression"})
	public void App2Provisioning() throws Exception {
		
		AppUtlisObj.CheckSkip();
		Thread.sleep(2000);
		ConnectionModulesObj.AppProvisioningRequest("Accept",driver);
		AppUtlis.Success=true;

	}
    @Test (groups = { "Smoke","Regression"})
	public void App3AuthRequestTest() throws Exception {
	
		AppUtlisObj.CheckSkip();
		ConnectionModulesObj.AuthRequest(driver,"");
		AppUtlis.Success=true;
		
	}
    @Test (groups = { "Smoke","Regression"})
	public void App4PincodeCheck() throws Exception {

		driver.quit();
		driver = Setup.ConfigureDriver("App");
	    AppUtlisObj.enterPincode(driver);
		HomePage.Avatar_Photo(driver);
		AppUtlis.Success=true;

	}
	
	
    @AfterClass
	public void afterClass() {
    	
		 driver.removeApp("com.evernym.connectme.callcenter");
		 driver.quit();
		 System.out.println("Cleaning up Completed");

	}
}