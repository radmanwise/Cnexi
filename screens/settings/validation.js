export const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'نام الزامی است';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'نام کاربری الزامی است';
    } else if (formData.username.length < 3) {
      errors.username = 'نام کاربری باید حداقل 3 کاراکتر باشد';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'فرمت ایمیل صحیح نیست';
    }
    
    if (formData.phone && !/^(\+98|0)?9\d{9}$/.test(formData.phone)) {
      errors.phone = 'شماره موبایل معتبر نیست';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };