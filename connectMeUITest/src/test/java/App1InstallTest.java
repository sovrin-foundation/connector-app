
package test.java;

import io.appium.java_client.AppiumDriver;
import org.testng.annotations.*;
import appModules.AppUtlis;
import funcModules.ConnectionModules;
import utility.Setup;

public class App1InstallTest {

	private AppiumDriver driver;
	static boolean Success=false;
	AppUtlis AppUtlisObj=new AppUtlis();
	ConnectionModules ConnectionModulesObj=new ConnectionModules();

	@BeforeMethod

	public void beforeMethod() throws Exception {

		driver = Setup.ConfigureDriver("Safari");
	}


    @Test (groups = { "Smoke","Regression"})
	public void AppInstall() throws Exception {

    	ConnectionModulesObj.InstallApp(driver,"Demo");
            AppUtlis.Success=true;
    }

	@AfterMethod
	public void afterMethod() {

		driver.quit();
		System.out.println("Cleaning up Completed");

	}
}