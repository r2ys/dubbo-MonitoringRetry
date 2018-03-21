package com.ouyeel.consumer.servicec.spring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ApplicationObjectSupport;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import javax.annotation.Resource;

/**
 * Created by JieHuang
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SpringApplicationContext implements InitializingBean {
    public static Logger logger = LoggerFactory.getLogger(SpringApplicationContext.class);
    private static ApplicationContext applicationContext;
    @Resource
    private ApplicationObjectSupport applicationObjectSupport;

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    private static void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        logger.info("当前注入applicationContext为" + applicationContext.toString());
        SpringApplicationContext.applicationContext = applicationContext;
    }

    public static Object getBean(String name) {
        logger.info("当前获取beanName为" + name);
        waitApplicationContext();
        logger.info("存在applicationContext, 开始获取" + name);
        Object bean = applicationContext.getBean(name);
        logger.info("当前获取bean为" + bean.toString());
        return bean;
    }

    public static <T> T getBean(String name, Class<T> requiredType) {
        logger.info("当前获取beanName为" + name + ";类型为" + requiredType.getName());
        waitApplicationContext();
        logger.info("存在applicationContext, 开始获取" + name + ";类型为" + requiredType.getName());
        T bean = applicationContext.getBean(name, requiredType);
        logger.info("当前获取bean为" + bean.toString() + ";类型为" + bean.getClass().getName());
        return bean;
    }

    private static void waitApplicationContext() {
        while (SpringApplicationContext.getApplicationContext() == null) {
            logger.info("不存在applicationContext开始等待" );
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            logger.info("不存在applicationContext结束等待" );
        }
    }

    public static boolean containsBean(String name) {
        logger.info("当前判断beanName存在为" + name);
        waitApplicationContext();
        logger.info("存在applicationContext,开始判断beanName存在为" + name);
        boolean b = applicationContext.containsBean(name);
        logger.info("当前判断bean存在为" + b);
        return b;
    }

    public ApplicationObjectSupport getApplicationObjectSupport() {
        return applicationObjectSupport;
    }

    public void setApplicationObjectSupport(ApplicationObjectSupport applicationObjectSupport) {
        this.applicationObjectSupport = applicationObjectSupport;
    }

    <T> T getBean(Class<T> requiredType) {
        logger.info("当前获取bean类型为" + requiredType.getName());
        waitApplicationContext();
        logger.info("存在applicationContext, 开始获取类型为" + requiredType.getName());
        T bean = applicationContext.getBean(requiredType);
        logger.info("当前获取bean为" + bean.toString() + ";类型为" + bean.getClass().getName());
        return bean;
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        SpringApplicationContext.setApplicationContext(this.getApplicationObjectSupport().getApplicationContext());
    }
}