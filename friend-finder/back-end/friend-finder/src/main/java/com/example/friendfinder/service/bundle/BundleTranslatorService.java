package com.example.friendfinder.service.bundle;

import com.example.friendfinder.service.dto.bundleMessage.BundleMessage;
import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;
@Component
public class BundleTranslatorService {
    private static ResourceBundleMessageSource resourceBundleMessageSource;

    public BundleTranslatorService(@Qualifier("messages") ResourceBundleMessageSource resourceBundleMessageSource) {
        this.resourceBundleMessageSource = resourceBundleMessageSource;

    }
    public static BundleMessage getBundleMessageinEnglishAndArabic(String key) {

        return new BundleMessage(
                resourceBundleMessageSource.getMessage(key, null, new Locale("en") ),
                resourceBundleMessageSource.getMessage(key, null,  new Locale("ar"))
        );


    }
}
