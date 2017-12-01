 
package test.java;

import io.appium.java_client.AppiumDriver;
import org.testng.annotations.*;
import appModules.AppUtlis;
import appModules.ReadMail;
import funcModules.ConnectionModules;
import funcModules.LockModules;
import utility.*;
@Test
public class App2NegativeTest {

	public  AppiumDriver driver;
	public static String pairwiseDID;
	AppUtlis appUtlisObj=new AppUtlis();
	LockModules lockModlesObj=new LockModules();
	ConnectionModules connectionModulesObj =new ConnectionModules();


	@BeforeClass //testng 
	public void BeforeClass() throws Exception {
	   
		System.out.println(" Before class of second class");


	}
	
	
	  @Test (groups = {"Regression"})
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
	
	
    @Test (groups = {"Regression"})
	public void App1PinCodeInvalidSetup()throws Exception{
	    appUtlisObj.CheckSkip();
	    Thread.sleep(60000);
		driver = Setup.ConfigureDriver("App");
		lockModlesObj.InvalidPinCodeSetup(driver);
		AppUtlis.Success=true;		

	   }
    
    @Test (groups = {"Regression"})
	public void App2PinCodevalidSetup()throws Exception{
		
		appUtlisObj.CheckSkip();
		lockModlesObj.PinCodeSetup(driver);
		AppUtlis.Success=true;		
	
	   }
	

	
    @Test (groups = {"Regression"})
	public void App3ProvisoningDeny()throws Exception{
		
		appUtlisObj.CheckSkip();
		connectionModulesObj.AppProvisioningRequest("Deny",driver);
		AppUtlis.Success=true;		

		
	}
    
    
    @Test (groups = {"Regression"})
	public void App4EnterInvalidPincode()throws Exception{
    	driver.quit();
		driver = Setup.ConfigureDriver("App");
		appUtlisObj.enterPincodeReverse(driver);
		AppUtlis.Success=true;		

		
	}

    @AfterClass
	public void afterClass() {
		 driver.removeApp("com.evernym.connectme.callcenter");
		 driver.quit();
		 System.out.println("Cleaning up Completed");

	}
    
}