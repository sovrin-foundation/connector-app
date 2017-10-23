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
import static org.junit.Assert.assertEquals;
import java.util.HashSet;
import org.bitcoinj.core.Base58;
import org.hyperledger.indy.sdk.pool.Pool;
import org.hyperledger.indy.sdk.signus.Signus;
import org.hyperledger.indy.sdk.signus.SignusJSONParameters;
import org.hyperledger.indy.sdk.signus.SignusResults.CreateAndStoreMyDidResult;
import org.hyperledger.indy.sdk.wallet.Wallet;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.Timeout;
import org.testng.SkipException;
import org.hyperledger.indy.sdk.ErrorCode;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;


public class AppUtlis {
	
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
	

	}

	
	