package com.ouyeel.provider.servicep.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import com.github.pagehelper.PageHelper;

import com.ouyeel.provider.servicep.common.domain.Dubboparams;
import com.ouyeel.provider.servicep.common.mapper.DubboparamsMapper;
import org.springframework.stereotype.Service;

@Service
public class DubboparamsService {
	@Autowired
	private DubboparamsMapper _DubboparamsMapper;


	public List<Dubboparams> queryDubboparamss(Dubboparams entity){
		return _DubboparamsMapper.findDubboparamss(entity);
	}

	public List<Dubboparams> queryDubboparamss(Dubboparams entity,int page,int pageSize){
		PageHelper.startPage(page,pageSize);
		return _DubboparamsMapper.findDubboparamss(entity);
	}


    public List<Dubboparams> loadDubboparams(Dubboparams entity){
    	return _DubboparamsMapper.loadDubboparams(entity);
    }
    public List<Dubboparams> loadDubboparamsE(Dubboparams entity){
    	return _DubboparamsMapper.loadDubboparamsE(entity);
    }


    public int countDubboparamss(Dubboparams entity){
    	return _DubboparamsMapper.countDubboparamss(entity);
    }


    public int modifyDubboparams(Dubboparams entity){
    	return _DubboparamsMapper.modifyDubboparams(entity);
    }


    public int addDubboparams(Dubboparams entity){
    	return _DubboparamsMapper.addDubboparams(entity);
    }


    public int deleteDubboparams(Dubboparams entity){
    	return _DubboparamsMapper.removeDubboparams(entity);
    }


    public int deleteDubboparamsByKey(Integer id){
		return _DubboparamsMapper.removeDubboparamsByKey(id);
	}

}
