import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Category = {
    #birthday;
    #anniversary;
    #corporate;
    #festive;
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

  let giftPacks = Map.empty<Text, GiftPack>();
  let orders = Map.empty<Text, Order>();

  public shared ({ caller }) func initialize() : async () {
    if (giftPacks.size() > 0) { return };
    let birthdayPack : GiftPack = {
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
    };

    let corporatePack : GiftPack = {
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
    };

    giftPacks.add("1", birthdayPack);
    giftPacks.add("2", corporatePack);
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
    newOrder;
  };
};
