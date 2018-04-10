package com.ouyeel.provider.servicep.filter;

import com.alibaba.dubbo.common.Constants;
import com.alibaba.dubbo.common.extension.Activate;
import com.alibaba.dubbo.rpc.*;
import com.ouyeel.provider.servicep.util.DemoUtils;

/**
 * Author Black
 * Date 2018/3/19
 * Time 9:20
 */
//@Activate(Constants.PROVIDER)
public class ProviderFilter implements Filter{
	@Override
	public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
		DemoUtils.dubboParam2Json(invocation);
		//todo 日志落地
		Result result = invoker.invoke(invocation);

		return result;
	}
}
