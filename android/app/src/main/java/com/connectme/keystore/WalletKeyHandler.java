package com.connectme.keystore;

import android.app.KeyguardManager;
import android.content.Context;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyInfo;
import android.security.keystore.KeyProperties;
import android.security.keystore.UserNotAuthenticatedException;
import android.support.annotation.NonNull;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.ProviderException;
import java.security.SecureRandom;
import java.security.UnrecoverableEntryException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;
import java.util.Date;
import java.util.Random;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;

public class WalletKeyHandler {
    private static final String wrappingKey = "8c8bab2608e943df9c04a76e283b4299b8b17684a71c4ee7b8dfc6bd93f84097";
    private static final String dummyKey = "12019a81b4c64b03a3db4f6f4a8f34b9bbe9aff1e3d24418899fbc6076b446b5";
    private static final String walletKeyFilename = "ff7a48ddfe10422cb54b474d04898637";
    private static final String cipherName = "AES/GCM/NoPadding";
    private static final int iv_length = 12;
    private static final int tag_length = 128;
    private static final long thirty_days = 2592000000L;

    public static byte[] getWalletEncryptionKey(Context context) throws UserNotAuthenticatedException, LostKeyException {
        checkKeyguardSecure(context);

        if (systemHasSecureHardware()) {
            String walletFilename = context.getApplicationInfo().dataDir + "/" + walletKeyFilename;
            File walletFile = new File(walletFilename);
            SecretKey key = getWalletKeyWrappingKey();
            try {
                byte[] walletKey;
                if (walletFile.canRead()) {
                    walletKey = tryDecrypt(loadFile(walletFile), key);
                    rotateWrappingKeyIfNeeded(context, walletFile, walletKey, key);
                } else {
                    SecureRandom secureRandom = new SecureRandom();
                    Random random = new Random();
                    int draws = random.nextInt(50) + 10;
                    walletKey = new byte[256];
                    for (int i = 0; i < draws; i++) {
                        //Just in case the random number seed hasn't been initialized well since boot
                        secureRandom.nextBytes(walletKey);
                    }
                    saveWalletEncryptionKey(context, walletKey, key);
                }
                return walletKey;
            } catch (IOException | NoSuchProviderException | NoSuchAlgorithmException |
                     InvalidKeySpecException | KeyStoreException e) {
                throw new RuntimeException(e);
            }
        } else {
            //Key is not in hardware, caller should not be using this method
            throw new RuntimeException("When hardware is not available, do not call this method. Use 'systemHasSecureHardware' first");
        }
    }

    private static void rotateWrappingKeyIfNeeded(Context context, File walletFile, byte[] walletKey, SecretKey key) throws NoSuchAlgorithmException, LostKeyException, NoSuchProviderException, InvalidKeySpecException, KeyStoreException, IOException, UserNotAuthenticatedException {
        if (key == null)
            key = getWalletKeyWrappingKey();
        SecretKeyFactory factory = SecretKeyFactory.getInstance(key.getAlgorithm(), "AndroidKeyStore");
        KeyInfo keyInfo = (KeyInfo) factory.getKeySpec(key, KeyInfo.class);
        Date keyValidityEnd = new Date(keyInfo.getKeyValidityStart().getTime() + thirty_days);

        if (keyValidityEnd.before(new Date())) {
            //Key should to be rotated.
            walletFile.delete();
            KeyStore keyStore = loadKeyStore();
            keyStore.deleteEntry(wrappingKey);
            saveWalletEncryptionKey(context, walletKey, key);
        }
    }

    public static void setWalletEncryptionKey(Context context, byte[] walletEncryptionKey) throws UserNotAuthenticatedException, LostKeyException, IOException{
        checkKeyguardSecure(context);
        if (systemHasSecureHardware()) {
            saveWalletEncryptionKey(context, walletEncryptionKey, null);
        }
    }

    public static boolean systemHasSecureHardware() {
        try {
            SecretKey key = getKeyStoreKey(dummyKey);
            SecretKeyFactory factory = SecretKeyFactory.getInstance(key.getAlgorithm(), "AndroidKeyStore");
            KeyInfo keyInfo = (KeyInfo) factory.getKeySpec(key, KeyInfo.class);
            return keyInfo.isInsideSecureHardware();
        } catch (ProviderException e) {
            //The keystore was not automatically created like it would if hardware existed
            return false;
        } catch (LostKeyException e) {
            try {
                KeyStore keyStore = loadKeyStore();
                keyStore.deleteEntry(dummyKey);
            } catch (KeyStoreException ex) {

            }
            return false;
        }
        catch (NoSuchAlgorithmException | NoSuchProviderException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }

    public static byte[] charsToBytesArray(char[] chars) {
        byte[] b = new byte[chars.length << 1];
        int index = 0;
        for (char c: chars) {
            b[index++] = (byte) (c & 0xFF00 >> 8);
            b[index++] = (byte) (c & 0x00FF);
        }
        return b;
    }

    public static char[] bytesToCharsArray(byte[] bytes) {
        char[] c = new char[bytes.length >> 1];
        int index = 0;
        for (int i = 0; i < bytes.length; i += 2) {
            int temp = bytes[i] << 8 | bytes[i + 1];
            c[index++] = (char) temp;
        }
        return c;
    }

    private static void saveWalletEncryptionKey(Context context, byte[] walletEncryptionKey, SecretKey key) throws IOException, UserNotAuthenticatedException, LostKeyException {
        String walletFilename = context.getApplicationInfo().dataDir + "/" + walletKeyFilename;
        File walletFile = new File(walletFilename);
        saveFile(walletFile, tryEncrypt(walletEncryptionKey, key));
    }

    private static void checkKeyguardSecure(Context context) throws UserNotAuthenticatedException {
        KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);

        if (!keyguardManager.isDeviceSecure()) {
            throw new UserNotAuthenticatedException("Secure lock screen hasn't been set up.\nGo to 'Settings -> Security -> Screen lock' to setup up a lock screen");
        }
    }

