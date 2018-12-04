package funcModules;

import appModules.AppUtlis;
import appModules.LibIndy;
import appModules.RestApi;
import io.appium.java_client.AppiumDriver;
import pageObjects.ClaimOfferPage;
import pageObjects.ConnectionDetailPage;

public class ClaimOfferModules {
	
	AppUtlis appUtlisObj=new AppUtlis();
	RestApi  restApiObj=new RestApi();
	
	
	
	public void SendClaimOffer(AppiumDriver driver) throws Exception
	{
		//appUtlisObj.sendClaimofferRestApi();
		ClaimOfferPage.Accept_Button(driver).click();

    }
	
}


