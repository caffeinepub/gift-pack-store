import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Category = {
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
    category : Category;
    images : [Storage.ExternalBlob];
  };

  type GiftPack = {
    id : Text;
    title : Text;
    description : Text;
    price : Int;
    category : Category;
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
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  type CatalogFilters = {
    priceRange : ?{
      min : Int;
      max : Int;
    };
    category : ?Category;
    searchTerm : ?Text;
    outOfStock : ?Bool;
  };

  type UserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    phone : Text;
    defaultAddress : DeliveryAddress;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let giftPacks = Map.empty<Text, GiftPack>();
  let orders = Map.empty<Text, Order>();
  let userOrders = Map.empty<Principal, [Order]>();
  let userCarts = Map.empty<Principal, Cart>();

  public shared ({ caller }) func initialize() : async () {
    if (giftPacks.size() > 0) { return };

    let dummyPacks = [
      {
        id = "1";
        title = "Birthday Surprise";
        description = "A perfect birthday gift pack";
        price = 1999;
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
        id = "2";
        title = "Corporate Gifting";
        description = "Ideal gift pack for corporate events";
        price = 2999;
        category = #corporate;
        items = [{
          id = "item2";
          name = "Leather Wallet";
          description = "Premium quality leather wallet";
          price = 999;
          category = #corporate;
          images = [];
        }];
        images = [];
        basketType = #woodenCrate;
        size = #large;
      },
      {
        id = "3";
        title = "Anniversary Elegance";
        description = "Elegant gifts for anniversaries";
        price = 2499;
        category = #anniversary;
        items = [{
          id = "item3";
          name = "Wine Bottle";
          description = "Fine red wine";
          price = 1299;
          category = #anniversary;
          images = [];
        }];
        images = [];
        basketType = #giftBox;
        size = #medium;
      },
      {
        id = "4";
        title = "Festive Delight";
        description = "Festive essentials pack";
        price = 1799;
        category = #festive;
        items = [{
          id = "item4";
          name = "Sweets Box";
          description = "Traditional Indian sweets";
          price = 699;
          category = #festive;
          images = [];
        }];
        images = [];
        basketType = #wickerBasket;
        size = #small;
      },
      {
        id = "5";
        title = "Sympathy Care Pack";
        description = "Care package for difficult times";
        price = 2199;
        category = #sympathy;
        items = [{
          id = "item5";
          name = "Comfort Foods";
          description = "Assorted comfort foods";
          price = 899;
          category = #sympathy;
          images = [];
        }];
        images = [];
        basketType = #giftBox;
        size = #medium;
      },
      {
        id = "6";
        title = "Wellness Hamper";
        description = "Health and wellness essentials";
        price = 2699;
        category = #wellness;
        items = [{
          id = "item6";
          name = "Organic Tea Set";
          description = "Variety of organic teas";
          price = 599;
          category = #wellness;
          images = [];
        }];
        images = [];
        basketType = #woodenCrate;
        size = #large;
      },
      {
        id = "7";
        title = "Customizable Pack";
        description = "Fully customizable gift pack";
        price = 3499;
        category = #custom;
        items = [];
        images = [];
        basketType = #giftBox;
        size = #large;
      },
      {
        id = "8";
        title = "Elite Corporate Hamper";
        description = "Premium gifts for top clients";
        price = 4999;
        category = #corporate;
        items = [{
          id = "item8";
          name = "Cufflink Set";
          description = "Luxury cufflinks";
          price = 1999;
          category = #corporate;
          images = [];
        }];
        images = [];
        basketType = #wickerBasket;
        size = #large;
      },
      {
        id = "9";
        title = "Birthday Bash";
        description = "Fun birthday pack for all ages";
        price = 1599;
        category = #birthday;
        items = [{
          id = "item9";
          name = "Party Supplies";
          description = "Balloons, hats, and more";
          price = 299;
          category = #birthday;
          images = [];
        }];
        images = [];
        basketType = #wickerBasket;
        size = #small;
      },
      {
        id = "10";
        title = "Anniversary Luxury";
        description = "High-end anniversary gifts";
        price = 3999;
        category = #anniversary;
        items = [{
          id = "item10";
          name = "Jewelry Box";
          description = "Elegant jewelry holder";
          price = 2499;
          category = #anniversary;
          images = [];
        }];
        images = [];
        basketType = #giftBox;
        size = #large;
      },
    ];

    for (pack in dummyPacks.values()) {
      giftPacks.add(pack.id, pack);
    };
  };

  public query ({ caller }) func getAllGiftPacks() : async [GiftPack] {
    giftPacks.values().toArray().sort();
  };

  public query ({ caller }) func getGiftPackById(id : Text) : async ?GiftPack {
    giftPacks.get(id);
  };

  public query ({ caller }) func searchGiftPacks(searchTerm : Text) : async [GiftPack] {
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
    giftPacks.values().toArray().sort().filter(
      func(pack) {
        switch (filters.category) {
          case (null) { true };
          case (?category) { pack.category == category };
        };
      }
    );
  };

  public shared ({ caller }) func createOrder(userId : Text, items : [CartItem], deliveryAddress : DeliveryAddress, totalAmount : Int, basketType : BasketType, size : Size, packingType : PackType, messageCard : ?Text) : async Order {
    let orderId = userId.concat("orderId");

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

  // User Profile Functions

  public shared ({ caller }) func createOrUpdateUserProfile(name : Text, email : Text, phone : Text, address : DeliveryAddress) : async UserProfile {
    let profile : UserProfile = {
      principal = caller;
      name;
      email;
      phone;
      defaultAddress = address;
    };

    userProfiles.add(caller, profile);
    profile;
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  // Get Order History for Authenticated User (Backend not for public use)
  public query ({ caller }) func getOrderHistory() : async [Order] {
    switch (userOrders.get(caller)) {
      case (null) { [] };
      case (?orders) { orders };
    };
  };

  // Get Order History for Any Principal (for Admins, public query)
  public query ({ caller }) func getOrderHistoryForPrincipal(principal : Principal) : async [Order] {
    switch (userOrders.get(principal)) {
      case (null) { [] };
      case (?orders) { orders };
    };
  };

  // Cart Persistence
  public shared ({ caller }) func saveCart(cart : Cart) : async () {
    userCarts.add(caller, cart);
  };

  public query ({ caller }) func getCart() : async ?Cart {
    userCarts.get(caller);
  };

  public shared ({ caller }) func clearCart() : async () {
    userCarts.remove(caller);
  };
};
