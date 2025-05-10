package com.example.friendfinder.config;

import com.example.friendfinder.service.bundle.BundleTranslatorService;
import com.example.friendfinder.service.dto.bundleMessage.ExceptionResponseDto;
import jakarta.transaction.SystemException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)

    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {

            String fieldName = ((FieldError) error).getField();

            String errorMessage = error.getDefaultMessage();

            errors.put(fieldName, errorMessage);

        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);

    }


    @ExceptionHandler(SystemException.class)

    public ResponseEntity<String> handleSystemException(SystemException ex) {

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);

    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ExceptionResponseDto> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.ok(new ExceptionResponseDto(HttpStatus.NOT_ACCEPTABLE, BundleTranslatorService.getBundleMessageinEnglishAndArabic(ex.getMessage())));

    }
}
