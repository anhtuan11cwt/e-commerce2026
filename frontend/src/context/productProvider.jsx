import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { ProductContext, SERVER_URL } from "./productContext.js";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/product/all`);
      setProducts(data.products);
      setNewProd(data.new_products);
    } catch {
      setProducts([]);
      setNewProd([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ loading, newProd, products }}>
      {children}
    </ProductContext.Provider>
  );
}
