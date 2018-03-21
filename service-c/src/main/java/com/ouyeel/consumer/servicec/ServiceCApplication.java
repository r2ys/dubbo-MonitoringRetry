package com.ouyeel.consumer.servicec;

import com.ouyeel.consumer.servicec.spring.InterfaceNameBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource(locations = {"classpath:META-INF/spring/applicationContext.xml"})
public class ServiceCApplication {

	@Value("${interface.monitoring}")
	private String interfaceName;

	public static void main(String[] args) {
		SpringApplication.run(ServiceCApplication.class, args);
	}

	@Bean(name = "interfaceName")
	public InterfaceNameBean interfaceNameBean(){
		InterfaceNameBean interfaceNameBean = new InterfaceNameBean();
		interfaceNameBean.setInterfaceName(interfaceName);
		return interfaceNameBean;
	}
}
