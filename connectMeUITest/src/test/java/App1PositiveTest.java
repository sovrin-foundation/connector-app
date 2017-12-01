
package test.java;

import io.appium.java_client.AppiumDriver;
import pageObjects.ChooseLockPage;
import pageObjects.ClaimOfferPage;

import org.testng.annotations.*;
import appModules.AppUtlis;
import appModules.ReadMail;
import appModules.RestApi;
import funcModules.AuthRequestModules;
import funcModules.ClaimOfferModules;
import funcModules.ConnectionModules;
import funcModules.LockModules;
import utility.Setup;

public class App1PositiveTest {
	
	AppiumDriver driver;
	public static String pairwiseDID;
	static boolean Success=false;
	AppUtlis appUtlisObj=new AppUtlis();
	LockModules lockModlesObj=new LockModules();
	ConnectionModules connectionModulesObj =new ConnectionModules();
	
	     @BeforeClass
         public void BeforeClass() throws Exception {
	     System.out.println(" Before class of first class");


	}


    @Test (groups = { "Smoke","Regression"})
	public void App0Install() throws Exception {
    	pairwiseDID= appUtlisObj.sendSmsRestApi();
    	Thread.sleep(30000);
    	String InstallConnectMeLink =ReadMail.GetInstallLInk();
    	Thread.sleep(3000);
    	driver = Setup.ConfigureDriver("Safari");
     	connectionModulesObj.InstallApp(driver,InstallConnectMeLink);
		driver.quit();
        AppUtlis.Success=true;
        

    }
    
    @Test (groups = { "Smoke","Regression"})
    public void App1PincodeSetup() throws Exception {
    	
      	Thread.sleep(60000);
		driver = Setup.ConfigureDriver("App");
		System.out.println("pin setup tc");
		ChooseLockPage.PinCodeLock_Button(driver).click();
		lockModlesObj.PinCodeSetup(driver);
		AppUtlis.Success=true;		

	}
    @Test(enabled = true,groups = { "Smoke","Regression"})
	public void App2Provisioning() throws Exception {

		appUtlisObj.CheckSkip();
		Thread.sleep(2000);
		connectionModulesObj.AppProvisioningRequest("Accept",driver);
		AppUtlis.Success=true;

	}

    
    @Test (enabled = true,groups = { "Smoke","Regression"})
   	public void App4ClaimOfferTest() throws Exception {
        
    	appUtlisObj.sendClaimofferRestApi(pairwiseDID);
    	ClaimOfferPage.Accept_Button(driver).click();
   		appUtlisObj.CheckSkip();
   		AppUtlis.Success=true;
   		
   	}
    
    @Test (enabled = true,groups = { "Smoke","Regression"})
   	public void App5ClaimTest() throws Exception {
       
    	Thread.sleep(5000);
    	appUtlisObj.sendClaimRestApi(pairwiseDID);
    	ClaimOfferPage.Continue_Button(driver).click();
   		appUtlisObj.CheckSkip();
   		AppUtlis.Success=true;
   		
   	}
    @Test (groups = { "Smoke","Regression"})
	public void App5PincodeCheck() throws Exception {

		driver.quit();
		driver = Setup.ConfigureDriver("App");
	    appUtlisObj.enterPincode(driver);
		AppUtlis.Success=true;

	}

	@AfterClass
	public void AfterClass() {
		
		driver.removeApp("com.evernym.connectme.callcenter");
		driver.quit();
		System.out.println("Cleaning up Completed");

	}
}