package com.ouyeel.provider.servicep.web;

import com.ouyeel.provider.servicep.common.domain.Dubboparams;
import com.ouyeel.provider.servicep.service.DubboInvokeService;
import com.ouyeel.provider.servicep.service.DubboparamsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;

/**
 * Author Black
 * Date 2018/3/19
 * Time 13:58
 */
@Controller
public class IndexController {

	@Autowired
	private DubboInvokeService dubboInvokeService;

	@Autowired
	private DubboparamsService dubboparamsService;

	@RequestMapping("/invoke")
	@ResponseBody
	public Object getResult(Integer id) throws IOException {
		Dubboparams dubboparams = new Dubboparams();
		dubboparams.setId(id);
		List<Dubboparams> dubboparams1 = dubboparamsService.loadDubboparams(dubboparams);
		assert dubboparams1 != null;
		return dubboInvokeService.dubbo$Invoke(dubboparams1.get(0));
	}

}
