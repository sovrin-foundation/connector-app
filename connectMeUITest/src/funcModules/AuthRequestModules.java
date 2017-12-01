package funcModules;


import appModules.AppUtlis;
import appModules.LibIndy;
import appModules.RestApi;
import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;

public class AuthRequestModules {
	
	AppUtlis appUtlisObj=new AppUtlis();
	RestApi restApiObj=new RestApi();
	
	public void AuthRequest(AppiumDriver driver,String Env) throws Exception
	{
		
		restApiObj.post("");
		System.out.println("Notification is send on phone");
		appUtlisObj.RequestProvisioning(driver,"Accept");
	    ConnectionDetailPage.Cross_Button(driver).click();
				
		
	}

	public void AppProvisioningDeny(AppiumDriver driver) throws Exception
	{
		appUtlisObj.RequestProvisioning(driver,"Deny");
	    driver.switchTo().alert().accept();
	}

}
