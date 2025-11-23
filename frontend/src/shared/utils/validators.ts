// Utilitários de validação para o sistema

import type { ValidationResult, ValidationError } from '@shared/types';

/**
 * Validações de Email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validações de Telefone
 */
export const validatePhone = (phone: string): boolean => {
  // Remove caracteres especiais
  const cleanPhone = phone.replace(/\D/g, '');
  // Valida se tem entre 10 e 11 dígitos (padrão brasileiro)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Validações de CEP
 */
export const validateZipCode = (zipCode: string): boolean => {
  const cleanZip = zipCode.replace(/\D/g, '');
  return cleanZip.length === 8;
};

/**
 * Validações de Preço
 */
export const validatePrice = (price: number | string): boolean => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(num) && num > 0;
};

/**
 * Validações de Quantidade/Estoque
 */
export const validateQuantity = (quantity: number | string): boolean => {
  const num = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  return !isNaN(num) && num >= 0 && Number.isInteger(num);
};

/**
 * Validações de String vazia
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validações de comprimento mínimo
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Validações de comprimento máximo
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Validações de Endereço completo
 */
export const validateAddress = (address: {
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(address.street || '')) {
    errors.push({ field: 'street', message: 'Rua é obrigatória' });
  }

  if (!validateRequired(address.number || '')) {
    errors.push({ field: 'number', message: 'Número é obrigatório' });
  }

  if (!validateRequired(address.neighborhood || '')) {
    errors.push({ field: 'neighborhood', message: 'Bairro é obrigatório' });
  }

  if (!validateRequired(address.city || '')) {
    errors.push({ field: 'city', message: 'Cidade é obrigatória' });
  }

  if (!validateRequired(address.state || '')) {
    errors.push({ field: 'state', message: 'Estado é obrigatório' });
  }

  if (!validateZipCode(address.zipCode || '')) {
    errors.push({ field: 'zipCode', message: 'CEP inválido' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validações de Produto
 */
export const validateProduct = (product: {
  name?: string;
  description?: string;
  price?: number | string;
  stock?: number | string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(product.name || '')) {
    errors.push({ field: 'name', message: 'Nome do produto é obrigatório' });
  } else if (!validateMinLength(product.name || '', 3)) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 3 caracteres' });
  }

  if (!validatePrice(product.price || 0)) {
    errors.push({ field: 'price', message: 'Preço deve ser um valor positivo' });
  }

  if (!validateQuantity(product.stock || 0)) {
    errors.push({ field: 'stock', message: 'Estoque deve ser um número inteiro não negativo' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validações de Usuário/Login
 */
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(email)) {
    errors.push({ field: 'email', message: 'Email é obrigatório' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Email inválido' });
  }

  if (!validateRequired(password)) {
    errors.push({ field: 'password', message: 'Senha é obrigatória' });
  } else if (!validateMinLength(password, 6)) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validações de Registro
 */
export const validateRegisterForm = (data: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.name || '')) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  } else if (!validateMinLength(data.name || '', 3)) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 3 caracteres' });
  }

  if (!validateRequired(data.email || '')) {
    errors.push({ field: 'email', message: 'Email é obrigatório' });
  } else if (!validateEmail(data.email || '')) {
    errors.push({ field: 'email', message: 'Email inválido' });
  }

  if (!validatePhone(data.phone || '')) {
    errors.push({ field: 'phone', message: 'Telefone inválido' });
  }

  if (!validateRequired(data.password || '')) {
    errors.push({ field: 'password', message: 'Senha é obrigatória' });
  } else if (!validateMinLength(data.password || '', 6)) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' });
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Senhas não conferem' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validações de Código de Cupom
 */
export const validateCouponCode = (code: string): boolean => {
  // Código deve ter entre 3 e 20 caracteres, apenas letras e números
  const couponRegex = /^[A-Z0-9]{3,20}$/i;
  return couponRegex.test(code);
};

/**
 * Formata números para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata telefone brasileiro
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  }
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  return phone;
};

/**
 * Formata CEP
 */
export const formatZipCode = (zipCode: string): string => {
  const cleanZip = zipCode.replace(/\D/g, '');
  if (cleanZip.length === 8) {
    return `${cleanZip.slice(0, 5)}-${cleanZip.slice(5)}`;
  }
  return zipCode;
};

/**
 * Extrai erro principal de um array de erros
 */
export const getFirstError = (errors: ValidationError[]): string | null => {
  return errors.length > 0 ? errors[0].message : null;
};

/**
 * Retorna erro de um campo específico
 */
export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(e => e.field === field);
  return error ? error.message : null;
};
