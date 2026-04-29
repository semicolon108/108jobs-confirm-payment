/**
 * Authentication utilities for companyId management
 */

export const COMPANY_ID_KEY = 'paymentCode'

/**
 * Check and set companyId from query parameters to localStorage
 * @param urlParams - URLSearchParams object from current route
 * @returns boolean - true if companyId was found and set, false otherwise
 */
export function setCompanyIdFromQuery(urlParams: URLSearchParams): boolean {
  const companyId = urlParams.get('paymentCode')
  
  if (companyId) {
    localStorage.setItem(COMPANY_ID_KEY, companyId)
    return true
  }
  
  return false
}

/**
 * Get companyId from localStorage
 * @returns string | null - companyId if exists, null otherwise
 */
export function getCompanyId(): string | null {
  return localStorage.getItem(COMPANY_ID_KEY)
}

/**
 * Check if companyId exists in localStorage
 * @returns boolean - true if companyId exists, false otherwise
 */
export function hasCompanyId(): boolean {
  return !!getCompanyId()
}

/**
 * Remove companyId from localStorage
 */
export function clearCompanyId(): void {
  localStorage.removeItem(COMPANY_ID_KEY)
}
