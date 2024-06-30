## customer

```ts
interface CustomerType {
  _id?: ObjectId;
  name: String;
  phone: String;
  dob: Date;
  email: String;
  points: Number;
  created_at: Date;
  updated_at?: Date;
}
```

## gold_price

```ts
interface GoldPriceType {
  _id?: ObjectId;
  sell_price: Number;
  buy_price: Number;
  updated_at: Date;
}
```

## product

```ts
interface ProductType {
  _id: ObjectId;
  name: String;
  barcode: String;
  productCode: String;
  weight: Number;
  laborCost: Number; // Tiền công
  gemCost: Number; // Tiền đá ???
  basePrice: Number; // (latestGoldPrice * weight) + laborCost + gemCost
  created_at: Date;
  updated_at: Date;
}
```

## employees

```ts
interface EmployeeType {
  _id: ObjectId;
  name: String;
  email: String;
  password: String;
  role: enum; // manager, staff
  assignedCounter: ObjectId; // reference to Counters collection
  created_at: Date;
  updated_at: Date;
}
```

## counters

```ts
interface CounterType {
  _id: ObjectId;
  counter_name: String;
  assignedEmployees: [ObjectId]; // reference to Employees collection
  created_at: Date;
  updated_at: Date;
}
```

## order_details

```ts
interface OrderDetail {
  productId: ObjectId; // reference to Products collection
  quantity: Number;
  unitPrice: Number;
}
```

## orders

```ts
interface OrderType {
  _id: ObjectId;
  customer_id: ObjectId; // reference to Customers collection
  products: [OrderDetail];
  subtotal: Number;
  discount: Number;
  total: Number;
  paymentStatus: enum; // pending, paid
  created_at: Date;
  updated_at: Date;
}
```
