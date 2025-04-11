package com.example.demo.exceptions;

public enum ErrorMessages {
    PRODUCT_NOT_FOUND("Product Not Found"),
    NAME_REQUIRED("Name Required"),
    DESCRIPTION_LENGTH("Description Length"),
    PRICE_CANNOT_BE_NEGATIVE("Price Can't Be Negative");

    private final String message;

    ErrorMessages(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
