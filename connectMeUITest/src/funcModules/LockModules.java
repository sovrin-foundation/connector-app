package funcModules;

import appModules.AppUtlis;
import io.appium.java_client.AppiumDriver;
import pageObjects.ChooseLockPage;
import pageObjects.PincodePage;

public class LockModules {
	
	AppUtlis AppUtlisObj=new AppUtlis();

	public void PinCodeSetup(AppiumDriver driver) throws Exception{
		
	for(int j=0;j<2;j++)
	{
		AppUtlisObj.enterPincode(driver);
	}
	PincodePage.Close_Button(driver).click();
	
	}
	
	public void InvalidPinCodeSetup(AppiumDriver driver) throws Exception{
		
	ChooseLockPage.PinCodeLock_Button(driver).click();
	AppUtlisObj.enterPincode(driver);
	AppUtlisObj.enterPincodeReverse(driver);
		
    }

}
