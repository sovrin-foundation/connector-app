package utility;

import org.apache.commons.io.FileUtils;

public class EnvironmentUtils {
    public static String getTestPoolIP() {
        String testPoolIp = System.getenv("TEST_POOL_IP");
        return testPoolIp != null ? testPoolIp : "127.0.0.1";
    }

    public static String getIndyHomePath() {
        return FileUtils.getUserDirectoryPath() + "/.indy/";
    }

    public static String getIndyHomePath(String filename) {
        return getIndyHomePath() + filename;
    }

    public static String getTmpPath() {
        return FileUtils.getTempDirectoryPath() + "/indy/";
    }

    public static String getTmpPath(String filename) {
        return getTmpPath() + filename;
    }
}
