/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/register/hooks/useRegisterForm.ts

import { useState, useCallback } from 'react';
import { RegisterFormData, RegisterFormErrors } from '@/themes/nature/pages/register/Register.types';
import { validateField, formatPhoneNumber } from '@/themes/nature/pages/register/Register.utils';
import { toast } from '@/hooks/use-toast';

export const useRegisterForm = (lang: string, isCenter: boolean) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    phone: "",
    password: "",
    phone_parent: "",
    type_of_attendance: "online",
    gender: "male",
    stage_id: "",
    center_hour_id: "",
    governorate: "",
    school_name: "",
    type_of_study: "general",
    image: "",
    region: "",
    birth_date: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value, lang, isCenter);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [lang, isCenter]);

  const validateStep = useCallback((stepNumber: number): boolean => {
    const newErrors: RegisterFormErrors = {};
    let isValid = true;

    if (stepNumber === 1) {
      const nameError = validateField("name", formData.name, lang, isCenter);
      if (nameError) { newErrors.name = nameError; isValid = false; }

      const phoneError = validateField("phone", formData.phone, lang, isCenter);
      if (phoneError) { newErrors.phone = phoneError; isValid = false; }

      const birthDateError = validateField("birth_date", formData.birth_date, lang, isCenter);
      if (birthDateError) { newErrors.birth_date = birthDateError; isValid = false; }

      const regionError = validateField("region", formData.region, lang, isCenter);
      if (regionError) { newErrors.region = regionError; isValid = false; }

      const passwordError = validateField("password", formData.password, lang, isCenter);
      if (passwordError) { newErrors.password = passwordError; isValid = false; }
    } else if (stepNumber === 2) {
      const governorateError = validateField("governorate", formData.governorate, lang, isCenter);
      if (governorateError) { newErrors.governorate = governorateError; isValid = false; }

      const schoolError = validateField("school_name", formData.school_name, lang, isCenter);
      if (schoolError) { newErrors.school_name = schoolError; isValid = false; }

      const stageError = validateField("stage_id", formData.stage_id, lang, isCenter);
      if (stageError) { newErrors.stage_id = stageError; isValid = false; }

      if (isCenter) {
        const hourError = validateField("center_hour_id", formData.center_hour_id, lang, isCenter);
        if (hourError) { newErrors.center_hour_id = hourError; isValid = false; }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, lang, isCenter]);

  const setFieldValue = useCallback((name: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      phone: "",
      password: "",
      phone_parent: "",
      type_of_attendance: "online",
      gender: "male",
      stage_id: "",
      center_hour_id: "",
      governorate: "",
      school_name: "",
      type_of_study: "general",
      image: "",
      region: "",
      birth_date: "",
    });
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateStep,
    setFieldValue,
    resetForm,
    setErrors,
  };
};