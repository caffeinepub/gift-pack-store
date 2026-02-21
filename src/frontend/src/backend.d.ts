import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    principal: Principal;
    name: string;
    email: string;
    phone: string;
    pincode: string;
    defaultAddress: DeliveryAddress;
}
export interface RazorpayPayment {
    status: string;
    paymentId: string;
    payer: Principal;
    amount: bigint;
}
export interface Category {
    name: string;
    description: string;
}
export type Time = bigint;
export interface CatalogFilters {
    outOfStock?: boolean;
    priceRange?: {
        max: bigint;
        min: bigint;
    };
    searchTerm?: string;
    category?: CategoryType;
}
export interface Coupon {
    code: string;
    expirationDate: Time;
    discountPercentage: bigint;
    minDiscountPercentage?: bigint;
    remainingQuantity: bigint;
    totalQuantity: bigint;
    maxDiscountAmount?: bigint;
}
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface Order {
    id: string;
    basketType: BasketType;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    userId: string;
    packingType: PackType;
    createdAt: Time;
    size: Size;
    messageCard?: string;
    totalAmount: bigint;
    paymentId: string;
    items: Array<CartItem>;
}
export interface Cart {
    basketType: BasketType;
    userId: string;
    packingType: PackType;
    size: Size;
    messageCard?: string;
    items: Array<CartItem>;
}
export interface GiftPack {
    id: string;
    basketType: BasketType;
    title: string;
    size: Size;
    description: string;
    discount: bigint;
    category: CategoryType;
    items: Array<GiftItem>;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface DeliveryAddress {
    id: string;
    street: string;
    city: string;
    name: string;
    state: string;
    phone: string;
    pincode: string;
}
export interface CartItem {
    wrappingOption?: string;
    customMessage?: string;
    quantity: bigint;
    packId: string;
}
export interface GiftItem {
    id: string;
    name: string;
    description: string;
    category: CategoryType;
    price: bigint;
    images: Array<ExternalBlob>;
}
export enum BasketType {
    woodenCrate = "woodenCrate",
    wickerBasket = "wickerBasket",
    giftBox = "giftBox"
}
export enum CategoryType {
    anniversary = "anniversary",
    custom = "custom",
    festive = "festive",
    birthday = "birthday",
    wellness = "wellness",
    sympathy = "sympathy",
    corporate = "corporate"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PackType {
    ribbonColor1 = "ribbonColor1",
    ribbonColor2 = "ribbonColor2",
    wrapStyle1 = "wrapStyle1",
    wrapStyle2 = "wrapStyle2"
}
export enum Size {
    large = "large",
    small = "small",
    medium = "medium"
}
export interface backendInterface {
    clearCart(): Promise<void>;
    createCategory(name: string, description: string): Promise<Category>;
    createCoupon(code: string, discountPercentage: bigint, minDiscountPercentage: bigint | null, maxDiscountAmount: bigint | null, expirationDate: Time, totalQuantity: bigint): Promise<Coupon>;
    createOrUpdateUserProfile(name: string, email: string, phone: string, address: DeliveryAddress, pincode: string): Promise<UserProfile>;
    createOrder(userId: string, items: Array<CartItem>, deliveryAddress: DeliveryAddress, totalAmount: bigint, basketType: BasketType, size: Size, packingType: PackType, messageCard: string | null, paymentId: string, couponCode: string | null): Promise<Order>;
    createProduct(id: string, title: string, description: string, price: bigint, discount: bigint, category: CategoryType, images: Array<ExternalBlob>, basketType: BasketType, size: Size): Promise<GiftPack>;
    decrementCouponQuantity(code: string): Promise<bigint>;
    filterGiftPacks(filters: CatalogFilters): Promise<Array<GiftPack>>;
    getAllCategories(): Promise<Array<Category>>;
    getAllGiftPacks(): Promise<Array<GiftPack>>;
    getCart(): Promise<Cart | null>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getGiftPackById(id: string): Promise<GiftPack | null>;
    getOrderHistory(): Promise<Array<Order>>;
    getOrderHistoryForPrincipal(recipient: Principal): Promise<Array<Order>>;
    getUserProfile(): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isPincodeServiceable(pincode: string): Promise<boolean>;
    recordCouponUsage(userId: string, code: string): Promise<void>;
    saveCart(cart: Cart): Promise<void>;
    searchGiftPacks(searchTerm: string): Promise<Array<GiftPack>>;
    storePayment(paymentId: string, amount: bigint, status: string): Promise<RazorpayPayment>;
    submitContactForm(name: string, email: string, phone: string, message: string): Promise<void>;
    updateCartItemQuantity(packId: string, newQuantity: bigint): Promise<Cart | null>;
    validateCoupon(code: string): Promise<Coupon>;
}
