import { User, Company, MembershipTier } from "@/types";

// Mock authentication using localStorage
const AUTH_KEY = "agbc_auth_user";
const COMPANY_KEY = "agbc_company";

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(AUTH_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const getCurrentCompany = (): Company | null => {
  const companyData = localStorage.getItem(COMPANY_KEY);
  return companyData ? JSON.parse(companyData) : null;
};

export const setAuthUser = (user: User, company?: Company) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  if (company) {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(COMPANY_KEY);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const updateMembershipTier = (tier: MembershipTier) => {
  const user = getCurrentUser();
  if (user) {
    user.membershipTier = tier;
    setAuthUser(user);
  }
};

export const updateCompanyProfile = (updates: Partial<Company>) => {
  const company = getCurrentCompany();
  if (company) {
    const updatedCompany = { ...company, ...updates };
    localStorage.setItem(COMPANY_KEY, JSON.stringify(updatedCompany));
  }
};