    private static byte[] tryEncrypt(byte[] plaintext, SecretKey key) throws UserNotAuthenticatedException, LostKeyException {
        try {
            if (key == null)
                key = getWalletKeyWrappingKey();
            Cipher cipher = Cipher.getInstance(cipherName);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] iv = cipher.getIV();
            byte[] cipherText = cipher.doFinal(plaintext);
            byte[] result = new byte[iv.length + cipherText.length];
            System.arraycopy(iv, 0, result, 0, iv.length);
            System.arraycopy(cipherText, 0, result, iv.length, cipherText.length);
            return result;
        } catch (InvalidKeyException e) {
            if (e instanceof UserNotAuthenticatedException) {
                UserNotAuthenticatedException ex = (UserNotAuthenticatedException) e;
                throw ex;
            } else {
                throw new RuntimeException(e);
            }
        } catch (NoSuchAlgorithmException | BadPaddingException | IllegalBlockSizeException |
                NoSuchPaddingException e) {
            throw new RuntimeException(e);
        }
    }

    private static byte[] tryDecrypt(byte[] cipherText, SecretKey key) throws UserNotAuthenticatedException, LostKeyException {
        try {
            if (key == null)
                key = getWalletKeyWrappingKey();
            Cipher cipher = Cipher.getInstance(cipherName);
            GCMParameterSpec spec = new GCMParameterSpec(tag_length, cipherText, 0, iv_length);
            cipher.init(Cipher.DECRYPT_MODE, key, spec);
            return cipher.doFinal(cipherText, iv_length, cipherText.length - iv_length);
        } catch (InvalidKeyException e) {
            if (e instanceof UserNotAuthenticatedException) {
                UserNotAuthenticatedException ex = (UserNotAuthenticatedException) e;
                throw ex;
            } else {
                throw new RuntimeException(e);
            }
        } catch (NoSuchAlgorithmException | BadPaddingException | IllegalBlockSizeException |
                 NoSuchPaddingException | InvalidAlgorithmParameterException e) {
            throw new RuntimeException(e);
        }
    }

    private static byte[] loadFile(File file) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[(int) Math.min(4096, file.length())];
            int read;
            Log.d("loadFile", "Reading " + file.length() + " bytes");
            try (FileInputStream fileInputStream = new FileInputStream(file)) {
                while ((read = fileInputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, read);
                }
            }
            return outputStream.toByteArray();
        }
    }

    private static void saveFile(File file, byte[] contents) throws IOException {
        Log.d("saveFile", "Wrote " + contents.length + " bytes");
        try (FileOutputStream fileOutputStream = new FileOutputStream(file)) {
            fileOutputStream.write(contents);
        }
    }

    private static SecretKey getWalletKeyWrappingKey() throws LostKeyException {
        try {
            SecretKey key = getKeyStoreKey(wrappingKey);
            return key;
        } catch (LostKeyException e) {
            try {
                KeyStore keyStore = loadKeyStore();
                keyStore.deleteEntry(wrappingKey);
            } catch (KeyStoreException ex) {

            }
            throw e;
        }
    }

    @NonNull
    private static SecretKey getKeyStoreKey(String keyId) throws LostKeyException {
        try {
            KeyStore keyStore = loadKeyStore();
            KeyStore.Entry entry = keyStore.getEntry(keyId, null);

            SecretKey key = null;

            if (entry == null) {
                KeyGenerator keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
                keyGenerator.init(new KeyGenParameterSpec.Builder(keyId,
                        KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                        .setKeySize(256)
                        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                        .setRandomizedEncryptionRequired(true)
                        .setKeyValidityStart(new Date(System.currentTimeMillis() - 5))
                        .setUserAuthenticationValidityDurationSeconds(900)
                        .setUserAuthenticationRequired(true)
                        .build());
                key = keyGenerator.generateKey();
            } else if (entry instanceof KeyStore.SecretKeyEntry) {
                key = ((KeyStore.SecretKeyEntry) entry).getSecretKey();
            }
            return key;
        } catch (UnrecoverableKeyException e) {
            throw new LostKeyException("The lock screen has been disabled or reset. The key is not accessible anymore.");
        }
        catch (KeyStoreException | NoSuchAlgorithmException | NoSuchProviderException |
                 InvalidAlgorithmParameterException | UnrecoverableEntryException e) {
            throw new RuntimeException(e);
        }
    }

    private static KeyStore loadKeyStore() {
        try {
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            return keyStore;
        } catch (KeyStoreException | NoSuchAlgorithmException | IOException | CertificateException e) {
            throw new RuntimeException(e);
        }
    }
}
