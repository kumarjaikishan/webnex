import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  businessType?: string;
  message?: string;
  source?: string;
}

export const submitLead = (payload: LeadPayload) => api.post("/leads", payload);
