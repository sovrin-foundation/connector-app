package funcModules;

import appModules.AppUtlis;
import appModules.RestApi;
import io.appium.java_client.AppiumDriver;
import pageObjects.ChooseLockPage;
import pageObjects.ConnectionDetailPage;
import pageObjects.PincodePage;

public class ConnectionModules {
	

	AppUtlis AppUtlisObj=new AppUtlis();

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
	 
	   ConnectionDetailPage.Continue_Button(driver).click();
	}
	
	public void AuthRequest(AppiumDriver driver,String Env) throws Exception
	{
		
		String payload=null;
	    String requestUrl=null;	
	    String PairwiseDID= AppUtlis.ResponseSendSms;
		PairwiseDID=PairwiseDID.substring(PairwiseDID.indexOf("pairwiseDID") + 14 , PairwiseDID.indexOf("pairwiseDID") + 36);
		System.out.println(PairwiseDID);
		if (Env=="Demo")
		{
			 payload="{\"challenge\":\"{\\\"requesterName\\\":\\\"Ankur\\\"}\",\"signature\":\"59GtUGNsPcDpzYz2Hh4M3VcZWMzuDGXivdZq6SiTQaqetxVRgw58szohZiAMDcmGS8PJcjPqywDq4tE2tZt1dZ7f\"}";
			 requestUrl="https://agency-ea.evernym.com/agent/"+PairwiseDID+"/auth";
		}
		else
		{
			 payload="{\"challenge\":\"{\\\"requesterName\\\":\\\"Ankur\\\"}\",\"signature\":\"5BEnLkdNxjnFvhwECqxvQkBSwQR8DfcmVya3qq1RNziwPnt8Vzeh1TXxBNetFMSyBGzbPXW2ECTeP5w7z7Kvj2fp\"}";
			 requestUrl="https://agency-ea-sandbox.evernym.com/agent/"+PairwiseDID+"/auth";
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
	   ChooseLockPage.PinCodeLock_Button(driver).click();
	   AppUtlisObj.RequestProvisioning(driver,"Deny");
	   driver.switchTo().alert().accept();
	}

}
