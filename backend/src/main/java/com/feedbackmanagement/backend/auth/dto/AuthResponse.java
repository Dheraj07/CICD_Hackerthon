package com.feedbackmanagement.backend.auth.dto;

public class AuthResponse {

    private String message;
    private Long userId;
    private String email;
    private String fullName;

    public AuthResponse(String message, Long userId, String email, String fullName) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
