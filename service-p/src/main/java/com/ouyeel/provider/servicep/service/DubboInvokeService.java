package com.ouyeel.provider.servicep.service;

import com.alibaba.dubbo.config.ApplicationConfig;
import com.alibaba.dubbo.config.ReferenceConfig;
import com.alibaba.dubbo.config.RegistryConfig;
import com.alibaba.dubbo.config.utils.ReferenceConfigCache;
import com.alibaba.dubbo.rpc.service.GenericException;
import com.alibaba.dubbo.rpc.service.GenericService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ouyeel.provider.servicep.common.domain.Dubboparams;
import com.ouyeel.provider.servicep.util.UUIDHexIdGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;

/**
 * Author Black
 * Date 2018/3/19
 * Time 14:00
 */
@Slf4j
@Service
public class DubboInvokeService {

	@Value("${zk.address.dubbop}")
	private String zk;
	@Value("${dubbo.registry.protocol}")
	private String protocol;

	@Autowired
	private DubboparamsService dubboparamsService;

	public Object dubbo$Invoke(String[] paramType, Object[] param, Dubboparams dubboparams){
		String result1 = "success!";
        boolean f = true;
        String ex = "";
        String ex1 = "";
        String interface_name = dubboparams.getInterface_name();
        String method_name = dubboparams.getMethod_name();
        String version = dubboparams.getService_version();
        String group = dubboparams.getService_group();
        ReferenceConfig<GenericService> referenceConfig = referenceConfig(dubboparams);
        ReferenceConfigCache cache = ReferenceConfigCache.getCache();
        GenericService genericService = cache.get(referenceConfig);
        Object result = new Object();
        Date start = new Date();
        dubboparams.setStart_time(start);
        try {
        	result = genericService.$invoke(method_name,paramType,param);
		} catch (Exception e) {
			//todo 日志
			log.info("手动调用服务："+interface_name+"--"+method_name+"失败，服务版本为："+version+"分组为："+group);
			f = false;
			if(e instanceof GenericException) {
				ex = ((GenericException) e).getExceptionMessage();
			} else {
				ex = e.getMessage();
			}
			ex1 = e.toString();
			e.printStackTrace();
		} finally {
			if (!f){
				dubboparams.setException_remark(ex);
				dubboparams.setException(ex1);
				dubboparams.setStatus("0");
				result1 = "fail!";
			}else{
				dubboparams.setException(null);
				dubboparams.setException_remark(null);
				dubboparams.setStatus("1");
				log.info("手动调用服务："+interface_name+"--"+method_name+"成功，服务版本为："+version+"分组为："+group+"调用结果为："+result);
			}
			dubboparams.setCode(UUIDHexIdGenerator.generate().toString());
			dubboparams.setEnd_time(new Date());
			dubboparams.setId(null);
			dubboparamsService.addDubboparams(dubboparams);
			return result1;
		}
    }

    public Object dubbo$Invoke(Dubboparams dubboparams) throws IOException {
		String[] paramType = getParamType(dubboparams);
		Object[] param = getParam(dubboparams);
		log.info("手动调用服务："+dubboparams.getInterface_name()+"--"+dubboparams.getMethod_name()+"开始，服务版本为："
		+dubboparams.getService_version()+"分组为："+dubboparams.getService_group());
		Object o = dubbo$Invoke(paramType, param, dubboparams);
		return o;
	}

	private static String[] getParamType(Dubboparams dubboparams) throws IOException {
		String param_type = dubboparams.getParam_type();
		ObjectMapper o = new ObjectMapper();
		String[] strings = o.readValue(param_type, String[].class);
		return strings;
	}

	private static Object[] getParam(Dubboparams dubboparams) throws IOException {
		String params = dubboparams.getParams();
		ObjectMapper o = new ObjectMapper();
		Object[] objects = o.readValue(params, Object[].class);
		return objects;
	}

	private ReferenceConfig<GenericService> referenceConfig(Dubboparams dubboparams){
		ApplicationConfig application = new ApplicationConfig();
        application.setName("service-p");
        // 连接注册中心配置
        RegistryConfig registry = new RegistryConfig();
        registry.setAddress(zk);
        registry.setProtocol(protocol);
        ReferenceConfig<GenericService> referenceConfig = new ReferenceConfig<GenericService>();
        referenceConfig.setApplication(application);
        referenceConfig.setRegistry(registry);
        referenceConfig.setInterface(dubboparams.getInterface_name());
        referenceConfig.setVersion(dubboparams.getService_version());
        referenceConfig.setGroup(dubboparams.getService_group());
        referenceConfig.setGeneric(true);
        return referenceConfig;
	}
}
