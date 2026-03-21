import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { ProductContext, SERVER_URL } from "./productContext.js";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (category) query.set("category", category);
      if (price) query.set("sortByPrice", price);
      query.set("page", String(page));

      const { data } = await axios.get(
        `${SERVER_URL}/api/product/all?${query.toString()}`,
      );
      setProducts(data.products);
      setNewProd(data.new_products);
      setCategories(data.categories);
      setTotalPages(data.total_pages);
    } catch {
      setProducts([]);
      setNewProd([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, price, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilter = () => {
    setSearch("");
    setCategory("");
    setPrice("");
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        categories,
        category,
        clearFilter,
        loading,
        newProd,
        nextPage,
        page,
        previousPage,
        price,
        products,
        search,
        setCategory,
        setPage,
        setPrice,
        setSearch,
        totalPages,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
