package com.ouyeel.provider.servicep;

import com.ouyeel.provider.servicep.spring.InterfaceNameBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource(locations = {"classpath:META-INF/spring/applicationContext.xml"})
@MapperScan(basePackages = {"com.ouyeel.provider"})
public class ServicePApplication {

	@Value("${interface.monitoring}")
	private String interfaceName;

	public static void main(String[] args) {
		SpringApplication.run(ServicePApplication.class, args);
	}

	@Bean(name = "interfaceName")
	public InterfaceNameBean interfaceNameBean(){
		InterfaceNameBean interfaceNameBean = new InterfaceNameBean();
		interfaceNameBean.setInterfaceName(interfaceName);
		return interfaceNameBean;
	}
}
