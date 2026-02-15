/**
 * Input validation utilities to prevent XSS and malicious scripts
 */

export interface ValidationResult {
    isValid: boolean
    error?: string
}

// Regex patterns for validation
const PATTERNS = {
    // Detects script tags, event handlers, and dangerous HTML
    XSS: /<script|<\/script|javascript:|onerror=|onload=|onclick=|eval\(|expression\(|<iframe|<object|<embed/i,

    // Basic text (letters, numbers, spaces, common punctuation)
    SAFE_TEXT: /^[a-zA-Z0-9\s\-.,!?'()₦]+$/,

    // Name validation (letters, spaces, hyphens, apostrophes)
    NAME: /^[a-zA-Z\s\-']+$/,

    // Email validation
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Phone validation (Nigerian format)
    PHONE: /^[0-9+\s()-]{10,15}$/,

    // Address validation (alphanumeric with common punctuation)
    ADDRESS: /^[a-zA-Z0-9\s\-.,#/()]+$/,

    // Product name (alphanumeric with spaces and basic punctuation)
    PRODUCT_NAME: /^[a-zA-Z0-9\s\-.,&'()]+$/,

    // Price validation (numbers and decimals)
    PRICE: /^[0-9]+(\.[0-9]{1,2})?$/,

    // Description (allows more characters but no scripts)
    DESCRIPTION: /^[a-zA-Z0-9\s\-.,!?'()₦\n&]+$/,

    // Size label (numbers/letters with simple separators)
    SIZE_LABEL: /^[a-zA-Z0-9\s\-+\/.#()]+$/,
}

/**
 * Check if input contains malicious scripts
 */
export const containsMaliciousContent = (value: string): boolean => {
    return PATTERNS.XSS.test(value)
}

/**
 * Sanitize input by removing dangerous characters
 */
export const sanitizeInput = (value: string): string => {
    return value
        .replace(/<script.*?>.*?<\/script>/gi, '')
        .replace(/<.*?>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim()
}

/**
 * Validate name input (for user names, product names, etc.)
 */
export const validateName = (value: string, fieldName: string = 'Name'): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: `${fieldName} is required` }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: `${fieldName} contains invalid characters` }
    }

    if (value.length < 2) {
        return { isValid: false, error: `${fieldName} must be at least 2 characters` }
    }

    if (value.length > 100) {
        return { isValid: false, error: `${fieldName} must be less than 100 characters` }
    }

    if (!PATTERNS.NAME.test(value)) {
        return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` }
    }

    return { isValid: true }
}

/**
 * Validate product name
 */
export const validateProductName = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Product name is required' }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: 'Product name contains invalid characters' }
    }

    if (value.length < 3) {
        return { isValid: false, error: 'Product name must be at least 3 characters' }
    }

    if (value.length > 100) {
        return { isValid: false, error: 'Product name must be less than 100 characters' }
    }

    if (!PATTERNS.PRODUCT_NAME.test(value)) {
        return { isValid: false, error: 'Product name contains invalid characters. Only letters, numbers, and basic punctuation allowed' }
    }

    return { isValid: true }
}

/**
 * Validate email
 */
export const validateEmail = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Email is required' }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: 'Email contains invalid characters' }
    }

    if (!PATTERNS.EMAIL.test(value)) {
        return { isValid: false, error: 'Please enter a valid email address' }
    }

    return { isValid: true }
}

/**
 * Validate address
 */
export const validateAddress = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Address is required' }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: 'Address contains invalid characters' }
    }

    if (value.length < 5) {
        return { isValid: false, error: 'Address must be at least 5 characters' }
    }

    if (value.length > 200) {
        return { isValid: false, error: 'Address must be less than 200 characters' }
    }

    if (!PATTERNS.ADDRESS.test(value)) {
        return { isValid: false, error: 'Address contains invalid characters' }
    }

    return { isValid: true }
}

/**
 * Validate price
 */
export const validatePrice = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Price is required' }
    }

    if (!PATTERNS.PRICE.test(value)) {
        return { isValid: false, error: 'Please enter a valid price' }
    }

    const price = parseFloat(value)
    if (price < 0) {
        return { isValid: false, error: 'Price cannot be negative' }
    }

    if (price > 10000000) {
        return { isValid: false, error: 'Price is too high' }
    }

    return { isValid: true }
}

/**
 * Validate description
 */
export const validateDescription = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Description is required' }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: 'Description contains invalid characters' }
    }

    if (value.length < 10) {
        return { isValid: false, error: 'Description must be at least 10 characters' }
    }

    if (value.length > 1000) {
        return { isValid: false, error: 'Description must be less than 1000 characters' }
    }

    if (!PATTERNS.DESCRIPTION.test(value)) {
        return { isValid: false, error: 'Description contains invalid characters' }
    }

    return { isValid: true }
}

/**
 * Validate phone number
 */
export const validatePhone = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Phone number is required' }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: 'Phone number contains invalid characters' }
    }

    if (!PATTERNS.PHONE.test(value)) {
        return { isValid: false, error: 'Please enter a valid phone number' }
    }

    return { isValid: true }
}

/**
 * Validate city name
 */
export const validateCity = (value: string): ValidationResult => {
    return validateName(value, 'City')
}

/**
 * Generic text validation
 */
export const validateText = (value: string, fieldName: string, minLength: number = 1, maxLength: number = 500): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: `${fieldName} is required` }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: `${fieldName} contains invalid characters` }
    }

    if (value.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` }
    }

    if (value.length > maxLength) {
        return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` }
    }

    return { isValid: true }
}

/**
 * Validate size label (e.g., 50, 60, S, M, L, One Size)
 */
export const validateSizeLabel = (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Size label is required' }
    }

    if (containsMaliciousContent(value)) {
        return { isValid: false, error: 'Size label contains invalid characters' }
    }

    if (value.length > 20) {
        return { isValid: false, error: 'Size label must be 20 characters or less' }
    }

    if (!PATTERNS.SIZE_LABEL.test(value)) {
        return { isValid: false, error: 'Size label contains invalid characters' }
    }

    return { isValid: true }
}
