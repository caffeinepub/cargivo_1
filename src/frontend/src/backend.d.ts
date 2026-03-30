import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface LineItem {
    description: string;
    quantity: bigint;
    unitPrice: bigint;
}
export interface ItemRequest {
    description: string;
    quantity: bigint;
}
export interface AdminProfile {
    name: string;
    joinedAt: Time;
    isAdmin: boolean;
}
export interface Activity {
    user: Principal;
    description: string;
    timestamp: Time;
}
export interface CustomerProfile {
    name: string;
    joinedAt: Time;
    isActive: boolean;
    shippingAddress: string;
}
export interface TeamMemberProfile {
    name: string;
    joinedAt: Time;
    skills: Array<string>;
}
export type UserProfile = {
    __kind__: "admin";
    admin: AdminProfile;
} | {
    __kind__: "customer";
    customer: CustomerProfile;
} | {
    __kind__: "teamMember";
    teamMember: TeamMemberProfile;
};
export interface Order {
    id: bigint;
    status: OrderStatus;
    customer: Principal;
    totalAmount: bigint;
    timestamp: Time;
    items: Array<LineItem>;
    assignedTeamMember?: Principal;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    inProduction = "inProduction",
    inReview = "inReview",
    delivered = "delivered",
    accepted = "accepted",
    quoted = "quoted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptQuote(orderId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTeamMember(user: Principal, profile: TeamMemberProfile): Promise<void>;
    assignTeamMemberToOrder(orderId: bigint, teamMember: Principal): Promise<void>;
    cancelOrder(orderId: bigint): Promise<void>;
    createAdminProfile(profile: AdminProfile): Promise<void>;
    createProfile(profile: UserProfile): Promise<void>;
    getActivityFeed(): Promise<Array<Activity>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAssignedOrders(): Promise<Array<Order>>;
    getCallerRole(): Promise<UserRole>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrders(customer: Principal): Promise<Array<Order>>;
    getOpenOrders(): Promise<Array<Order>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrderStats(): Promise<{
        shipped: bigint;
        totalOrders: bigint;
        cancelled: bigint;
        pending: bigint;
        inProduction: bigint;
        delivered: bigint;
        quoted: bigint;
    }>;
    getOwnOrders(): Promise<Array<Order>>;
    getUserActivities(user: Principal): Promise<Array<Activity>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasTeamAccess(): Promise<boolean>;
    isAuthenticated(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitQuoteRequest(items: Array<ItemRequest>): Promise<bigint>;
    submitQuoteRequestForCustomer(customer: Principal, items: Array<ItemRequest>): Promise<bigint>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateQuotePrice(orderId: bigint, items: Array<LineItem>, totalAmount: bigint): Promise<void>;
}
