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
export interface GiftItem {
    id: string;
    name: string;
    description: string;
    category: Category;
    price: bigint;
    images: Array<ExternalBlob>;
}
export type Time = bigint;
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
    items: Array<CartItem>;
}
export interface GiftPack {
    id: string;
    basketType: BasketType;
    title: string;
    size: Size;
    description: string;
    category: Category;
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
export interface CatalogFilters {
    outOfStock?: boolean;
    priceRange?: {
        max: bigint;
        min: bigint;
    };
    searchTerm?: string;
    category?: Category;
}
export enum BasketType {
    woodenCrate = "woodenCrate",
    wickerBasket = "wickerBasket",
    giftBox = "giftBox"
}
export enum Category {
    anniversary = "anniversary",
    custom = "custom",
    festive = "festive",
    birthday = "birthday",
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
    createOrder(userId: string, items: Array<CartItem>, deliveryAddress: DeliveryAddress, totalAmount: bigint, basketType: BasketType, size: Size, packingType: PackType, messageCard: string | null): Promise<Order>;
    filterGiftPacks(filters: CatalogFilters): Promise<Array<GiftPack>>;
    getAllGiftPacks(): Promise<Array<GiftPack>>;
    getGiftPackById(id: string): Promise<GiftPack | null>;
    initialize(): Promise<void>;
    searchGiftPacks(searchTerm: string): Promise<Array<GiftPack>>;
}
