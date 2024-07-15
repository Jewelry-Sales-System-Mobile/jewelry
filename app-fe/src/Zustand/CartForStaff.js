import { create } from "zustand";

export const useCartStore = create((set) => ({
  customer: "",
  order_details: [
    // {
    //   _id: "66880c2fcb3ae588eee995b2",
    //   name: "Lắc tay theo phong thuỷ",
    //   barcode: "",
    //   productCode: "PD224416",
    //   weight: 100,
    //   laborCost: 640000,
    //   gemCost: 200000,
    //   basePrice: 214173333.3333333,
    //   image: "",
    //   created_at: "2024-07-05T15:07:27.249Z",
    //   updated_at: "2024-07-12T10:23:55.882Z",
    //   status: 0,
    //   productId: "66880c2fcb3ae588eee995b2",
    //   unitPrice: 214173333.3333333,
    //   quantity: 1,
    // },
  ], // Array to hold product details
  subtotal: 0,
  discount: 0,
  total: 0,
  addProductToCart: (product) =>
    set((state) => {
      console.log("order_details", state.order_details);

      const index = state.order_details.findIndex(
        (item) => item.productId === product._id
      );
      console.log("index", index, product, state.order_details);
      if (index > -1) {
        // Product exists, update quantity
        let newOrderDetails = [...state.order_details];
        newOrderDetails[index] = {
          ...newOrderDetails[index],
          quantity: newOrderDetails[index].quantity + 1,
        };
        // Calculate new subtotal and total[index]
        const newSubtotal = newOrderDetails.reduce(
          (acc, item) => acc + item.quantity * item.unitPrice,
          0
        );
        console.log(
          "newOrderDetails[index]",
          newOrderDetails[index],
          newSubtotal
        );
        // Recalculate subtotal using quantity and unitPrice        const newTotal = newSubtotal - state.discount;
        const newTotal = newSubtotal - state.discount;
        return {
          order_details: newOrderDetails,
          subtotal: newSubtotal,
          total: newTotal,
        };
      } else {
        // New product, add to cart
        const newOrderDetails = [
          ...state.order_details,
          {
            ...product,
            productId: product._id,
            unitPrice: product.basePrice,
            quantity: 1,
          },
        ];
        // Calculate new subtotal and total
        const newSubtotal = newOrderDetails.reduce((acc, item) => {
          console.log("item", item, Number(item.quantity), item.unitPrice);
          const quantity = Number(item.quantity) || 0; // Ensure quantity is a number
          const unitPrice = Number(item.unitPrice) || 0; // Ensure unitPrice is a number
          return acc + quantity * unitPrice;
        }, 0);

        const discount = Number(state.discount) || 0; // Ensure discount is a number
        const newTotal = newSubtotal - discount; // Correctly calculate newTotal here
        console.log("newOrderDetails", newOrderDetails, newSubtotal, newTotal);

        return {
          order_details: newOrderDetails,
          subtotal: newSubtotal,
          total: newTotal,
        };
      }
    }), // Assuming the existence of methods to delete and update items, we'll focus on recalculating the subtotal and total.
  // Method to delete an item
  deleteItem: (itemId) =>
    set((state) => {
      const newOrderDetails = state.order_details.filter(
        (item) => item.productId !== itemId
      ); // Remove the item
      console.log(itemId, state.order_details, newOrderDetails);

      const newSubtotal = newOrderDetails.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      ); // Recalculate subtotal using quantity and unitPrice
      const newTotal = newSubtotal - state.discount; // Recalculate total
      return {
        ...state,
        order_details: newOrderDetails,
        subtotal: newSubtotal,
        total: newTotal,
      };
    }),

  // Function to increase the quantity of an item in the cart
  increaseQuantity: (itemId) =>
    set((state) => {
      const newOrderDetails = state.order_details.map((item) => {
        if (item.productId === itemId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      const newSubtotal = newOrderDetails.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );
      const newTotal = newSubtotal - state.discount;
      return {
        ...state,
        order_details: newOrderDetails,
        subtotal: newSubtotal,
        total: newTotal,
      };
    }),

  // Function to decrease the quantity of an item in the cart
  decreaseQuantity: (itemId) =>
    set((state) => {
      // Filter out the item if its quantity is 1 (or somehow less than 1), otherwise decrease its quantity
      const newOrderDetails = state.order_details.reduce((acc, item) => {
        if (item.productId === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 }); // Decrease quantity
          }
          // If quantity is 1, do not push it back into the array, effectively deleting it
        } else {
          acc.push(item); // Keep all other items as is
        }
        return acc;
      }, []);

      // Recalculate subtotal and total
      const newSubtotal = newOrderDetails.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );
      const newTotal = newSubtotal - state.discount;

      return {
        ...state,
        order_details: newOrderDetails,
        subtotal: newSubtotal,
        total: newTotal,
      };
    }),
  applyDiscount: (discount) =>
    set((state) => {
      const newSubtotal = state.order_details.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      );
      const newTotal = newSubtotal - discount;

      return { ...state, discount, total: newTotal };
    }),
  // Action to increase discount by 100000
  increaseDiscount: () =>
    set((state) => {
      console.log("increaseDiscountInCartStore");
      const newDiscount = state.discount + 100000;
      const newTotal =
        state.subtotal - newDiscount >= 0 ? state.subtotal - newDiscount : 0;
      return { ...state, discount: newDiscount, total: newTotal };
    }),

  // Action to decrease discount by 100000, ensuring discount doesn't go below 0
  decreaseDiscount: () =>
    set((state) => {
      console.log("decreaseDiscountInCartStore");

      const newDiscount = Math.max(0, state.discount - 100000); // Prevent discount from going below 0
      const newTotal = state.subtotal - newDiscount;
      return { ...state, discount: newDiscount, total: newTotal };
    }),
  setCustomer: (customer) => {
    console.log("Setting customer ID to:", customer);
    set({ customer: customer });
  },
  // Function to reset all the state of cartStore
  resetCart: () =>
    set(() => ({
      customer: "", // Reset customer to an empty string
      order_details: [], // Reset order details to an empty array
      discount: 0, // Reset discount to 0
      subtotal: 0, // Reset subtotal to 0
      total: 0, // Reset total to 0
    })),
}));
