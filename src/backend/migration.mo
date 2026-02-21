import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type CategoryType = {
    #birthday;
    #anniversary;
    #corporate;
    #festive;
    #sympathy;
    #wellness;
    #custom;
  };

  type BasketType = {
    #wickerBasket;
    #woodenCrate;
    #giftBox;
  };

  type Size = {
    #small;
    #medium;
    #large;
  };

  type PackType = {
    #wrapStyle1;
    #wrapStyle2;
    #ribbonColor1;
    #ribbonColor2;
  };

  type GiftItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Int;
    category : CategoryType;
    images : [Storage.ExternalBlob];
  };

  type GiftPack = {
    id : Text;
    title : Text;
    description : Text;
    price : Int;
    discount : Nat;
    category : CategoryType;
    items : [GiftItem];
    images : [Storage.ExternalBlob];
    basketType : BasketType;
    size : Size;
  };

  type CartItem = {
    packId : Text;
    quantity : Nat;
    customMessage : ?Text;
    wrappingOption : ?Text;
  };

  type Cart = {
    items : [CartItem];
    userId : Text;
    basketType : BasketType;
    size : Size;
    packingType : PackType;
    messageCard : ?Text;
  };

  type DeliveryAddress = {
    id : Text;
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
    phone : Text;
  };

  type RazorpayPayment = {
    paymentId : Text;
    payer : Principal;
    amount : Int;
    status : Text;
  };

  type CatalogFilters = {
    priceRange : ?{
      min : Int;
      max : Int;
    };
    category : ?CategoryType;
    searchTerm : ?Text;
    outOfStock : ?Bool;
  };

  type Order = {
    id : Text;
    userId : Text;
    items : [CartItem];
    deliveryAddress : DeliveryAddress;
    totalAmount : Int;
    status : OrderStatus;
    createdAt : Time.Time;
    basketType : BasketType;
    size : Size;
    packingType : PackType;
    messageCard : ?Text;
    paymentId : Text;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  type UserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    phone : Text;
    defaultAddress : DeliveryAddress;
    pincode : Text;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type Category = {
    name : Text;
    description : Text;
  };

  type Coupon = {
    code : Text;
    discountPercentage : Nat;
    minDiscountPercentage : ?Nat;
    maxDiscountAmount : ?Nat;
    expirationDate : Time.Time;
    totalQuantity : Nat;
    remainingQuantity : Nat;
  };

  type NewProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Int;
    category : CategoryType;
    images : [Text];
  };

  type NewActor = {
    coupons : Map.Map<Text, Coupon>;
    couponUsage : Map.Map<Text, [Text]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    giftPacks : Map.Map<Text, GiftPack>;
    orders : Map.Map<Text, Order>;
    payments : Map.Map<Text, RazorpayPayment>;
    userOrders : Map.Map<Principal, [Order]>;
    userCarts : Map.Map<Principal, Cart>;
    contactSubmissions : Map.Map<Text, ContactSubmission>;
    categories : Map.Map<Text, Category>;
    products : Map.Map<Text, NewProduct>;
    deliveryPincodes : Map.Map<Text, Bool>;
  };

  type OldProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Int;
    category : CategoryType;
    imageUrl : Text;
  };

  type OldActor = {
    coupons : Map.Map<Text, Coupon>;
    couponUsage : Map.Map<Text, [Text]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    giftPacks : Map.Map<Text, GiftPack>;
    orders : Map.Map<Text, Order>;
    payments : Map.Map<Text, RazorpayPayment>;
    userOrders : Map.Map<Principal, [Order]>;
    userCarts : Map.Map<Principal, Cart>;
    contactSubmissions : Map.Map<Text, ContactSubmission>;
    categories : Map.Map<Text, Category>;
    products : Map.Map<Text, OldProduct>;
    deliveryPincodes : Map.Map<Text, Bool>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Text, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        { oldProduct with images = [oldProduct.imageUrl] };
      }
    );
    { old with products = newProducts };
  };
};
