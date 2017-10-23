package funcModules;

import appModules.AppUtlis;
import appModules.RestApi;
import io.appium.java_client.AppiumDriver;
import pageObjects.ChooseLockPage;
import pageObjects.ConnectionDetailPage;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.PincodePage;

public class ConnectionModules {
	

	AppUtlis AppUtlisObj=new AppUtlis();
	RestApi RestApiObj=new RestApi();

	
	
	public void InstallApp(AppiumDriver driver,String Env)throws Exception
	{

		driver.get("https://gmail.com");
		GmailPage.UserNameText(driver).sendKeys("evernym.number@gmail.com");
		GmailPage.UserNameNextButton(driver).click();
	    GmailPage.PasswordText(driver).sendKeys("evernym123");
		GmailPage.PasswordNextButton(driver).click();
        Thread.sleep(20000);//used sleep which is not recommended as we have issue with synch of gmail opening 
        GmailPage.MobileGmailSiteLink(driver).click();
    	if(GmailPage.Email_CheckBox(driver)!=null)
    	{
    	GmailPage.Email_CheckBox(driver).click();
    	GmailPage.Delete_Button(driver).click();
		}
      	RestApiObj.sendSmsRestApi(Env);
		Thread.sleep(50000);
		driver.navigate().refresh();
	   	GmailPage.FirstEmailLink(driver).click();
    	String ConnectMeLink =GmailPage.ConnectMeLink(driver).getAttribute("href");
		System.out.println(ConnectMeLink);
		driver.get(ConnectMeLink);
		HockeyAppPage.UserNameText(driver).sendKeys("ankur.mishra@evernym.com");
		HockeyAppPage.PasswordText(driver).sendKeys("Password12$");
		HockeyAppPage.SigninButton(driver).click();    	
     	HockeyAppPage.QAConnectIcon(driver).click();  	
    	String InstallConnectMeLink =HockeyAppPage.InstallButton(driver).getAttribute("href");
    	driver.get(InstallConnectMeLink);
    	Thread.sleep(5000);//used sleep which is not recommended as we have issue with synch of alert box
    	driver.switchTo().alert().accept();
		
	}

	public void AppProvisioningRequest(String RequestType,AppiumDriver driver) throws Exception
	{

		if (RequestType=="Accept"){
	      AppUtlisObj.RequestProvisioning(driver,"Accept");
		  driver.switchTo().alert().accept();

	   }
		
	 else{
		   AppUtlisObj.RequestProvisioning(driver,"Deny");
		   driver.switchTo().alert().accept(); 
   	      }
	  Thread.sleep(5000);
	   ConnectionDetailPage.Continue_Button(driver).click();
	}
	


}
