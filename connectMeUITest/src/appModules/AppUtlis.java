package appModules;

import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;
import pageObjects.HomePage;
import pageObjects.InvitationPage;
import pageObjects.PincodePage;

import java.util.HashMap;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.testng.SkipException;

//import AppiumUtils;

public class AppUtlis {
	
	public static String  ResponseSendSms;
	public static boolean Success=false;
	public  void acceptRequest(AppiumDriver driver) throws Exception
	
	{
		AppiumUtils.nClick(4,InvitationPage.Inviation_Text_Container(driver));
		InvitationPage.Allow_Button(driver).click();
		
	}
	
	public void sendSmsRestApi()
	{
		String payload="{\"challenge\":\"{\\\"verKey\\\":\\\"HSqPoCoLwdgVFUgH6XHcVF5qA6ABr26swpJp9WJ7MCmf\\\",\\\"targetHostDID\\\":\\\"MbVrbbVfvu7duSJWG6XxwR\\\",\\\"phoneNumber\\\":\\\"8327364896\\\"}\",\"signature\":\"3vpG9pHhhAcfFWm1Dqa3aAV2ugYbaXY9BpRgKCiqdXRrSajYFGZs1wHadvJFwXzzZNxeF7MVconudEwFDdfSJBMd\"}";
		String requestUrl="https://agency-ea.evernym.com/agent/5iZiu2aLYrQXSdonEtrTA2/connection-req";
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
	
	public void CheckSkip() throws Exception
	{	if(!AppUtlis.Success)
		{
	    throw new SkipException("Skipping this exception");
		}
	   AppUtlis.Success=false;

		
	}
	
	
	
	}
