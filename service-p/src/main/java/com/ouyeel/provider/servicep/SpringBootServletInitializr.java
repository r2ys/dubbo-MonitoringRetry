package com.ouyeel.provider.servicep;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

/**
 * Author Black
 * Date 2017/11/21
 * Time 10:42
 */
public class SpringBootServletInitializr extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(ServicePApplication.class);
	}

}
