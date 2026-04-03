import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  // Order status type
  type OrderStatus = {
    #pending;
    #inReview;
    #quoted;
    #accepted;
    #inProduction;
    #shipped;
    #delivered;
    #cancelled;
  };

  // Order line item type
  type LineItem = {
    description : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  type ItemRequest = {
    description : Text;
    quantity : Nat;
  };

  // Order type
  public type Order = {
    id : Nat;
    customer : Principal;
    items : [LineItem];
    totalAmount : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
    assignedTeamMember : ?Principal;
  };

  let orders = Map.empty<Nat, Order>();

  // Activity type
  type Activity = {
    user : Principal;
    description : Text;
    timestamp : Time.Time;
  };

  let activityFeed = List.empty<Activity>();
  var orderIdCounter = 1;

  // Helper function to add activity
  func addActivity(user : Principal, description : Text) {
    let activity : Activity = {
      user;
      description;
      timestamp = Time.now();
    };
    activityFeed.add(activity);
  };

  // User role types
  type AdminProfile = {
    name : Text;
    isAdmin : Bool;
    joinedAt : Time.Time;
  };

  type CustomerProfile = {
    name : Text;
    shippingAddress : Text;
    joinedAt : Time.Time;
    isActive : Bool;
  };

  type TeamMemberProfile = {
    name : Text;
    skills : [Text];
    joinedAt : Time.Time;
  };

  public type UserProfile = {
    #admin : AdminProfile;
    #customer : CustomerProfile;
    #teamMember : TeamMemberProfile;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // A helper function to check if caller is team member
  func isTeamMember(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile) {
          case (#teamMember(_)) { true };
          case (_) { false };
        };
      };
    };
  };

  // Helper function to check if caller is customer
  func isCustomer(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile) {
          case (#customer(_)) { true };
          case (_) { false };
        };
      };
    };
  };

  // Authorization System
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Order Functions

  public shared ({ caller }) func submitQuoteRequest(items : [ItemRequest]) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only customers can submit quotes");
    };

    // Verify caller is a customer
    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can submit quote requests");
    };

    let orderId = orderIdCounter;
    orderIdCounter += 1;

    let lineItems = items.map(
      func(item) {
        {
          description = item.description;
          quantity = item.quantity;
          unitPrice = 0;
        };
      }
    );

    let order : Order = {
      id = orderId;
      customer = caller;
      items = lineItems;
      totalAmount = 0;
      status = #pending;
      timestamp = Time.now();
      assignedTeamMember = null;
    };

    orders.add(orderId, order);
    addActivity(caller, "Submitted new quote request");
    orderId;
  };

  public shared ({ caller }) func submitQuoteRequestForCustomer(customer : Principal, items : [ItemRequest]) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can submit quotes for customers");
    };

    let orderId = orderIdCounter;
    orderIdCounter += 1;

    let lineItems = items.map(
      func(item) {
        {
          description = item.description;
          quantity = item.quantity;
          unitPrice = 0;
        };
      }
    );

    let order : Order = {
      id = orderId;
      customer;
      items = lineItems;
      totalAmount = 0;
      status = #pending;
      timestamp = Time.now();
      assignedTeamMember = null;
    };

    orders.add(orderId, order);
    addActivity(caller, "Submitted new quote for customer: " # customer.toText());
    orderId;
  };

  public shared ({ caller }) func updateQuotePrice(orderId : Nat, items : [LineItem], totalAmount : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update quote prices");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : Order = {
          order with
          items;
          totalAmount;
          status = #quoted;
        };
        orders.add(orderId, updatedOrder);
        addActivity(caller, "Updated quote price for order " # orderId.toText());
      };
    };
  };

  public shared ({ caller }) func acceptQuote(orderId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only customers can accept quotes");
    };

    // Verify caller is a customer
    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can accept quotes");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.customer != caller) {
          Runtime.trap("Unauthorized: Only order owner can accept quote");
        };
        if (order.status != #quoted) {
          Runtime.trap("Invalid operation: Order must be in quoted status");
        };
        let updatedOrder : Order = {
          order with
          status = #accepted;
        };
        orders.add(orderId, updatedOrder);
        addActivity(caller, "Accepted quote for order " # orderId.toText());
      };
    };
  };

  public shared ({ caller }) func cancelOrder(orderId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only customers can cancel orders");
    };

    // Verify caller is a customer
    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can cancel orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.customer != caller) {
          Runtime.trap("Unauthorized: Only order owner can cancel");
        };
        let updatedOrder : Order = {
          order with
          status = #cancelled;
        };
        orders.add(orderId, updatedOrder);
        addActivity(caller, "Cancelled order " # orderId.toText());
      };
    };
  };

  public shared ({ caller }) func assignTeamMemberToOrder(orderId : Nat, teamMember : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign team members");
    };

    if (not isTeamMember(teamMember)) {
      Runtime.trap("Invalid operation: User is not a team member");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : Order = {
          order with
          assignedTeamMember = ?teamMember;
        };
        orders.add(orderId, updatedOrder);
        addActivity(caller, "Assigned team member to order " # orderId.toText());
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can update order status");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isTeam = isTeamMember(caller);

    if (not isAdmin and not isTeam) {
      Runtime.trap("Unauthorized: Only admins and team members can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (isTeam and not isAdmin) {
          switch (order.assignedTeamMember) {
            case (null) {
              Runtime.trap("Unauthorized: Order not assigned to any team member");
            };
            case (?assigned) {
              if (assigned != caller) {
                Runtime.trap("Unauthorized: Order not assigned to you");
              };
            };
          };
        };

        let updatedOrder : Order = {
          order with
          status;
        };
        orders.add(orderId, updatedOrder);
        addActivity(caller, "Updated status for order " # orderId.toText());
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getCustomerOrders(customer : Principal) : async [Order] {
    if (caller != customer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(o) { o.customer == customer });
  };

  public query ({ caller }) func getOwnOrders() : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can access orders");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isTeam = isTeamMember(caller);
    let isCustomerUser = isCustomer(caller);

    if (isCustomerUser) {
      // Customers see their own orders
      return orders.values().toArray().filter(func(o) { o.customer == caller });
    } else if (isTeam) {
      // Team members see orders assigned to them
      return orders.values().toArray().filter(
        func(o) {
          switch (o.assignedTeamMember) {
            case (null) { false };
            case (?assigned) { assigned == caller };
          };
        }
      );
    } else if (isAdmin) {
      // Admins see all orders
      return orders.values().toArray();
    };

    [];
  };

  public query ({ caller }) func getAssignedOrders() : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can access orders");
    };

    if (not isTeamMember(caller)) {
      Runtime.trap("Unauthorized: Only team members can view assigned orders");
    };

    orders.values().toArray().filter(
      func(o) {
        switch (o.assignedTeamMember) {
          case (null) { false };
          case (?assigned) { assigned == caller };
        };
      }
    );
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = caller == order.customer;
        let isAssigned = switch (order.assignedTeamMember) {
          case (null) { false };
          case (?assigned) { assigned == caller };
        };

        if (isAdmin or isOwner or isAssigned) { ?order } else {
          Runtime.trap("Unauthorized: Cannot access this order");
        };
      };
    };
  };

  public query ({ caller }) func getOpenOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view open orders");
    };

    orders.values().toArray().filter(
      func(o) { o.status != #delivered and o.status != #cancelled }
    );
  };

  // User Profile Functions

  // Create profile (first time)
  public shared ({ caller }) func createProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can create profiles");
    };

    // Only admins can create admin profiles
    switch (profile) {
      case (#admin(_)) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins can create admin profiles");
        };
      };
      case (_) {};
    };

    userProfiles.add(caller, profile);
    addActivity(caller, "Created user profile");
  };

  // Get own profile (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Get profile by principal (required by frontend)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can update profiles");
    };

    // Only admins can update to admin profiles
    switch (profile) {
      case (#admin(_)) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins can create admin profiles");
        };
      };
      case (_) {};
    };

    userProfiles.add(caller, profile);
    addActivity(caller, "Updated user profile");
  };

  // Get all users (admin)
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    let customers = userProfiles.values().toArray().filter(
      func(p) { switch (p) { case (#customer(_)) { true }; case (_) { false } } }
    ).sort(
      func(x, y) {
        switch (x, y) {
          case (#customer(a), #customer(b)) { Text.compare(a.name, b.name) };
          case (#customer(_), _) { #less };
          case (_, #customer(_)) { #greater };
          case (_, _) { #equal };
        };
      }
    );
    let teamMembers = userProfiles.values().toArray().filter(
      func(p) { switch (p) { case (#teamMember(_)) { true }; case (_) { false } } }
    ).sort(
      func(x, y) {
        switch (x, y) {
          case (#teamMember(a), #teamMember(b)) { Text.compare(a.name, b.name) };
          case (#teamMember(_), _) { #less };
          case (_, #teamMember(_)) { #greater };
          case (_, _) { #equal };
        };
      }
    );
    let admins = userProfiles.values().toArray().filter(
      func(p) { switch (p) { case (#admin(_)) { true }; case (_) { false } } }
    ).sort(
      func(x, y) {
        switch (x, y) {
          case (#admin(a), #admin(b)) { Text.compare(a.name, b.name) };
          case (#admin(_), _) { #less };
          case (_, #admin(_)) { #greater };
          case (_, _) { #equal };
        };
      }
    );
    if (customers.size() == 0 and teamMembers.size() == 0) { return admins };
    if (customers.size() == 0 and admins.size() == 0) { return teamMembers };
    if (admins.size() == 0 and teamMembers.size() == 0) { return customers };
    if (customers.size() == 0) {
      return admins.concat(teamMembers);
    };
    if (teamMembers.size() == 0) {
      return customers.concat(admins);
    };
    if (admins.size() == 0) {
      return customers.concat(teamMembers);
    };

    customers.concat(teamMembers).concat(admins);
  };

  // Create admin profile only - used by system
  public shared ({ caller }) func createAdminProfile(profile : AdminProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create admin profiles");
    };
    userProfiles.add(caller, #admin(profile));
    addActivity(caller, "Created admin profile");
  };

  // Assign team member role - Only admins can assign
  public shared ({ caller }) func assignTeamMember(user : Principal, profile : TeamMemberProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign team members");
    };
    userProfiles.add(user, #teamMember(profile));
    addActivity(caller, "Assigned team member role");
  };

  // Activity Feed Functions

  public query ({ caller }) func getActivityFeed() : async [Activity] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authorized users can view activity feed");
    };
    activityFeed.toArray();
  };

  // Get activities for specific user
  public query ({ caller }) func getUserActivities(user : Principal) : async [Activity] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own activities");
    };
    activityFeed.toArray().filter(
      func(activity) {
        activity.user == user;
      }
    );
  };

  // Dashboard Metrics Functions

  public query ({ caller }) func getOrderStats() : async {
    totalOrders : Nat;
    pending : Nat;
    quoted : Nat;
    inProduction : Nat;
    shipped : Nat;
    delivered : Nat;
    cancelled : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view order stats");
    };
    let allOrders = orders.values().toArray();
    {
      totalOrders = orders.size();
      pending = allOrders.filter(func(o) { o.status == #pending }).size();
      quoted = allOrders.filter(func(o) { o.status == #quoted }).size();
      inProduction = allOrders.filter(func(o) { o.status == #inProduction }).size();
      shipped = allOrders.filter(func(o) { o.status == #shipped }).size();
      delivered = allOrders.filter(func(o) { o.status == #delivered }).size();
      cancelled = allOrders.filter(func(o) { o.status == #cancelled }).size();
    };
  };

  // Permission Check Functions
  public query ({ caller }) func hasTeamAccess() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return false;
    };
    isTeamMember(caller);
  };

  public query ({ caller }) func getCallerRole() : async AccessControl.UserRole {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their role");
    };
    AccessControl.getUserRole(accessControlState, caller);
  };

  public query ({ caller }) func isAuthenticated() : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    let role = getCallerRoleInternal(caller);
    switch (role) {
      case (#user) { true };
      case (_) { false };
    };
  };

  func getCallerRoleInternal(caller : Principal) : AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };
};
