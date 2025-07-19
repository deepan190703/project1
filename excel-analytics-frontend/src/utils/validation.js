// Password validation utilities

export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return {
    isValid: emailRegex.test(email),
    errors: emailRegex.test(email) ? [] : ['Please enter a valid email address']
  }
}

export const validateName = (name) => {
  return {
    isValid: name.trim().length >= 2,
    errors: name.trim().length >= 2 ? [] : ['Name must be at least 2 characters long']
  }
}

export const checkPasswordStrength = (password) => {
  let score = 0
  let feedback = []
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++
  
  if (score < 3) {
    return { strength: 'weak', color: 'red', feedback: 'Weak password' }
  } else if (score < 5) {
    return { strength: 'medium', color: 'yellow', feedback: 'Medium strength' }
  } else {
    return { strength: 'strong', color: 'green', feedback: 'Strong password' }
  }
}