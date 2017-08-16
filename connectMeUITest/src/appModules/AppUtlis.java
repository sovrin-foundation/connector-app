package appModules;

import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;
import pageObjects.HomePage;
import pageObjects.InvitationPage;

import java.util.HashMap;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

//import AppiumUtils;

public class AppUtlis {
	

	public  void acceptRequest(AppiumDriver driver) throws Exception
	
	{
		AppiumUtils.nClick(4,InvitationPage.Inviation_Text_Container(driver));
		InvitationPage.Allow_Button(driver).click();
		
	}
	
	public String getIdentifier() throws Exception
	{
		String requestUrl="https:/agency-ea-sandbox.evernym.com/agent/internal-id/8327364896/connection";
		String requestType="GET";
		String Identifier=RestApi.sendPostRequest(requestUrl, "",requestType);
		Identifier=Identifier.substring(Identifier.indexOf("identifier") + 5 , Identifier.indexOf("identifier") + 27);
		System.out.println("Identifier"+" "+"for installed app is "+Identifier);
		return Identifier;
		
		
	}

	
}
