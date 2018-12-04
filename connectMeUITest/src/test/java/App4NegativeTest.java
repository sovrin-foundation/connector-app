
package test.java;

import io.appium.java_client.AppiumDriver;
import org.testng.annotations.*;
import appModules.AppUtlis;
import funcModules.ConnectionModules;
import funcModules.LockModules;
import utility.*;
@Test
public class App4NegativeTest {

	public  AppiumDriver driver;

	AppUtlis AppUtlisObj=new AppUtlis();
	LockModules LockModlesObj=new LockModules();
	ConnectionModules ConnectionModulesObj =new ConnectionModules();


	@BeforeClass //testng 
	public void BeforeClass() throws Exception {
		
    	Thread.sleep(20000);
		driver = Setup.ConfigureDriver("App");

	}
	
	
	
    @Test (groups = {"Regression"})
	public void App1PinCodeInvalidSetup()throws Exception{
		AppUtlisObj.CheckSkip();
		LockModlesObj.InvalidPinCodeSetup(driver);
		AppUtlis.Success=true;		

	   }
    
    @Test (groups = {"Regression"})
	public void App2PinCodevalidSetup()throws Exception{
		
		AppUtlisObj.CheckSkip();
		LockModlesObj.PinCodeSetup(driver);
		AppUtlis.Success=true;		
	
	   }
	

	
    @Test (groups = {"Regression"})
	public void App3ProvisoningDeny()throws Exception{
		
		AppUtlisObj.CheckSkip();
		ConnectionModulesObj.AppProvisioningRequest("Deny",driver);
		AppUtlis.Success=true;		

		
	}
    
    
    @Test (groups = {"Regression"})
	public void App4EnterInvalidPincode()throws Exception{
    	driver.quit();
		driver = Setup.ConfigureDriver("App");
		AppUtlisObj.enterPincodeReverse(driver);
		AppUtlis.Success=true;		

		
	}

    @AfterClass
	public void afterClass() {
		 driver.removeApp("com.evernym.connectme.callcenter");
		 driver.quit();
		 System.out.println("Cleaning up Completed");

	}
}