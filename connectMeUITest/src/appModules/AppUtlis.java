package appModules;

import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;
import pageObjects.HomePage;
import pageObjects.InvitationPage;
import pageObjects.PincodePage;

import java.util.HashMap;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

//import AppiumUtils;

public class AppUtlis {
	
	public static String  ResponseSendSms;
	public  void acceptRequest(AppiumDriver driver) throws Exception
	
	{
		AppiumUtils.nClick(4,InvitationPage.Inviation_Text_Container(driver));
		InvitationPage.Allow_Button(driver).click();
		
	}
	
	public void sendSmsRestApi()
	{
		String payload="{\"challenge\":\"{\\\"verKey\\\":\\\"EMHuvYYk5LwabvtB7LHm74T1yRN9zonwpxy6P9gQHCx1\\\",\\\"targetHostDID\\\":\\\"MbVrbbVfvu7duSJWG6XxwR\\\",\\\"phoneNumber\\\":\\\"8327364896\\\"}\",\"signature\":\"3yQmsaApcN8uPmaCicU61gZyZRwS93AxzbPnPHnCN8zVfopjNRsBvhfXsPViAqZiRmYncVtHH7pSWhtTCRDToioF\"}";
		String requestUrl="https://agency-ea-sandbox.evernym.com/agent/5iZiu2aLYrQXSdonEtrTA2/connection-req";
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
	}
