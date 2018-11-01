package com.oplatdubbo.filter;

import com.alibaba.dubbo.common.Constants;
import com.alibaba.dubbo.common.URL;
import com.alibaba.dubbo.common.extension.Activate;
import com.alibaba.dubbo.registry.integration.RegistryProtocol;
import com.alibaba.dubbo.rpc.*;
import com.oplatdubbo.util.LogUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Author zhangxiaopeng
 * Date 2018/11/1
 * Time 18:28
 */
@Activate(group = {Constants.PROVIDER},value = "oplatProviderLogFilter")
public class OplatProviderLogFilter implements Filter {

	static Logger log = LoggerFactory.getLogger(OplatProviderLogFilter.class);

	@Override
	public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
		Result result = null;
		URL url = ((RegistryProtocol.InvokerDelegete) invoker).getInvoker().getUrl();
		String localIp = LogUtils.getLocalIp();
		String host = url.getHost();
		String interfaceName = invoker.getInterface().getName();
		String methodName = invocation.getMethodName();
		try {
			result = invoker.invoke(invocation);
			if (result.hasException()) {
				Map<String, String> serviceInfos = invoker.getUrl().getParameters();
				String params = LogUtils.dubboParam2Json(invocation);
				log.error("provider exp: host={}, interfaceName={}, methodName={}, serviceInfos={}, params={}",
					host,interfaceName,methodName,serviceInfos,params);
				log.error("{}",result.getException());
			}
		} catch (Exception e) {
			log.error("{}",e);
		}
		log.info("{} from {} response to {}", interfaceName+"-"+methodName, localIp, host);
		return result;
	}


}
