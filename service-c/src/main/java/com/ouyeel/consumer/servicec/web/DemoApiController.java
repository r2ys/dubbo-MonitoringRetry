package com.ouyeel.consumer.servicec.web;

import com.alibaba.dubbo.config.annotation.Reference;
import com.ouyeel.provider.api.DemoApi1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Author Black
 * Date 2018/3/15
 * Time 15:06
 */
@Controller
public class DemoApiController {

	@Autowired
	private DemoApi1 demoApi1;

	@RequestMapping("/demoApi1test")
	@ResponseBody
	public String demoApi1test(){
		Map<String,Object> map = new HashMap<>();
		map.put("name","zhangsan");
		map.put("age","25");
		String test = demoApi1.test("1",map);
		return test;
	}
}
