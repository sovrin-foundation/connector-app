package me.connect.keystore;

public class LostKeyException extends Exception {
    public LostKeyException() {
        super();
    }
    public LostKeyException(String message) {
        super(message);
    }
}
