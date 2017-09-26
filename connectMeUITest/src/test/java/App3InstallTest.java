
package test.java;

import io.appium.java_client.AppiumDriver;

import org.testng.annotations.*;
import appModules.AppUtlis;
import utility.Setup;

public class App3InstallTest {

	public  AppiumDriver driver;
	static boolean Success=false;
	AppUtlis AppUtlisObj=new AppUtlis();
	int retry=0;


	@BeforeMethod

	public void beforeMethod() throws Exception {

		driver = Setup.ConfigureDriver("Safari");
	}


    @Test (groups = {"Regression"})
	public void AppInstall() throws Exception  {
    	try {
			AppUtlisObj.InstallApp(driver,"Sandbox");
		     } catch (Exception e) {
		    
		    System.out.println("under catch block");
			driver.quit();
			Thread.sleep(5000);
		    driver = Setup.ConfigureDriver("Safari");
			AppUtlisObj.InstallApp(driver,"Sandbox");
		    
		     }
            AppUtlis.Success=true;
        
    }

	@AfterMethod
	public void afterMethod() {

		driver.quit();
		System.out.println("Cleaning up Completed");

	}
}