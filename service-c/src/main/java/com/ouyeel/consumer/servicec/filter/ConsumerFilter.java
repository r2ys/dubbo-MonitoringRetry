package com.ouyeel.consumer.servicec.filter;

import com.alibaba.dubbo.common.Constants;
import com.alibaba.dubbo.common.extension.Activate;
import com.alibaba.dubbo.rpc.*;
import com.ouyeel.consumer.servicec.util.DemoUtils;
import com.ouyeel.consumer.servicec.util.UUIDHexIdGenerator;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Author Black
 * Date 2018/3/15
 * Time 15:24
 */
@Slf4j
@Activate(group = Constants.CONSUMER)
public class ConsumerFilter implements Filter {

	@Override
	public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {

		String interfaceName = invoker.getInterface().getName();
		String methodName = invocation.getMethodName();
		Map<String,Object> map = new HashMap<>();
		map.put("starttime",new Date());
		map.put("result","1");
		map.put("version",getVersionOrGroup("version",invoker));
		map.put("group",getVersionOrGroup("group",invoker));
		boolean check = DemoUtils.checkInterface(interfaceName, methodName);
		String param2Json = DemoUtils.dubboParam2Json(invocation);
		if(check){
			String paramType = DemoUtils.getParamType(invocation);
			String params = DemoUtils.getParams(invocation);
			map.put("method",methodName);
			map.put("interface",interfaceName);
			map.put("params",params);
			map.put("paramType",paramType);
		}
		log.info("准备调用服务，接口为："+interfaceName+"方法为："+methodName+"参数为："+param2Json+"版本为："
			+getVersionOrGroup("version",invoker)+"分组为："+getVersionOrGroup("group",invoker));
		Result result = null;
		try {
			result = invoker.invoke(invocation);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(check){
				String code = UUIDHexIdGenerator.generate().toString();
				map.put("code",code);
				assert result != null;
				boolean b = result.hasException();
				if(b){
					map.put("result","0");
					map.put("exception_remark",result.getException().getMessage());
					map.put("exception",result.getException());
				}
				map.put("endtime",new Date());
				DemoUtils.send2Mq(map);
			}
			log.info("服务："+interfaceName+"--"+methodName+"调用完毕，参数为："+param2Json+"版本为："
			+getVersionOrGroup("version",invoker)+"分组为："+getVersionOrGroup("group",invoker));
			return result;
		}
	}

	private static String getVersionOrGroup(String s ,Invoker<?> invoker){
		String parameter = invoker.getUrl().getParameter(s);
		return parameter;
	}
}
