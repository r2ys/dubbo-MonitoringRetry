package com.ouyeel.provider.servicep.common.domain;

import java.io.Serializable;
import java.util.Date;

public class Dubboparams  implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer id;

	private String code;

	private String interface_name;

	private String method_name;

	private String service_version;

	private String service_group;

	private String param_type;

	private String params;

	private String status;

	private String exception;

	private String exception_remark;

	private Date start_time;

	private Date end_time;

	public void setId(Integer id){
		this.id=id;
	}

	public Integer getId(){
		return id;
	}

	public void setCode(String code){
		this.code=code;
	}

	public String getCode(){
		return code;
	}

	public void setInterface_name(String interface_name){
		this.interface_name=interface_name;
	}

	public String getInterface_name(){
		return interface_name;
	}

	public void setMethod_name(String method_name){
		this.method_name=method_name;
	}

	public String getMethod_name(){
		return method_name;
	}

	public void setService_version(String service_version){
		this.service_version=service_version;
	}

	public String getService_version(){
		return service_version;
	}

	public void setService_group(String service_group){
		this.service_group=service_group;
	}

	public String getService_group(){
		return service_group;
	}

	public void setParam_type(String param_type){
		this.param_type=param_type;
	}

	public String getParam_type(){
		return param_type;
	}

	public void setParams(String params){
		this.params=params;
	}

	public String getParams(){
		return params;
	}

	public void setStatus(String status){
		this.status=status;
	}

	public String getStatus(){
		return status;
	}

	public void setException(String exception){
		this.exception=exception;
	}

	public String getException(){
		return exception;
	}

	public void setException_remark(String exception_remark){
		this.exception_remark=exception_remark;
	}

	public String getException_remark(){
		return exception_remark;
	}

	public void setStart_time(Date start_time){
		this.start_time=start_time;
	}

	public Date getStart_time(){
		return start_time;
	}

	public void setEnd_time(Date end_time){
		this.end_time=end_time;
	}

	public Date getEnd_time(){
		return end_time;
	}


	@Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Dubboparams other = (Dubboparams) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
        && (this.getCode() == null ? other.getCode() == null : this.getCode().equals(other.getCode()))
        && (this.getInterface_name() == null ? other.getInterface_name() == null : this.getInterface_name().equals(other.getInterface_name()))
        && (this.getMethod_name() == null ? other.getMethod_name() == null : this.getMethod_name().equals(other.getMethod_name()))
        && (this.getService_version() == null ? other.getService_version() == null : this.getService_version().equals(other.getService_version()))
        && (this.getService_group() == null ? other.getService_group() == null : this.getService_group().equals(other.getService_group()))
        && (this.getParam_type() == null ? other.getParam_type() == null : this.getParam_type().equals(other.getParam_type()))
        && (this.getParams() == null ? other.getParams() == null : this.getParams().equals(other.getParams()))
        && (this.getStatus() == null ? other.getStatus() == null : this.getStatus().equals(other.getStatus()))
        && (this.getException() == null ? other.getException() == null : this.getException().equals(other.getException()))
        && (this.getException_remark() == null ? other.getException_remark() == null : this.getException_remark().equals(other.getException_remark()))
        && (this.getStart_time() == null ? other.getStart_time() == null : this.getStart_time().equals(other.getStart_time()))
        && (this.getEnd_time() == null ? other.getEnd_time() == null : this.getEnd_time().equals(other.getEnd_time()))
        ;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getCode() == null) ? 0 : getCode().hashCode());
        result = prime * result + ((getInterface_name() == null) ? 0 : getInterface_name().hashCode());
        result = prime * result + ((getMethod_name() == null) ? 0 : getMethod_name().hashCode());
        result = prime * result + ((getService_version() == null) ? 0 : getService_version().hashCode());
        result = prime * result + ((getService_group() == null) ? 0 : getService_group().hashCode());
        result = prime * result + ((getParam_type() == null) ? 0 : getParam_type().hashCode());
        result = prime * result + ((getParams() == null) ? 0 : getParams().hashCode());
        result = prime * result + ((getStatus() == null) ? 0 : getStatus().hashCode());
        result = prime * result + ((getException() == null) ? 0 : getException().hashCode());
        result = prime * result + ((getException_remark() == null) ? 0 : getException_remark().hashCode());
        result = prime * result + ((getStart_time() == null) ? 0 : getStart_time().hashCode());
        result = prime * result + ((getEnd_time() == null) ? 0 : getEnd_time().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", code=").append(code);
        sb.append(", interface_name=").append(interface_name);
        sb.append(", method_name=").append(method_name);
        sb.append(", service_version=").append(service_version);
        sb.append(", service_group=").append(service_group);
        sb.append(", param_type=").append(param_type);
        sb.append(", params=").append(params);
        sb.append(", status=").append(status);
        sb.append(", exception=").append(exception);
        sb.append(", exception_remark=").append(exception_remark);
        sb.append(", start_time=").append(start_time);
        sb.append(", end_time=").append(end_time);
        sb.append("]");
        return sb.toString();
    }

	public Dubboparams() {
	}

	public Dubboparams(String code, String interface_name, String method_name, String service_version, String service_group, String param_type, String params, String status, String exception, String exception_remark, Date start_time, Date end_time) {
		this.code = code;
		this.interface_name = interface_name;
		this.method_name = method_name;
		this.service_version = service_version;
		this.service_group = service_group;
		this.param_type = param_type;
		this.params = params;
		this.status = status;
		this.exception = exception;
		this.exception_remark = exception_remark;
		this.start_time = start_time;
		this.end_time = end_time;
	}
}