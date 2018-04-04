package com.ouyeel.provider.servicep.web;

import com.ouyeel.provider.servicep.common.domain.Dubboparams;
import com.ouyeel.provider.servicep.service.DubboInvokeService;
import com.ouyeel.provider.servicep.service.DubboparamsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by jingxiaoyu on 2018/3/30.
 */
@Controller
@RequestMapping("/service")
public class DisplayController {

    private static Logger logger = LoggerFactory.getLogger(DisplayController.class);

    @Autowired
    private DubboparamsService dubboparamsService;

    @Autowired
	private DubboInvokeService dubboInvokeService;

    @RequestMapping("/display")
    public String show(){
        logger.info("---进入展示页面---");
        return "displayparams";
    }

    @RequestMapping(value = "/query",method = RequestMethod.POST)
    @ResponseBody
    public List<Dubboparams> query(@RequestBody Map<String,Object> map){
        logger.info("---开始查询数据---");
        int page = 0;
        int pageSize = 0;
        Dubboparams dubboparams = new Dubboparams();
        if(!CollectionUtils.isEmpty(map)){
            page = (int) map.get("page");
            pageSize = (int) map.get("pageSize");
            dubboparams.setCode((String) map.get("code"));
            dubboparams.setInterface_name((String) map.get("interface_name"));
            dubboparams.setMethod_name((String) map.get("method_name"));
        }
        List<Dubboparams> dubboparamsList = dubboparamsService.queryDubboparamss(dubboparams, page, pageSize);

        return dubboparamsList;
    }

    @RequestMapping(value = "/queryE",method = RequestMethod.POST)
    @ResponseBody
    public List<Dubboparams> queryException(@RequestBody Dubboparams dubboparams){
        logger.info("---开始查询数据---");
        List<Dubboparams> dubboparamsList = dubboparamsService.loadDubboparamsE(dubboparams);
        return dubboparamsList;
    }

    @RequestMapping("/invoke")
	@ResponseBody
	public Object getResult(String code) throws IOException {
		Dubboparams dubboparams = new Dubboparams();
		dubboparams.setCode(code);
		List<Dubboparams> dubboparams1 = dubboparamsService.loadDubboparams(dubboparams);
		assert dubboparams1 != null;
		return dubboInvokeService.dubbo$Invoke(dubboparams1.get(0));
	}

}
