package com.oplatdubbo.util;

import com.alibaba.dubbo.rpc.Invocation;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.InetAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Author zhangxiaopeng
 * Date 2018/11/1
 * Time 19:08
 */
public class LogUtils {

	public static String dubboParam2Json(Invocation invocation){
		Class<?>[] parameterTypes = invocation.getParameterTypes();
		Object[] arguments = invocation.getArguments();
		List<Map> mapList = new ArrayList<Map>();
		String s = "";
		for(int i = 0;i<parameterTypes.length;i++){
			Map<Object,Object> map = new HashMap<Object,Object>();
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

	public static String getLocalIp() {
		InetAddress addr = null;
		String ip = null;
		try {
			addr = InetAddress.getLocalHost();
			ip = addr.getHostAddress();
		} catch (Exception e) {
			return "localhost";
		}
		return ip; //获取本机ip
	}
}
