package com.ouyeel.provider.servicep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ouyeel.provider.servicep.common.domain.Dubboparams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Author Black
 * Date 2018/3/19
 * Time 10:27
 */
@Slf4j
@Service
public class MessageService {

	@Autowired
	private DubboparamsService dubboparamsService;

	@RabbitListener(queues = {"hello1"})
	public void getMessageFromMq(Message message){
		String s = new String(message.getBody());
		ObjectMapper objectMapper = new ObjectMapper();
		Map map = new HashMap();
		try {
			map = objectMapper.readValue(s, Map.class);
			log.info("消息"+map+"开始处理！");
			String interfaceName = mapGetString("interface",map);
			String methodName = mapGetString("method",map);
			String version = mapGetString("version",map);
			String group = mapGetString("group",map);
			String params = mapGetString("params",map);
			String paramType = mapGetString("paramType",map);
			String status = mapGetString("result",map);
			String exception_remark = mapGetString("exception_remark",map);
			String exception = mapGetString("exception",map);
			String code = mapGetString("code",map);
			Date start = new Date((Long) map.get("starttime"));
			Date end = new Date((Long) map.get("endtime"));
			Dubboparams dubboparams = new Dubboparams(code,interfaceName,methodName,version,group,paramType,params,
			status,exception,exception_remark,start,end);
			dubboparamsService.addDubboparams(dubboparams);
		} catch (IOException e) {
			e.printStackTrace();
		}finally {
			log.info("消息"+ map +"处理完毕！");
		}

	}

	private static String mapGetString(String key, Map map){
		if(!ObjectUtils.isEmpty(map.get(key)))
		return map.get(key).toString();
		else
		return null;
	}

}
