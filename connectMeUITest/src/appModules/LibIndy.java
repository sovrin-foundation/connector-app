package appModules;

import static org.junit.Assert.assertEquals;

import java.util.concurrent.TimeUnit;

import org.bitcoinj.core.Base58;
import org.hyperledger.indy.sdk.signus.Signus;
import org.hyperledger.indy.sdk.signus.SignusJSONParameters;
import org.hyperledger.indy.sdk.signus.SignusResults.CreateAndStoreMyDidResult;
import org.hyperledger.indy.sdk.wallet.Wallet;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.Timeout;

import utility.InMemWalletType;
import utility.InitHelper;
import utility.StorageUtils;

public class LibIndy {
	
	public static final String TRUSTEE_SEED = "000000000000000000000000Trustee1";
	public static final String MY1_SEED = "00000000000000000000000000000My1";
	private Wallet wallet;
	private String walletName = "signusWallet";
//	protected HashSet<Pool> openedPools = new HashSet<>();


	@Rule
	public ExpectedException thrown = ExpectedException.none();

	@Rule
	public Timeout globalTimeout = new Timeout(1, TimeUnit.MINUTES);

	private static Boolean isWalletRegistered = false;
	private byte[] msg;
	public static String V1;
	public static String Signature1;
	public static String DID2;
	public static String Signature2;

	
	public void testCreateMyDidWorksForEmptyJson() throws Exception {
		InitHelper.init();
		StorageUtils.cleanupStorage();
		if (!isWalletRegistered){
			Wallet.registerWalletType("inmem", new InMemWalletType()).get();
		}
		isWalletRegistered = true;
		Wallet.createWallet("default", walletName, "default", null, null).get();
		this.wallet = Wallet.openWallet(walletName, null, null).get();
		SignusJSONParameters.CreateAndStoreMyDidJSONParameter didJson =
		new SignusJSONParameters.CreateAndStoreMyDidJSONParameter(null, null, null, null);
		CreateAndStoreMyDidResult result = Signus.createAndStoreMyDid(this.wallet, didJson.toJson()).get();
		assertEquals(16, Base58.decode(result.getDid()).length);
		assertEquals(32, Base58.decode(result.getVerkey()).length);
		V1=result.getVerkey();
		DID2=result.getDid();
	    byte[] msg1 = "{\"requesterName\":\"Ankur\"}".getBytes();
		Signature2=Base58.encode(Signus.sign(this.wallet, result.getDid(), msg1).get());
		System.out.println(DID2);
		this.wallet.closeWallet().get();
		Wallet.deleteWallet(walletName, null).get();

		
	}
	
	public void testSignWorks() throws Exception {
		InitHelper.init();
		StorageUtils.cleanupStorage();
		if (!isWalletRegistered){
			Wallet.registerWalletType("inmem", new InMemWalletType()).get();
		}
		isWalletRegistered = true;
		Wallet.createWallet("default", walletName, "default", null, null).get();
		this.wallet = Wallet.openWallet(walletName, null, null).get();
		SignusJSONParameters.CreateAndStoreMyDidJSONParameter didJson =
		new SignusJSONParameters.CreateAndStoreMyDidJSONParameter(null, "agencyea000000000000000000000000", null, null);
     	CreateAndStoreMyDidResult result = Signus.createAndStoreMyDid(this.wallet, didJson.toJson()).get();
		String s1 = "{\"verKey\":\""+V1+"\",\"targetHostDID\":\"MbVrbbVfvu7duSJWG6XxwR\",\"phoneNumber\":\"8327364896\",\"pairwiseDID\":\""+DID2+"\"}";
        msg=s1.getBytes();
     	byte[] signature = Signus.sign(this.wallet, result.getDid(), msg).get();
	    Signature1=Base58.encode(signature);
	    this.wallet.closeWallet().get();
		Wallet.deleteWallet(walletName, null).get();

}
	
}
