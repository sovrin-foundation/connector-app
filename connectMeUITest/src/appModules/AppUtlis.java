package appModules;

import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.HomePage;
import pageObjects.InvitationPage;
import pageObjects.PincodePage;
import java.util.HashMap;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.testng.SkipException;

public class AppUtlis {
	
	public static String  ResponseSendSms;
	public static boolean Success=false;
	public  void RequestProvisioning(AppiumDriver driver,String Requestype) throws Exception
	
	{
		AppiumUtils.nClick(4,InvitationPage.Inviation_Text_Container(driver));
		if(Requestype=="Accept")
		{
			InvitationPage.Allow_Button(driver).click();

		}
		else
		{
		   InvitationPage.Deny_Button(driver).click();
		}
	}
	
	public void sendSmsRestApi(String Env)
	{	
		String payload=null;
	    String requestUrl=null;	
		if (Env=="Demo")
		{
		 payload="{\"challenge\":\"{\\\"verKey\\\":\\\"AcWa9gTK5pFhEtkzfhQuErGQhmK99XA7zAYrNTTCbRr8\\\",\\\"targetHostDID\\\":\\\"MbVrbbVfvu7duSJWG6XxwR\\\",\\\"phoneNumber\\\":\\\"8327364896\\\"}\",\"signature\":\"F72aN7eL2Bs1FZWR8GSZQddHkJcpffB5bgBkFa4yZLVMEzYqeT1EqykRPR4B35xW39e4deTVCohj3Kj2fZE45rR\"}";
		 requestUrl="https://agency-ea-sandbox.evernym.com/agent/5iZiu2aLYrQXSdonEtrTA2/connection-req";
		}
		else
		{
		 payload="{\"challenge\":\"{\\\"verKey\\\":\\\"HUtEpSKowxh9tAWbbKP68fnhKaNzsRhN2u4triHYzB8P\\\",\\\"targetHostDID\\\":\\\"MbVrbbVfvu7duSJWG6XxwR\\\",\\\"phoneNumber\\\":\\\"8327364896\\\",\\\"pairwiseDID\\\":\\\"XEohXYphD3HWgcwx9YKegd\\\"}\",\"signature\":\"pkwy2vXpKgCb6d6cF4z7VKxcgAxFy8hgbXY4rz8fKxAKfPg1mNBooLFgS8bYrTJxkPEPTRY3BnfHgfj3dPxxo8o\"}";
	     requestUrl="https://agency-ea-sandbox.evernym.com/agent/5iZiu2aLYrQXSdonEtrTA2/connection-req";
		}
		String requestType="POST";
		RestApi RestApiObj=new RestApi();
		ResponseSendSms=RestApiObj.sendPostRequest(requestUrl, payload,requestType);
		
			
		
	}
	
	
	
	public void enterPincode(AppiumDriver driver) throws Exception
	{
		for(int i=0;i<6;i++)
		{
		PincodePage.PinCodeLock_TextBox(driver, i).sendKeys(String.valueOf(i));
		}
		
	}
	public void enterPincodeReverse(AppiumDriver driver) throws Exception
	{
		for(int i=0,j=1;i<6;i++,j++)
		{
		PincodePage.PinCodeLock_TextBox(driver, i).sendKeys(String.valueOf(j));
		}
	}
		
	
	
	public void CheckSkip() throws Exception
	{	if(!AppUtlis.Success)
		{
	    throw new SkipException("Skipping this exception");
		}
	   AppUtlis.Success=false;

		
	}
	
	public void InstallApp(AppiumDriver driver,String Env)throws Exception
	{

		driver.get("https://gmail.com");
		GmailPage.UserNameText(driver).sendKeys("evernym.number@gmail.com");
		GmailPage.UserNameNextButton(driver).click();
	    GmailPage.PasswordText(driver).sendKeys("evernym123");
		GmailPage.PasswordNextButton(driver).click();
        Thread.sleep(10000);//used sleep which is not recommended as we have issue with synch of gmail opening 
        GmailPage.MobileGmailSiteLink(driver).click();
    	if(GmailPage.Email_CheckBox(driver)!=null)
    	{
    	GmailPage.Email_CheckBox(driver).click();
    	GmailPage.Delete_Button(driver).click();
		}
    	AppUtlis AppUtlisObj=new AppUtlis();
		AppUtlisObj.sendSmsRestApi(Env);
		Thread.sleep(10000);
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
	
	
	
	}