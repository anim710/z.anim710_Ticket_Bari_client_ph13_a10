export interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  transportType: "Bus" | "Train" | "Plane" | "Launch";
  price: number;
  quantity: number;
  departureDate: string; // ISO Date string
  perks: string[];
  image: string;
  vendorName: string;
  vendorEmail: string;
  verificationStatus: "approved" | "pending" | "rejected";
  isAdvertised: boolean;
  isHidden: boolean;
  createdAt: string; // ISO Date string
}
export type Tickets = Ticket[];