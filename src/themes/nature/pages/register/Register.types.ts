// src/pages/register/Register.types.ts

export interface RegisterFormData {
  name: string;
  phone: string;
  password: string;
  phone_parent: string;
  type_of_attendance: 'online' | 'center';
  gender: 'male' | 'female';
  stage_id: string;
  center_hour_id: string;
  governorate: string;
  school_name: string;
  type_of_study: 'general' | 'azhar';
  image: string;
  region: string;
  birth_date: string;
}

export interface RegisterFormErrors {
  name?: string;
  phone?: string;
  password?: string;
  phone_parent?: string;
  region?: string;
  birth_date?: string;
  governorate?: string;
  school_name?: string;
  stage_id?: string;
  center_hour_id?: string;
}

export interface Governorate {
  value: string;
  label: string;
  label_en: string;
}

export interface Step {
  number: number;
  label: string;
  labelEn: string;
}