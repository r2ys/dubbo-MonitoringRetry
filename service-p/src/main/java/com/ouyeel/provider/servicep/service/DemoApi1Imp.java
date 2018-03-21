package com.ouyeel.provider.servicep.service;

import com.ouyeel.provider.api.DemoApi1;

import java.util.Map;

/**
 * Author Black
 * Date 2018/3/15
 * Time 13:40
 */
//@Service(timeout = 50000,group = "service_p",version = "0.5")
public class DemoApi1Imp implements DemoApi1{

	@Override
	public String test(String s, Map<String, Object> map) {
		System.err.println("调用成功！");
		throw new RuntimeException("测试");
//		return s;
	}
}
