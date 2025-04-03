package com.example.demo.enums;

public enum ProductCondition {
    NEW("New"),
    USED("Used");

    private String condition;

    ProductCondition(String condition) {
        this.condition = condition;
    }

    public String getCondition() {
        return condition;
    }
}
