package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
	
	@Value("${origin}")
	private String origin;
	
	// this works only for custom controllers, but not on endpoints created by Rest Repo
//	@Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins(origin) // Allows requests from this origin
//                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Allows specified HTTP methods
//                        .allowedHeaders("*"); // Allows all headers
////                        .allowCredentials(true); // Allows credentials (e.g., cookies)
//            }
//        };
//	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration config = new CorsConfiguration();

	    config.setAllowedOriginPatterns(List.of(origin)); 

	    config.setAllowedMethods(List.of("*"));
	    config.setAllowedHeaders(List.of("*"));
	    config.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);

	    return source;
	}
}
