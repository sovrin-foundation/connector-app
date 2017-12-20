package appModules;

import io.appium.java_client.AppiumDriver;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.InvitationPage;
import pageObjects.PincodePage;
import utility.ErrorCodeMatcher;
import utility.InMemWalletType;
import utility.InitHelper;
import utility.StorageUtils;
import java.util.HashSet;
import org.bitcoinj.core.Base58;
import org.hyperledger.indy.sdk.pool.Pool;
import org.hyperledger.indy.sdk.signus.Signus;
import org.hyperledger.indy.sdk.signus.SignusJSONParameters;
import org.hyperledger.indy.sdk.signus.SignusResults.CreateAndStoreMyDidResult;
import org.hyperledger.indy.sdk.wallet.Wallet;
import org.testng.SkipException;
import org.hyperledger.indy.sdk.ErrorCode;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;


public class AppUtlis {
	
	public static boolean Success=false;
	LibIndy libindyObj=new LibIndy();
	RestApi restApiObj=new RestApi();
	public static String pairwiseVerkey,pairwiseDID;

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
	
	public String sendSmsRestApi() throws Exception
    {
		
		 String pairwiseVerkey,pairwiseDID;
	     String result[];
	     result=libindyObj.createMyDid();
	     pairwiseVerkey=result[0];
	     pairwiseDID=result[1];
	     restApiObj.createPairwiseKey(pairwiseDID, pairwiseVerkey);
	     restApiObj.setProfileData(pairwiseDID,"Ankur Mishra");
	     restApiObj.sendInvite(pairwiseDID, "D1234", "8327364896");
	     return pairwiseDID;
	}
	
	public void sendClaimofferRestApi(String pairwiseDID) throws Exception
    {
		
		restApiObj.sendClaimOffer(pairwiseDID);
	}
	public void sendClaimRestApi(String pairwiseDID) throws Exception
    {
		
		restApiObj.sendClaim(pairwiseDID);
	}
	
	public void sendProofRequestRestApi(String pairwiseDID) throws Exception
    {
		restApiObj.sendProofReq(pairwiseDID);

    }

}