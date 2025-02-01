package kz.dreamteam.backend.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


public class DateUtil {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static LocalDate convertToDate(String date) {
        return LocalDate.parse(date, formatter);
    }

    public static String convertToString(LocalDate date) {
        return date.format(formatter);
    }
}
