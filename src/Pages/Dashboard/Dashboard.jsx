// AdminDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Users,
  Watch,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Moon,
  Sun,
  Search,
  Plus,
  X,
  RefreshCw,
  Globe,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./Dashboard.module.css";
import supabase from "../../supabaseClient";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import i18n from "../../i18n/i18n";

// Mock data
const mockStatsData = {
  sales: { value: 124350, change: 12.5 },
  orders: { value: 324, change: 8.2 },
  customers: { value: 1254, change: 15.3 },
  averageValue: { value: 384, change: -2.8 },
};

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
  { name: "Aug", sales: 6500 },
  { name: "Sep", sales: 8000 },
  { name: "Oct", sales: 7500 },
  { name: "Nov", sales: 9000 },
  { name: "Dec", sales: 11000 },
];

const categoryData = [
  { name: "Submariner", value: 20 },
  { name: "Datejust", value: 18 },
  { name: "GMT-Master", value: 15 },
  { name: "Day-Date", value: 12 },
  { name: "Explorer", value: 10 },
  { name: "Yacht-Master", value: 8 },
  { name: "Sky-Dweller", value: 6 },
  { name: "Oyster Perpetual", value: 5 },
  { name: "Sea-Dweller", value: 4 },
  { name: "Milgauss", value: 2 },
];

