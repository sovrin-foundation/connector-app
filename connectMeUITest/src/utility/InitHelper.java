package utility;


import org.hyperledger.indy.sdk.LibIndy;

public class InitHelper {
	public static void init() {

		if (!LibIndy.isInitialized()) LibIndy.init("./lib/");

	}
}
