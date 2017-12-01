package appModules;


import org.bitcoinj.core.Base58;
import org.hyperledger.indy.sdk.signus.Signus;
import org.hyperledger.indy.sdk.signus.SignusJSONParameters;
import org.hyperledger.indy.sdk.signus.SignusResults.CreateAndStoreMyDidResult;
import org.hyperledger.indy.sdk.wallet.Wallet;

import utility.InMemWalletType;
import utility.InitHelper;
import utility.StorageUtils;


public class LibIndy {
	
	public static final String TRUSTEE_SEED = "000000000000000000000000Trustee1";
	public static final String MY1_SEED = "00000000000000000000000000000My1";
	private Wallet wallet;
	private String walletName = "signusWallet";
//	protected HashSet<Pool> openedPools = new HashSet<>();
	private static Boolean isWalletRegistered = false;
	private byte[] msg;
	public static String v1;
	public static String signature1;
	public static String did2;
	public static String signature2;

	
	public String[] createMyDid() throws Exception {
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
		String verKey=result.getVerkey();
		String did=result.getDid();
		 
	   byte[] msg1 = "{\"requesterName\":\"Ankur\"}".getBytes();
		//Signature2=Base58.encode(Signus.sign(this.wallet, result.getDid(), msg1).get());
		//System.out.println(DID2);
		this.wallet.closeWallet().get();
		Wallet.deleteWallet(walletName, null).get();
        String[] Result={ verKey,did};
        return Result;
		
	}
	
	public void signWithSeed(String seed ) throws Exception {
		InitHelper.init();
		seed="agencyea000000000000000000000000";
		StorageUtils.cleanupStorage();
		if (!isWalletRegistered){
			Wallet.registerWalletType("inmem", new InMemWalletType()).get();
		}
		isWalletRegistered = true;
		Wallet.createWallet("default", walletName, "default", null, null).get();
		this.wallet = Wallet.openWallet(walletName, null, null).get();
		SignusJSONParameters.CreateAndStoreMyDidJSONParameter didJson =
		new SignusJSONParameters.CreateAndStoreMyDidJSONParameter(null, seed, null, null);
     	CreateAndStoreMyDidResult result = Signus.createAndStoreMyDid(this.wallet, didJson.toJson()).get();
		//String s1 = "{\"verKey\":\""+V1+"\",\"targetHostDID\":\"MbVrbbVfvu7duSJWG6XxwR\",\"phoneNumber\":\"8327364896\",\"pairwiseDID\":\""+DID+"\"}";
       // msg=s1.getBytes();
     	byte[] signature = Signus.sign(this.wallet, result.getDid(), msg).get();
	    signature1=Base58.encode(signature);
	    this.wallet.closeWallet().get();
		Wallet.deleteWallet(walletName, null).get();

}
	
}
