package com.ouyeel.consumer.servicec.util;

import com.alibaba.dubbo.rpc.Invocation;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ouyeel.consumer.servicec.spring.InterfaceNameBean;
import com.ouyeel.consumer.servicec.spring.SpringApplicationContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * Author Black
 * Date 2018/3/16
 * Time 16:41
 */
@Slf4j
public class DemoUtils {

	public static boolean checkInterface(String interfaceName, String methodName){
		InterfaceNameBean bean = (InterfaceNameBean) SpringApplicationContext.getBean("interfaceName");
		String interface_Name = bean.getInterfaceName();
		return !StringUtils.isEmpty(interface_Name) && interface_Name.contains(interfaceName + "--" + methodName);
	}

	public static String dubboParam2Json(Invocation invocation){
		Class<?>[] parameterTypes = invocation.getParameterTypes();
		Object[] arguments = invocation.getArguments();
		List<Map> mapList = new ArrayList<>();
		String s = "";
		for(int i = 0;i<parameterTypes.length;i++){
			Map<Object,Object> map = new HashMap<>();
			map.put(parameterTypes[i],arguments[i]);
			mapList.add(map);
		}
		try {
			s = new ObjectMapper().writeValueAsString(mapList);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return s;
	}

	public static String getParamType(Invocation invocation){
		Class<?>[] parameterTypes = invocation.getParameterTypes();
		List<String> strings = new ArrayList<>();
		String s = "";
		for(int i = 0;i<parameterTypes.length;i++){
			strings.add(parameterTypes[i].getName());
		}
		try {
			s = new ObjectMapper().writeValueAsString(strings);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return s;
	}

	public static String getParams(Invocation invocation){
		Object[] arguments = invocation.getArguments();
		List<Object> objects = new ArrayList<>();
		String s = "";
		objects.addAll(Arrays.asList(arguments));
		try {
			s = new ObjectMapper().writeValueAsString(objects);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return s;
	}

	public static void send2Mq(Map map){
		RabbitTemplate bean = (RabbitTemplate) SpringApplicationContext.getBean("rabbitTemplate");
		ObjectMapper o = new ObjectMapper();
		String param = "";
		try {
			param = o.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		MessageProperties messageProperties = new MessageProperties();
		Message message = new Message(param.getBytes(),messageProperties);
		bean.send("cw.dubbo.consumer","consumer",message);
	}
}
