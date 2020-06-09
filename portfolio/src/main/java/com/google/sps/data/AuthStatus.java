package com.google.sps.data;

public final class AuthStatus {
    private final String user;
    private final String actionLink;

    public AuthStatus(String user, String actionLink) {
        this.user = user;
        this.actionLink = actionLink;
    }
}