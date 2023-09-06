export interface SalesFollowDetailFields {
  customer_uid: string;
  customer_name: string;
  business_type: number;
  cooperation_type: number[];
  customer_intention: number;
  contact_name: string;
  estimate_money: any;
  estimate_time: string;
  remark: string;
  phone: string;
  wechat: string;
}

export interface SalesFollowDetailEditForm {
  mission_id?: number;
  customer_uid: string;
  business_type: number;
  cooperation_type: number[];
  customer_intention: number;
  contact: string;
  estimate_money: any;
  estimate_time: string;
  remark: string;
  phone: string;
  wechat: string;
}
