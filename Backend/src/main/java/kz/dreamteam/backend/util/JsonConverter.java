package kz.dreamteam.backend.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Converter(autoApply = true)
public class JsonConverter implements AttributeConverter<List<String>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null) {
            return "[]";  // Сохраняем пустой JSON-массив вместо NULL
        }
        try {
            return objectMapper.writeValueAsString(attribute != null ? attribute : Collections.emptyList());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Ошибка конвертации в JSON", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return Collections.emptyList();  // Возвращаем пустой список, если в БД NULL или пустая строка
        }
        try {
            return dbData != null ? objectMapper.readValue(dbData, new TypeReference<List<String>>() {}) : new ArrayList<>();
        } catch (IOException e) {
            throw new RuntimeException("Ошибка конвертации из JSON", e);
        }
    }
}
