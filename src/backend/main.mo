import Int "mo:core/Int";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

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

  module GiftPack {
    public func compare(pack1 : GiftPack, pack2 : GiftPack) : Order.Order {
      Text.compare(pack1.id, pack2.id);
    };
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

  public type UserProfile = {
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

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Int;
    category : CategoryType;
    images : [Text];
  };

  type PasswordHash = [Nat8];

  let coupons = Map.empty<Text, Coupon>();
  let couponUsage = Map.empty<Text, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let giftPacks = Map.empty<Text, GiftPack>();
  let orders = Map.empty<Text, Order>();
  let payments = Map.empty<Text, RazorpayPayment>();
  let userOrders = Map.empty<Principal, [Order]>();
  let userCarts = Map.empty<Principal, Cart>();
  let contactSubmissions = Map.empty<Text, ContactSubmission>();
  let categories = Map.empty<Text, Category>();
  let products = Map.empty<Text, Product>();

  let deliveryPincodes = Map.fromIter(
    [
      ("110001", true),
      ("110002", true),
      ("110003", true),
      ("110004", true),
      ("110005", true),
      ("400001", true),
      ("400002", true),
      ("400003", true),
      ("560001", true),
      ("560002", true),
      ("560003", true),
      ("600001", true),
      ("600002", true),
      ("600003", true),
      ("700001", true),
      ("700002", true),
      ("700003", true),
    ].values()
  );

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize the system");
    };

    if (giftPacks.size() > 0) { return };

    let newGiftPacks = [
      {
        id = "1";
        title = "Birthday Surprise";
        description = "A perfect birthday gift pack";
        price = 1999;
        discount = 0;
        category = #birthday;
        items = [{
          id = "item1";
          name = "Chocolate Box";
          description = "Delicious assorted chocolates";
          price = 499;
          category = #birthday;
          images = [];
        }];
        images = [];
        basketType = #wickerBasket;
        size = #medium;
      },
      {
        id = "11";
        title = "Wellness Retreat";
        description = "Relax and rejuvenate with this soothing wellness gift pack.";
        price = 3499;
        discount = 10;
        category = #wellness;
        items = [
          {
            id = "item11a";
            name = "Aromatherapy Diffuser";
            description = "Provides relaxation and tranquility";
            price = 1400;
            category = #wellness;
            images = [];
          },
          {
            id = "item11b";
            name = "Natural Bath Bombs";
            description = "Fizzy delights for relaxing baths";
            price = 599;
            category = #wellness;
            images = [];
          },
        ];
        images = [];
        basketType = #woodenCrate;
        size = #large;
      },
      {
        id = "12";
        title = "Eco-Friendly Corporate Set";
        description = "Thoughtful and sustainable corporate gifts";
        price = 2999;
        discount = 15;
        category = #corporate;
        items = [
          {
            id = "item12a";
            name = "Bamboo Desk Organizer";
            description = "Stylish eco-friendly office essential";
            price = 1099;
            category = #corporate;
            images = [];
          },
          {
            id = "item12b";
            name = "Seed Paper Stationery";
            description = "Plantable notepads and pens";
            price = 799;
            category = #corporate;
            images = [];
          },
        ];
        images = [];
        basketType = #giftBox;
        size = #medium;
      },
      {
        id = "13";
        title = "Festive Gourmet Basket";
        description = "Delicious delights for festive celebrations";
        price = 2599;
        discount = 5;
        category = #festive;
        items = [
          {
            id = "item13a";
            name = "Gourmet Cookie Tin";
            description = "Assorted premium cookies";
            price = 949;
            category = #festive;
            images = [];
          },
          {
            id = "item13b";
            name = "Exotic Dry Fruit Box";
            description = "Handpicked nuts and dried fruits";
            price = 1299;
            category = #festive;
            images = [];
          },
        ];
        images = [];
        basketType = #wickerBasket;
        size = #large;
      },
    ];

    for (pack in newGiftPacks.values()) {
      giftPacks.add(pack.id, pack);
    };
  };

  public shared ({ caller }) func createCoupon(
    code : Text,
    discountPercentage : Nat,
    minDiscountPercentage : ?Nat,
    maxDiscountAmount : ?Nat,
    expirationDate : Time.Time,
    totalQuantity : Nat,
  ) : async Coupon {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create coupons");
    };

    let coupon : Coupon = {
      code;
      discountPercentage;
      minDiscountPercentage;
      maxDiscountAmount;
      expirationDate;
      totalQuantity;
      remainingQuantity = totalQuantity;
    };

    coupons.add(code, coupon);
    coupon;
  };

  public shared ({ caller }) func validateCoupon(code : Text) : async Coupon {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can validate coupons");
    };

    switch (coupons.get(code)) {
      case (null) {
        Runtime.trap("Coupon code not found or expired");
      };
      case (?coupon) {
        if (Time.now() > coupon.expirationDate) {
          Runtime.trap("Coupon has expired");
        };
        if (coupon.remainingQuantity == 0) {
          Runtime.trap("Coupon has been fully redeemed");
        };
        coupon;
      };
    };
  };

  public query ({ caller }) func getAllGiftPacks() : async [GiftPack] {
    // Public access - catalog browsing allowed for all users including guests
    giftPacks.values().toArray().sort();
  };

  public query ({ caller }) func getGiftPackById(id : Text) : async ?GiftPack {
    // Public access - catalog browsing allowed for all users including guests
    giftPacks.get(id);
  };

  public query ({ caller }) func searchGiftPacks(searchTerm : Text) : async [GiftPack] {
    // Public access - catalog browsing allowed for all users including guests
    let packs = giftPacks.values().toArray().sort();
    packs.filter(
      func(pack) {
        let titleContainsTerm = pack.title.toLower().contains(#text(searchTerm.toLower()));
        let descContainsTerm = pack.description.toLower().contains(#text(searchTerm.toLower()));
        titleContainsTerm or descContainsTerm;
      }
    );
  };

  public query ({ caller }) func filterGiftPacks(filters : CatalogFilters) : async [GiftPack] {
    // Public access - catalog browsing allowed for all users including guests
    giftPacks.values().toArray().sort().filter(
      func(pack) {
        switch (filters.category) {
          case (null) { true };
          case (?category) { pack.category == category };
        };
      }
    );
  };

  func decrementCouponQuantity(code : Text) : Nat {
    switch (coupons.get(code)) {
      case (null) { 0 };
      case (?coupon) {
        let newQuantity = if (coupon.remainingQuantity > 0) {
          coupon.remainingQuantity - 1;
        } else { 0 : Nat };

        let updatedCoupon = { coupon with remainingQuantity = newQuantity };
        coupons.add(code, updatedCoupon);
        newQuantity;
      };
    };
  };

  func recordCouponUsage(userId : Text, code : Text) : () {
    switch (couponUsage.get(userId)) {
      case (null) {
        couponUsage.add(userId, [code]);
      };
      case (?userCoupons) {
        let newCoupons = userCoupons.concat([code]);
        couponUsage.add(userId, newCoupons);
      };
    };
  };

  public shared ({ caller }) func createOrder(
    userId : Text,
    items : [CartItem],
    deliveryAddress : DeliveryAddress,
    totalAmount : Int,
    basketType : BasketType,
    size : Size,
    packingType : PackType,
    messageCard : ?Text,
    paymentId : Text,
    couponCode : ?Text,
  ) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let orderId = userId.concat("orderId");

    switch (couponCode) {
      case (null) {};
      case (?code) {
        ignore decrementCouponQuantity(code);
        recordCouponUsage(userId, code);
      };
    };

    let newOrder : Order = {
      id = orderId;
      userId;
      items;
      deliveryAddress;
      totalAmount;
      status = #pending;
      createdAt = Time.now();
      basketType;
      size;
      packingType;
      messageCard;
      paymentId;
    };

    orders.add(orderId, newOrder);

    switch (userOrders.get(caller)) {
      case (null) {
        userOrders.add(caller, [newOrder]);
      };
      case (?currentOrders) {
        let updatedOrders = [newOrder].concat(currentOrders);
        userOrders.add(caller, updatedOrders);
      };
    };

    newOrder;
  };

  public shared ({ caller }) func storePayment(paymentId : Text, amount : Int, status : Text) : async RazorpayPayment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can store payments");
    };

    let payment : RazorpayPayment = {
      paymentId;
      payer = caller;
      amount;
      status;
    };

    payments.add(paymentId, payment);
    payment;
  };

  public shared ({ caller }) func createOrUpdateUserProfile(
    name : Text,
    email : Text,
    phone : Text,
    address : DeliveryAddress,
    pincode : Text,
  ) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };

    let profile : UserProfile = {
      principal = caller;
      name;
      email;
      phone;
      defaultAddress = address;
      pincode;
    };

    userProfiles.add(caller, profile);
    profile;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func isPincodeServiceable(pincode : Text) : async Bool {
    // Public access - needed for checkout flow before authentication
    switch (deliveryPincodes.get(pincode)) {
      case (?isServiceable) { isServiceable };
      case (null) { false };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    switch (userOrders.get(caller)) {
      case (null) { [] };
      case (?orders) { orders };
    };
  };

  public query ({ caller }) func getOrderHistoryForPrincipal(recipient : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view other users' order history");
    };

    switch (userOrders.get(recipient)) {
      case (null) { [] };
      case (?orders) { orders };
    };
  };

  public shared ({ caller }) func saveCart(cart : Cart) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save carts");
    };

    userCarts.add(caller, cart);
  };

  public shared ({ caller }) func updateCartItemQuantity(packId : Text, newQuantity : Nat) : async ?Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };

    switch (userCarts.get(caller)) {
      case (null) { null };
      case (?cart) {
        let updatedItems = cart.items.map(
          func(item) {
            if (item.packId == packId) { { item with quantity = newQuantity } } else { item };
          }
        );
        let updatedCart = { cart with items = updatedItems };
        userCarts.add(caller, updatedCart);
        ?updatedCart;
      };
    };
  };

  public query ({ caller }) func getCart() : async ?Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view carts");
    };

    userCarts.get(caller);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear carts");
    };

    userCarts.remove(caller);
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : Text, message : Text) : async () {
    // Public access - contact form should be accessible to all including guests
    let submission : ContactSubmission = {
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(email.concat(phone), submission);
  };

  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };

    contactSubmissions.values().toArray();
  };

  public shared ({ caller }) func createCategory(name : Text, description : Text) : async Category {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };

    let category : Category = {
      name;
      description;
    };

    categories.add(name, category);
    category;
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    // Public access - category browsing allowed for all users including guests
    categories.values().toArray();
  };

  public shared ({ caller }) func createProduct(
    id : Text,
    name : Text,
    description : Text,
    price : Int,
    category : CategoryType,
    images : [Text],
  ) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let product : Product = {
      id;
      name;
      description;
      price;
      category;
      images;
    };

    products.add(id, product);
    product;
  };

  public shared ({ caller }) func updateProduct(
    id : Text,
    name : Text,
    description : Text,
    price : Int,
    category : CategoryType,
    images : [Text],
  ) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let updatedProduct : Product = {
      id;
      name;
      description;
      price;
      category;
      images;
    };

    products.add(id, updatedProduct);
    updatedProduct;
  };

  public query ({ caller }) func getProductById(id : Text) : async ?Product {
    // Public access - product browsing allowed for all users including guests
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    // Public access - product browsing allowed for all users including guests
    products.values().toArray();
  };

  public shared ({ caller }) func createGiftPack(
    id : Text,
    title : Text,
    description : Text,
    price : Int,
    discount : Nat,
    category : CategoryType,
    items : [GiftItem],
    images : [Storage.ExternalBlob],
    basketType : BasketType,
    size : Size,
  ) : async GiftPack {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create gift packs");
    };

    let pack : GiftPack = {
      id;
      title;
      description;
      price;
      discount;
      category;
      items;
      images;
      basketType;
      size;
    };

    giftPacks.add(id, pack);
    pack;
  };

  public shared ({ caller }) func updateGiftPack(
    id : Text,
    title : Text,
    description : Text,
    price : Int,
    discount : Nat,
    category : CategoryType,
    items : [GiftItem],
    images : [Storage.ExternalBlob],
    basketType : BasketType,
    size : Size,
  ) : async GiftPack {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gift packs");
    };

    let updatedPack : GiftPack = {
      id;
      title;
      description;
      price;
      discount;
      category;
      items;
      images;
      basketType;
      size;
    };

    giftPacks.add(id, updatedPack);
    updatedPack;
  };

  public shared ({ caller }) func deleteGiftPack(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gift packs");
    };

    switch (giftPacks.get(id)) {
      case (null) {
        Runtime.trap("Gift pack with id " # id # " does not exist");
      };
      case (?_) {
        giftPacks.remove(id);
      };
    };
  };
};
