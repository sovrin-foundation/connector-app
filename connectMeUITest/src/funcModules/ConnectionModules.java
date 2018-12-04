package funcModules;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import appModules.AppUtlis;
import appModules.ReadMail;
import appModules.RestApi;
import io.appium.java_client.AppiumDriver;
import pageObjects.ChooseLockPage;
import pageObjects.ConnectionDetailPage;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.PincodePage;
import utility.Setup;

public class ConnectionModules {
	

	AppUtlis AppUtlisObj=new AppUtlis();
	RestApi RestApiObj=new RestApi();
	private AppiumDriver driver;

	
	
	public void InstallApp(AppiumDriver driver,String Link)throws Exception
	{
		
		Thread.sleep(3000);
		driver.get(Link);
		HockeyAppPage.UserNameText(driver).sendKeys("ankur.mishra@evernym.com");
		HockeyAppPage.PasswordText(driver).sendKeys("Password12$");
		HockeyAppPage.SigninButton(driver).click();    	
     	HockeyAppPage.QAConnectIcon(driver).click(); 
     	String InstallConnectMeLink =HockeyAppPage.InstallButton(driver).getAttribute("href");
     	System.out.println(InstallConnectMeLink);
        driver.get(InstallConnectMeLink);
        Thread.sleep(10000);
        //used sleep which is not recommended as we have issue with synch of alert box
    	driver.switchTo().alert().accept();
		
	}

	public void AppProvisioningRequest(String RequestType,AppiumDriver driver) throws Exception
	{

		if (RequestType=="Accept"){
	      AppUtlisObj.RequestProvisioning(driver,"Accept");
		  driver.switchTo().alert().accept();

	      }
		
	 else {
		   AppUtlisObj.RequestProvisioning(driver,"Deny");
		   driver.switchTo().alert().accept(); 
   	      }
	   Thread.sleep(5000);
	   ConnectionDetailPage.Continue_Button(driver).click();
	}
	

}
