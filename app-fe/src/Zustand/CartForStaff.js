import { create } from "zustand";

export const useCartStore = create((set) => ({
  customer_id: "",
  order_details: [], // Array to hold product details
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
      const newSubtotal = newOrderDetails.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      ); // Recalculate subtotal using quantity and unitPrice      const newTotal = newSubtotal - state.discount; // Recalculate total
      return {
        ...state,
        order_details: newOrderDetails,
        subtotal: newSubtotal,
        total: newTotal,
      };
    }),

  // Method to update an item (assuming item updates are passed as an object with id and changes)
  updateItem: (itemId, changes) =>
    set((state) => {
      const newOrderDetails = state.order_details.map((item) =>
        item.productId === itemId ? { ...item, ...changes } : item
      ); // Update the item
      const newSubtotal = newOrderDetails.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      ); // Recalculate subtotal using quantity and unitPrice      const newTotal = newSubtotal - state.discount; // Recalculate total
      return {
        ...state,
        order_details: newOrderDetails,
        subtotal: newSubtotal,
        total: newTotal,
      };
    }),
  // Add a method to update discount and recalculate total
  applyDiscount: (discount) =>
    set((state) => {
      const newSubtotal = state.order_details.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      );
      const newTotal = newSubtotal - discount * 1000;

      return { ...state, discount, total: newTotal };
    }),
  setCustomerId: (customerId) => {
    console.log("Setting customer ID to:", customerId);
    set({ customer_id: customerId });
  },
}));
