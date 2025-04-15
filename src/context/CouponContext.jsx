
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useCart } from "react-use-cart";
import supabase from "../supabaseClient";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const { items, isEmpty, cartTotal, updateItemQuantity } = useCart();
  

  const itemsRef = useRef(items);
  const [cartUpdate, setCartUpdate] = useState(0);
  
 
  useEffect(() => {
    itemsRef.current = items;
    setCartUpdate(prev => prev + 1);
  }, [items, cartTotal]);


  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (err) {
        console.error("Error parsing saved coupon", err);
        localStorage.removeItem("appliedCoupon");
      }
    }
  }, []);


  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon]);


  const applyCoupon = async (code) => {
    setLoading(true);
    setCouponError(null);
    
    try {
      console.log("Kupon kodunu yoxlayırıq:", code);
      
      
      if (!supabase) {
        console.log("Supabase mövcud deyil, fake kuponları yoxlayırıq");
        const demoData = checkDemoCoupon(code);
        
        if (demoData) {
          setAppliedCoupon(demoData);
          setCouponError(null);
        } else {
          throw new Error("Kupon kodu tapılmadı");
        }
        
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .eq("active", true)
        .single();
      
      console.log("Supabase cavabı:", { data, error });
      
      if (error) {
        console.error("Supabase xətası:", error);
   
        const demoData = checkDemoCoupon(code);
        
        if (demoData) {
          setAppliedCoupon(demoData);
          setCouponError(null);
          setLoading(false);
          return;
        }
        
        throw new Error("Kupon kodu tapılmadı");
      }
      
      const currentDate = new Date();
      const startDate = data.start_date ? new Date(data.start_date) : null;
      const endDate = data.end_date ? new Date(data.end_date) : null;
      
      if (startDate && currentDate < startDate) {
        throw new Error("Bu kupon hələ aktiv deyil");
      }
      
      if (endDate && currentDate > endDate) {
        throw new Error("Bu kuponun istifadə müddəti bitib");
      }

      setAppliedCoupon(data);
      setCouponError(null);
   
      setCartUpdate(prev => prev + 1);
    } catch (error) {
      console.error("Kupon tətbiq edilərkən xəta:", error);
      setCouponError(error.message || "Kupon tətbiq edilərkən xəta baş verdi");
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const checkDemoCoupon = (code) => {
    const demoCoupons = [
      {
        id: "demo-1",
        code: "WELCOME10",
        discount_type: "percentage",
        discount_value: 10,
        active: true
      },
      {
        id: "demo-2",
        code: "WELCOME15",
        discount_type: "percentage",
        discount_value: 15,
        active: true
      },
      {
        id: "demo-3",
        code: "SUMMER25",
        discount_type: "percentage",
        discount_value: 25,
        active: true
      },
      {
        id: "demo-4",
        code: "FIXED50",
        discount_type: "fixed",
        discount_value: 50,
        active: true
      }
    ];
    
    return demoCoupons.find(coupon => 
      coupon.code.toLowerCase() === code.toLowerCase() && coupon.active
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };


  const calculateSubtotal = () => {
    if (isEmpty || !itemsRef.current || itemsRef.current.length === 0) return 0;
    
    console.log("Subtotal hesablanır. Items:", itemsRef.current);
  
    let totalAmount = 0;
    for (const item of itemsRef.current) {
      const itemPrice = item.discounted ? parseFloat(item.discountedPrice) : parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      const itemTotal = itemPrice * quantity;
      
      console.log(`Məhsul: ${item.name}, Qiymət: ${itemPrice}, Miqdar: ${quantity}, Cəm: ${itemTotal}`);
      totalAmount += itemTotal;
    }
    
    console.log(`Ümumi məbləğ: ${totalAmount}`);
    return totalAmount;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon || isEmpty) return 0;
    
    const subtotal = calculateSubtotal();
    console.log("Endirim hesablanır. Subtotal:", subtotal, "Kupon:", appliedCoupon);
    
    if (appliedCoupon.discount_type === 'percentage') {
      // Faiz endirimi
      const discountValue = parseFloat(appliedCoupon.discount_value);
      const discountAmount = (subtotal * discountValue) / 100;
      console.log(`Faiz endirimi: ${discountValue}%, Məbləğ: ${discountAmount}`);
      return discountAmount;
    } else if (appliedCoupon.discount_type === 'fixed') {
      // Sabit endirimi
      const discountValue = parseFloat(appliedCoupon.discount_value);
      const discountAmount = Math.min(subtotal, discountValue);
      console.log(`Sabit endirimi: ${discountValue} AZN, Tətbiq edilən: ${discountAmount}`);
      return discountAmount;
    }
    
    return 0;
  };

  // Son qiyməti hesablamaq
  const getFinalPrice = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    
    const finalPrice = Math.max(0, subtotal - discount);
    console.log(`Son qiymət: Subtotal(${subtotal}) - Discount(${discount}) = ${finalPrice}`);
    
    return finalPrice;
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        loading,
        couponError,
        applyCoupon,
        removeCoupon,
        calculateSubtotal,
        calculateDiscount,
        getFinalPrice,
        cartUpdate
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
};

export default CouponContext;