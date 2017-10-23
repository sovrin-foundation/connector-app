
package test.java;

import io.appium.java_client.AppiumDriver;

import org.testng.annotations.*;
import appModules.AppUtlis;
import funcModules.ConnectionModules;
import utility.Setup;

public class App3InstallTest {

	private AppiumDriver driver;
	static boolean Success=false;
	AppUtlis AppUtlisObj=new AppUtlis();
	ConnectionModules ConnectionModulesObj=new ConnectionModules();


	@BeforeMethod

	public void beforeMethod() throws Exception {
        Thread.sleep(10000);
		driver = Setup.ConfigureDriver("Safari");
	}


    @Test (groups = {"Regression"})
	public void AppInstall() throws Exception  {
    	ConnectionModulesObj.InstallApp(driver,"Sandbox");
    		
    }

	@AfterMethod
	public void afterMethod() {

		driver.quit();
		System.out.println("Cleaning up Completed");

	}
}