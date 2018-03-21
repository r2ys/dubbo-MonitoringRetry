package com.ouyeel.provider.servicep.spring;

import com.github.pagehelper.PageHelper;
import org.apache.ibatis.logging.log4j2.Log4j2Impl;
import org.apache.ibatis.plugin.Interceptor;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;
import java.io.IOException;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

@Configuration
public class MybatisConfiguration {

    @Value("${mybatis.mapperLocations:classpath:mapping/**/*.xml}")
    String mapperLocations;

    @Autowired
    private DataSource dataSource;

    @Bean
    public SqlSessionFactoryBean sqlSessionFactory() throws IOException {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setFailFast(true);
        factoryBean.setMapperLocations(partitionMapperLocations(mapperLocations));
        factoryBean.setConfiguration(configuration());
        factoryBean.setPlugins(
                new Interceptor[]{
                        pageHelper()});
        return factoryBean;
    }

    @Bean
    public PageHelper pageHelper() {
        PageHelper helper = new PageHelper();
        Properties props = new Properties();
        props.setProperty("dialect", "");
        props.setProperty("offsetAsPageNum", "false");
        props.setProperty("rowBoundsWithCount", "false");
        props.setProperty("pageSizeZero", "false");
        props.setProperty("reasonable", "false");
        props.setProperty("params", "");
        helper.setProperties(props);
        return helper;
    }

    private Resource[] partitionMapperLocations(String mapperLocations) throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        if(mapperLocations.contains(",")){
            Set<Resource> set = new HashSet<Resource>();
            String[] locations = mapperLocations.split(",");
            Resource[] resources1 = resolver.getResources(locations[0]);
            Resource[] resources2 = resolver.getResources(locations[1]);
            for(Resource resource:resources1){
                set.add(resource);
            }
            for(Resource resource:resources2){
                set.add(resource);
            }
            return set.toArray(new Resource[10000]);
        }else{
            return resolver.getResources(mapperLocations);
        }
    }

    private org.apache.ibatis.session.Configuration configuration(){
        final org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setCallSettersOnNulls(true);
        configuration.setLogImpl(Log4j2Impl.class);
        return configuration;
    }

}