const AdminDashboard = () => {
  // Context-ləri əldə edirik
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  // State-lər
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
    summary: "",
    image: "",
    author: "",
    category: "",
    published: false,
    publishDate: new Date().toISOString().split("T")[0],
  });

  // Məhsulları əldə etmək
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("Products").select("*");

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          console.warn("No products found, using mock data.");
          // Əgər lazımdırsa buraya mock data əlavə edə bilərsiniz
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        toast.error(t("failedToLoadProducts"));
      } finally {
        setIsLoading(false);
      }
    };

    // İstifadəçiləri əldə etmək
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Supabase auth API istifadə edərək istifadəçiləri əldə edirik
        // URL: https://supabase.com/dashboard/project/xdzksswqqqoonxbwcmup/auth/users
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        // Admin istifadəçisinin token-ini istifadə edərək bütün istifadəçiləri əldə etmək
        // Qeyd: Bu, admin roluna sahib istifadəçilər üçün əlçatandır
        const response = await fetch(
          "https://xdzksswqqqoonxbwcmup.supabase.co/auth/v1/admin/users",
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
        toast.error(t("failedToLoadUsers"));
      } finally {
        setIsLoading(false);
      }
    };
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
          const { data, error } = await supabase
              .from('blog') // Cədvəl adını düzgün yazdığınızdan əmin olun
              .select('*')
              // .order('created_at', { ascending: false });
  
          if (error) throw error;
  
          if (data && data.length > 0) {
              setBlogs(data);
          } else {
              console.warn("No blogs found.");
          }
      } catch (error) {
          console.error("Error fetching blogs:", error);
          setError('Failed to load blogs. Please try again later.');
      } finally {
          setIsLoading(false);
      }
  };

    fetchBlogs();

    fetchProducts();
    fetchUsers();
  }, [t]);

  // Məhsul əlavə etmək
  const addProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("Products")
        .insert([formData]);

      if (error) throw error;

      if (!data || !data.length) {
        console.error("No data returned from the API");
        toast.error(t("noDataReturned"));
        return;
      }

      setProducts([...products, { ...formData, id: data[0].id }]);
      toast.success(t("productAddedSuccess"));
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(t("failedToAddProduct"));
    }
  };

  // Məhsul yeniləmək
  const updateProduct = async () => {
    try {
      const { error } = await supabase
        .from("Products")
        .update(formData)
        .eq("id", currentItem.id);

      if (error) throw error;

      setProducts(
        products.map((product) =>
          product.id === currentItem.id ? { ...product, ...formData } : product
        )
      );
      toast.success(t("productUpdatedSuccess"));
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(t("failedToUpdateProduct"));
    }
  };

  // Məhsul silmək
  const deleteProduct = async (id) => {
    const { value: confirmed } = await Swal.fire({
      title: t("confirmDelete"),
      text: t("confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (!confirmed) {
      toast.info(t("deleteCancelled"));
      return;
    }

    try {
      const { error } = await supabase.from("Products").delete().eq("id", id);

      if (error) throw error;

      setProducts(products.filter((product) => product.id !== id));
      toast.success(t("productDeletedSuccess"));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(t("failedToDeleteProduct"));
    }
  };

  // İstifadəçi silmək
  const deleteUser = async (userId) => {
    const { value: confirmed } = await Swal.fire({
      title: t("confirmDelete"),
      text: t("confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (!confirmed) {
      toast.info(t("deleteCancelled"));
      return;
    }

    try {
      const response = await fetch(
        `https://xdzksswqqqoonxbwcmup.supabase.co/auth/v1/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== userId));
      toast.success(t("userDeletedSuccess"));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(t("failedToDeleteUser"));
    }
  };
  const addBlog = async () => {
    try {
      // Məlumatları hazırlayırıq
      const newBlog = {
        ...blogFormData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("blog").insert([newBlog]);

      if (error) throw error;

      // Uğurlu əməliyyat
      toast.success(t("blogAddedSuccess"));
      setModalOpen(false);

    
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error(t("failedToAddBlog"));
    }
  };

  const updateBlog = async () => {
    try {
      // Məlumatları hazırlayırıq
      const updatedBlog = {
        ...blogFormData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("blog")
        .update(updatedBlog)
        .eq("id", currentItem.id);

      if (error) throw error;

      // Uğurlu əməliyyat
      toast.success(t("blogUpdatedSuccess"));
      setModalOpen(false);

     
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(t("failedToUpdateBlog"));
    }
  };

  // 5. Blog silmək üçün funksiya
  const deleteBlog = async (id) => {
    const { value: confirmed } = await Swal.fire({
      title: t("confirmDelete"),
      text: t("confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (!confirmed) {
      toast.info(t("deleteCancelled"));
      return;
    }

    try {
      const { error } = await supabase.from("blog").delete().eq("id", id);

      if (error) throw error;

      // Uğurlu əməliyyat
      toast.success(t("blogDeletedSuccess"));

      // Siyahıdan silirik və UI yeniləyirik
      setBlogs(blog.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(t("failedToDeleteBlog"));
    }
  };

  // Modal açmaq
  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);

    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: "",
        model: "",
        price: "",
        discountedPrice: "",
        discounted: false,
        image: "",
        description: "",
        rating: 0,
        availability: true,
        details: {
          material: "",
          movement: "",
          caseDiameter: "",
          waterResistance: "",
        },
      });
    }

    setModalOpen(true);
  };

  const openBlogModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);

    if (item) {
      setBlogFormData(item);
    } else {
      setBlogFormData({
        title: "",
        content: "",
        summary: "",
        image: "",
        author: "",
        category: "",
        published: false,
        publishDate: new Date().toISOString().split("T")[0],
      });
    }

    setModalOpen(true);
  };
  // Form dəyişikliklərini idarə etmək
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("details.")) {
      const detailKey = name.split(".")[1];
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          [detailKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleBlogFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogFormData({
      ...blogFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Form təqdim etmək
  const handleFormSubmit = (e) => {
    e.preventDefault();

    switch (modalType) {
      case "addProduct":
        addProduct();
        break;
      case "editProduct":
        updateProduct();
        break;
        case "addBlog":
          addBlog();
          break;
        case "editBlog":
          updateBlog();
      default:
        break;
    }
  };

  // Filtrlənmiş məhsullar
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrlənmiş istifadəçilər
  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Yan menyunu açıb-bağlamaq
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`${styles.container} ${
        theme === "dark" ? styles.darkTheme : ""
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarLogo}>
          <Watch size={24} />
          <span className={styles.logoText}>{t("hiAdmin")}</span>
        </div>

        <nav>
          <div
            className={`${styles.navItem} ${
              activeTab === "dashboard" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <ShoppingCart size={20} className={styles.navIcon} />
            <span>{t("dashboard")}</span>
          </div>

          <div
            className={`${styles.navItem} ${
              activeTab === "products" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            <Watch size={20} className={styles.navIcon} />
            <span>{t("products")}</span>
          </div>

          <div
            className={`${styles.navItem} ${
              activeTab === "users" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} className={styles.navIcon} />
            <span>{t("users")}</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "blog" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("blogs")}
          >
            <Edit size={20} className={styles.navIcon} />
            <span>{t("blogs")}</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.content}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className={styles.pageTitle}>Rolex Admin</h1>
        </div>

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>
            {activeTab === "dashboard" && t("dashboard")}
            {activeTab === "products" && t("products")}
            {activeTab === "users" && t("users")}
          </h1>

          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search")}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Overview */}
            <div className={styles.dashboard}>
              <div className={styles.dashboardCard}>
                <h3 className={styles.cardTitle}>{t("totalSales")}</h3>
                <h2 className={styles.cardValue}>
                  ${mockStatsData.sales.value.toLocaleString()}
                </h2>
                <div
                  className={`${styles.cardGrowth} ${
                    mockStatsData.sales.change > 0
                      ? styles.positive
                      : styles.negative
                  }`}
                >
                  {mockStatsData.sales.change > 0 ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  <span>
                    {Math.abs(mockStatsData.sales.change)}% {t("fromLastMonth")}
                  </span>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <h3 className={styles.cardTitle}>{t("orders")}</h3>
                <h2 className={styles.cardValue}>
                  {mockStatsData.orders.value}
                </h2>
                <div
                  className={`${styles.cardGrowth} ${
                    mockStatsData.orders.change > 0
                      ? styles.positive
                      : styles.negative
                  }`}
                >
                  {mockStatsData.orders.change > 0 ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  <span>
                    {Math.abs(mockStatsData.orders.change)}%{" "}
                    {t("fromLastMonth")}
                  </span>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <h3 className={styles.cardTitle}>{t("customers")}</h3>
                <h2 className={styles.cardValue}>
                  {mockStatsData.customers.value}
                </h2>
                <div
                  className={`${styles.cardGrowth} ${
                    mockStatsData.customers.change > 0
                      ? styles.positive
                      : styles.negative
                  }`}
                >
                  {mockStatsData.customers.change > 0 ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  <span>
                    {Math.abs(mockStatsData.customers.change)}%{" "}
                    {t("fromLastMonth")}
                  </span>
                </div>
              </div>

              <div className={styles.dashboardCard}>
                <h3 className={styles.cardTitle}>{t("averageOrderValue")}</h3>
                <h2 className={styles.cardValue}>
                  ${mockStatsData.averageValue.value}
                </h2>
                <div
                  className={`${styles.cardGrowth} ${
                    mockStatsData.averageValue.change > 0
                      ? styles.positive
                      : styles.negative
                  }`}
                >
                  {mockStatsData.averageValue.change > 0 ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  <span>
                    {Math.abs(mockStatsData.averageValue.change)}%{" "}
                    {t("fromLastMonth")}
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className={styles.chartContainer}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>{t("salesOverview")}</h3>
                <div className={styles.chartPeriod}>{t("last12Months")}</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className={styles.cartesianGrid}
                  />
                  <XAxis dataKey="name" className={styles.axis} />
                  <YAxis className={styles.axis} />
                  <Tooltip contentClassName={styles.tooltip} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    className={styles.chartLine}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Product Categories Chart */}
            <div className={styles.chartGrid}>
              <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>
                    {t("productCategories")}
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      className={styles.pieChart}
                      label
                    />
                    <Tooltip contentClassName={styles.tooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Sales */}
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>{t("recentSales")}</h3>
                </div>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>{t("product")}</th>
                      <th className={styles.th}>{t("customer")}</th>
                      <th className={styles.th}>{t("price")}</th>
                      <th className={styles.th}>{t("date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.td}>Rolex Submariner</td>
                      <td className={styles.td}>John Smith</td>
                      <td className={styles.td}>$8,500</td>
                      <td className={styles.td}>Apr 10, 2025</td>
                    </tr>
                    <tr>
                      <td className={styles.td}>Rolex Datejust</td>
                      <td className={styles.td}>Emma Johnson</td>
                      <td className={styles.td}>$7,200</td>
                      <td className={styles.td}>Apr 09, 2025</td>
                    </tr>
                    <tr>
                      <td className={styles.td}>Rolex GMT-Master II</td>
                      <td className={styles.td}>Michael Brown</td>
                      <td className={styles.td}>$12,950</td>
                      <td className={styles.td}>Apr 08, 2025</td>
                    </tr>
                    <tr>
                      <td className={styles.td}>Rolex Day-Date</td>
                      <td className={styles.td}>Sarah Davis</td>
                      <td className={styles.td}>$35,000</td>
                      <td className={styles.td}>Apr 07, 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>{t("products")}</h3>
              <button
                className={styles.addButton}
                onClick={() => openModal("addProduct")}
              >
                <Plus size={16} />
                <span>{t("addProduct")}</span>
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <RefreshCw size={24} className={styles.loadingIcon} />
                <p>{t("loadingProducts")}</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>{t("id")}</th>
                    <th className={styles.th}>{t("image")}</th>
                    <th className={styles.th}>{t("name")}</th>
                    <th className={styles.th}>{t("model")}</th>
                    <th className={styles.th}>{t("price")}</th>
                    <th className={styles.th}>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className={styles.td}>{product.id}</td>
                        <td className={styles.td}>
                          <div className={styles.productImage}>
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <Watch size={24} />
                            )}
                          </div>
                        </td>
                        <td className={styles.td}>{product.name}</td>
                        <td className={styles.td}>{product.model}</td>
                        <td className={styles.td}>
                          ${product.price?.toLocaleString()}
                        </td>

                        <td className={styles.td}>
                          <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => openModal("editProduct", product)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.noData}>
                        {searchTerm
                          ? t("noProductsFound")
                          : t("noProductsAvailable")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>{t("users")}</h3>
            </div>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <RefreshCw size={24} className={styles.loadingIcon} />
                <p>{t("loadingUsers")}</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>{t("id")}</th>
                    <th className={styles.th}>{t("name")}</th>
                    <th className={styles.th}>{t("email")}</th>
                    <th className={styles.th}>{t("role")}</th>
                    <th className={styles.th}>{t("registered")}</th>
                    <th className={styles.th}>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className={styles.td}>{user.id}</td>
                        <td className={styles.td}>
                          {user.user_metadata?.name || "-"}
                        </td>
                        <td className={styles.td}>{user.email}</td>
                        <td className={styles.td}>{user.role || t("user")}</td>
                        <td className={styles.td}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className={styles.td}>
                          <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.noData}>
                        {searchTerm ? t("noUsersFound") : t("noUsersAvailable")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {modalType === "addProduct" && t("addProduct")}
                  {modalType === "editProduct" && t("editProduct")}
                </h3>
                <button
                  className={styles.closeButton}
                  onClick={() => setModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                {/* Product Form */}
                {(modalType === "addProduct" ||
                  modalType === "editProduct") && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("productName")}</label>
                      <input
                        type="text"
                        name="name"
                        className={styles.input}
                        value={formData.name || ""}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("model")}</label>
                      <input
                        type="text"
                        name="model"
                        className={styles.input}
                        value={formData.model || ""}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t("price")} ($)</label>
                        <input
                          type="number"
                          name="price"
                          className={styles.input}
                          value={formData.price || ""}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("discountedPrice")} ($)
                        </label>
                        <input
                          type="number"
                          name="discountedPrice"
                          className={styles.input}
                          value={formData.discountedPrice || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("discounted")}</label>
                      <input
                        type="checkbox"
                        name="discounted"
                        className={styles.checkbox}
                        checked={formData.discounted || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discounted: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.imageUrl")}
                      </label>
                      <input
                        type="text"
                        name="image"
                        className={styles.input}
                        value={formData.image || ""}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.description")}
                      </label>
                      <textarea
                        name="description"
                        className={styles.textarea}
                        value={formData.description || ""}
                        onChange={handleFormChange}
                        rows="4"
                      ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.rating")}
                      </label>
                      <input
                        type="number"
                        name="rating"
                        className={styles.input}
                        value={formData.rating || ""}
                        onChange={handleFormChange}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.availability")}
                      </label>
                      <input
                        type="checkbox"
                        name="availability"
                        className={styles.checkbox}
                        checked={formData.availability || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.material")}
                      </label>
                      <input
                        type="text"
                        name="details.material"
                        className={styles.input}
                        value={formData.details?.material || ""}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.movement")}
                      </label>
                      <input
                        type="text"
                        name="details.movement"
                        className={styles.input}
                        value={formData.details?.movement || ""}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.caseDiameter")}
                      </label>
                      <input
                        type="text"
                        name="details.caseDiameter"
                        className={styles.input}
                        value={formData.details?.caseDiameter || ""}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("product.waterResistance")}
                      </label>
                      <input
                        type="text"
                        name="details.waterResistance"
                        className={styles.input}
                        value={formData.details?.waterResistance || ""}
                        onChange={handleFormChange}
                      />
                    </div>
                  </>
                )}
                {(modalType === "addBlog" || modalType === "editBlog") && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("blog.title")}</label>
                      <input
                        type="text"
                        name="title"
                        className={styles.input}
                        value={blogFormData.title || ""}
                        onChange={handleBlogFormChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("blog.summary")}
                      </label>
                      <textarea
                        name="summary"
                        className={styles.textarea}
                        value={blogFormData.summary || ""}
                        onChange={handleBlogFormChange}
                        rows="2"
                      ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("blog.content")}
                      </label>
                      <textarea
                        name="content"
                        className={styles.textarea}
                        value={blogFormData.content || ""}
                        onChange={handleBlogFormChange}
                        rows="10"
                        required
                      ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("blog.imageUrl")}
                      </label>
                      <input
                        type="text"
                        name="image"
                        className={styles.input}
                        value={blogFormData.image || ""}
                        onChange={handleBlogFormChange}
                      />
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.author")}
                        </label>
                        <input
                          type="text"
                          name="author"
                          className={styles.input}
                          value={blogFormData.author || ""}
                          onChange={handleBlogFormChange}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.category")}
                        </label>
                        <input
                          type="text"
                          name="category"
                          className={styles.input}
                          value={blogFormData.category || ""}
                          onChange={handleBlogFormChange}
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.published")}
                        </label>
                        <input
                          type="checkbox"
                          name="published"
                          className={styles.checkbox}
                          checked={blogFormData.published || false}
                          onChange={handleBlogFormChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.publishDate")}
                        </label>
                        <input
                          type="date"
                          name="publishDate"
                          className={styles.input}
                          value={blogFormData.publishDate || ""}
                          onChange={handleBlogFormChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                {(modalType === "addUser" || modalType === "editUser") && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("user.name")}</label>
                      <input
                        type="text"
                        name="name"
                        className={styles.input}
                        value={formData.name || ""}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("user.email")}</label>
                      <input
                        type="email"
                        name="email"
                        className={styles.input}
                        value={formData.email || ""}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t("user.role")}</label>
                      <select
                        name="role"
                        className={styles.select}
                        value={formData.role || ""}
                        onChange={handleFormChange}
                      >
                        <option value="">{t("common.selectRole")}</option>
                        <option value="admin">{t("roles.admin")}</option>
                        <option value="user">{t("roles.user")}</option>
                      </select>
                    </div>
                  </>
                )}

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setModalOpen(false)}
                  >
                    {t("common.cancel")}
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    {modalType === "addProduct" && t("product.add")}
                    {modalType === "editProduct" && t("product.update")}
                    {modalType === "addUser" && t("user.add")}
                    {modalType === "editUser" && t("user.update")}
                  </button>
                </div>
              </form>
            </div>
            {activeTab === "blogs" && (
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>{t("blogs")}</h3>
                  <button
                    className={styles.addButton}
                    onClick={() => openBlogModal("addBlog")}
                  >
                    <Plus size={16} />
                    <span>{t("addBlog")}</span>
                  </button>
                </div>

                {isLoading ? (
                  <div className={styles.loadingContainer}>
                    <RefreshCw size={24} className={styles.loadingIcon} />
                    <p>{t("loadingBlogs")}</p>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead className={styles.thead}>
                      <tr>
                        <th className={styles.th}>{t("id")}</th>
                        <th className={styles.th}>{t("image")}</th>
                        <th className={styles.th}>{t("title")}</th>
                        <th className={styles.th}>{t("author")}</th>
                        <th className={styles.th}>{t("category")}</th>
                        <th className={styles.th}>{t("publishDate")}</th>
                        <th className={styles.th}>{t("status")}</th>
                        <th className={styles.th}>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => (
                          <tr key={blog.id}>
                            <td className={styles.td}>{blog.id}</td>
                            <td className={styles.td}>
                              <div className={styles.blogImage}>
                                {blog.image ? (
                                  <img src={blog.image} alt={blog.title} />
                                ) : (
                                  <Edit size={24} />
                                )}
                              </div>
                            </td>
                            <td className={styles.td}>{blog.title}</td>
                            <td className={styles.td}>{blog.author}</td>
                            <td className={styles.td}>{blog.category}</td>
                            <td className={styles.td}>
                              {new Date(blog.publishDate).toLocaleDateString()}
                            </td>
                            <td className={styles.td}>
                              <span
                                className={`${styles.status} ${
                                  blog.published
                                    ? styles.published
                                    : styles.draft
                                }`}
                              >
                                {blog.published ? t("published") : t("draft")}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <button
                                className={`${styles.actionButton} ${styles.editButton}`}
                                onClick={() => openBlogModal("editBlog", blog)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={() => deleteBlog(blog.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className={styles.noData}>
                            {searchTerm
                              ? t("noBlogsFound")
                              : t("noBlogsAvailable")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
