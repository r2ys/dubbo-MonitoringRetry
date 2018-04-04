package com.ouyeel.provider.servicep.common.mapper;

import com.ouyeel.provider.servicep.common.domain.Dubboparams;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DubboparamsMapper {

    List<Dubboparams> findDubboparamss(Dubboparams entity);

    //List<Dubboparams> findDubboparamss(Dubboparams entity,RowBounds rowBounds);

    List<Dubboparams> loadDubboparams(Dubboparams entity);
    List<Dubboparams> loadDubboparamsE(Dubboparams entity);

    int countDubboparamss(Dubboparams entity);

    int modifyDubboparams(Dubboparams entity);

    int addDubboparams(Dubboparams entity);

    int removeDubboparams(Dubboparams entity);

    int removeDubboparamsByKey(@Param("id") Integer id);

}
