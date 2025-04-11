package com.example.demo.enums;

public enum BiddingDuration {
    HOURS_24(24),
    HOURS_48(48),
    HOURS_72(72);

    private final int hours;

    BiddingDuration(int hours) {
        this.hours = hours;
    }

    public int getHours() {
        return hours;
    }

    public static BiddingDuration fromHours(int hours) {
        return switch (hours) {
            case 24 -> HOURS_24;
            case 48 -> HOURS_48;
            case 72 -> HOURS_72;
            default -> throw new IllegalArgumentException("Invalid bidding duration: " + hours);
        };
    }
}

