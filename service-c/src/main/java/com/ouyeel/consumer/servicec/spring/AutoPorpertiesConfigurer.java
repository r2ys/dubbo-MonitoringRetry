package com.ouyeel.consumer.servicec.spring;//package com.ouyeel.consumer.servicec.spring;
//
//import org.springframework.beans.BeansException;
//import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
//import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
//import org.springframework.stereotype.Component;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Properties;
//
///**
// * Author Black
// * Date 2018/3/16
// * Time 10:32
// */
//@Component("autoPorpertiesConfigurer")
//public class AutoPorpertiesConfigurer extends PropertyPlaceholderConfigurer {
//    private static Map<String,Object> ctxPropertiesMap;
//    private PropValueController propValueController;
//    private PropValueController defaultPropValueController = new DefaultPropValueController();
//
//    @Override
//    protected void processProperties(ConfigurableListableBeanFactory beanFactoryToProcess, Properties props) throws BeansException {
//
//        super.processProperties(beanFactoryToProcess, props);
//        ctxPropertiesMap = new HashMap<String,Object>();
//         if (propValueController==null)
//             propValueController = defaultPropValueController;
//
//        long index=0;
//        for (Object key : props.keySet()) {
//            String keyStr = key.toString();
//            Object value = propValueController.transform(index,keyStr,props.getProperty(keyStr));
//            ctxPropertiesMap.put(keyStr, value);
//            index++;
//        }
//    }
//
//    public static Object getContextProperty(String name) {
//        return ctxPropertiesMap.get(name);
//    }
//
//    public void setPropValueController(PropValueController propValueController) {
//        this.propValueController = propValueController;
//    }
//}
//
///**
// * 配置值转化处理
// */
//interface PropValueController{
//    public Object transform(long index, String key, String value) throws BeansException;
//}
//
///**
// * 配置默认返回原string
// */
//class DefaultPropValueController implements PropValueController{
//    @Override
//    public Object transform(long index, String key, String value) throws BeansException {
//        return value;
//    }
//}
