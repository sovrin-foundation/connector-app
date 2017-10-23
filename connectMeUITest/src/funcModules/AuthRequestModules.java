package funcModules;


import appModules.AppUtlis;
import appModules.LibIndy;
import appModules.RestApi;
import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;

public class AuthRequestModules {
	
	AppUtlis AppUtlisObj=new AppUtlis();
	RestApi RestApiObj=new RestApi();
	
	public void AuthRequest(AppiumDriver driver,String Env) throws Exception
	{
		
		String payload=null;
	    String requestUrl=null;	
	   // String PairwiseDID= AppUtlis.ResponseSendSms;
		//PairwiseDID=PairwiseDID.substring(PairwiseDID.indexOf("pairwiseDID") + 14 , PairwiseDID.indexOf("pairwiseDID") + 36);
		//System.out.println(PairwiseDID);
		if (Env=="Demo")
		{
			 payload="{\"challenge\":\"{\\\"requesterName\\\":\\\"Ankur\\\"}\",\"signature\":\""+LibIndy.Signature2+"\"}";
			 requestUrl="https://agency-ea.evernym.com/agent/"+LibIndy.DID2+"/auth";
		}
		else
		{
			 payload="{\"challenge\":\"{\\\"requesterName\\\":\\\"Ankur\\\"}\",\"signature\":\""+LibIndy.Signature2+"\"}";
			 requestUrl="https://agency-ea-sandbox.evernym.com/agent/"+LibIndy.DID2+"/auth";
		}
	
		String requestType="POST";
		RestApi RestApiObj=new RestApi();
		RestApiObj.sendPostRequest(requestUrl, payload,requestType);	
		System.out.println("Notification is send on phone");
		AppUtlisObj.RequestProvisioning(driver,"Accept");
	    ConnectionDetailPage.Cross_Button(driver).click();
				
		
	}

	public void AppProvisioningDeny(AppiumDriver driver) throws Exception
	{
	   AppUtlisObj.RequestProvisioning(driver,"Deny");
	   driver.switchTo().alert().accept();
	}

}
