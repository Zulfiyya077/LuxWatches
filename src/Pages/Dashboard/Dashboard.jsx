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
  Cell,
} from "recharts";
import styles from "./Dashboard.module.css";
import supabase from "../../supabaseClient";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";

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
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    category: "",
    read_time: "",
    content: "",
    image: "",
    diameter: "",
    movement: "",
    material: "",
    water_resistance: "",
    power: "",
    bezel: "",
    gallery: "",
  });
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ); 
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
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        toast.error(t("failedToLoadProducts"));
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
       
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) throw profilesError;

        if (profilesData && profilesData.length > 0) {
          setUsers(profilesData);
        } else {
          console.warn("No users found in profiles table.");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users from profiles:", error);
        setError(
          "İstifadəçiləri yükləmək alınmadı. Zəhmət olmasa, bir az sonra yenidən cəhd edin."
        );
        toast.error(t("failedToLoadUsers"));
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("blog").select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          setBlogs(data);
        } else {
          console.warn("No blogs found.");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
        toast.error(t("failedToLoadBlogs"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
    fetchProducts();
    fetchUsers();
  }, [t]);


  const addProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("Products")
        .insert([formData])
        .select(); 

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
  
      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (profileDeleteError) throw profileDeleteError;
      setUsers(users.filter((user) => user.user_id !== userId));
      toast.success(t("userDeletedSuccess"));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(t("failedToDeleteUser"));
    }
  };

  const addBlog = async () => {
    try {
      const newBlog = {
        ...blogFormData,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("blog").insert([newBlog]);

      if (error) throw error;
      const { data: newBlogData, error: fetchError } = await supabase
        .from("blog")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (newBlogData && newBlogData.length > 0) {
        setBlogs([...blogs, newBlogData[0]]);
      }
      toast.success(t("blogAddedSuccess"));
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error(t("failedToAddBlog"));
    }
  };


  const updateBlog = async () => {
    try {
      const { error } = await supabase
        .from("blog")
        .update(blogFormData)
        .eq("id", currentItem.id);

      if (error) throw error;
      setBlogs(
        blogs.map((blog) =>
          blog.id === currentItem.id ? { ...blog, ...blogFormData } : blog
        )
      );
      toast.success(t("blogUpdatedSuccess"));
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(t("failedToUpdateBlog"));
    }
  };


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
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast.success(t("blogDeletedSuccess"));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(t("failedToDeleteBlog"));
    }
  };


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
        date: new Date().toISOString().split("T")[0],
        author: "",
        category: "",
        read_time: "",
        content: "",
        image: "",
        diameter: "",
        movement: "",
        material: "",
        water_resistance: "",
        power: "",
        bezel: "",
        gallery: "",
      });
    }

    setModalOpen(true);
  };


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
        break;
      default:
        break;
    }
  };

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`${styles.container} ${
        theme === "dark" ? styles.darkTheme : ""
      }`}
    >
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
              activeTab === "blogs" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveTab("blogs")}
          >
            <Edit size={20} className={styles.navIcon} />
            <span>{t("blog")}</span>
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
            {activeTab === "blogs" && t("blogs")}
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

            {/* Charts and other dashboard components */}
            {/* Sales Chart */}
            <div className={styles.chartContainer}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>{t("monthlySales")}</h3>
                <span className={styles.chartPeriod}>{t("lastYear")}</span>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className={styles.cartesianGrid}
                  />
                  <XAxis dataKey="name" className={styles.axis} />
                  <YAxis className={styles.axis} />
                  <Tooltip className={styles.tooltip} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    className={styles.chartLine}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name={t("totalSales")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Products by Category Chart */}
            <div className={styles.chartGrid}>
              <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>{t("salesByCategory")}</h3>
                  <span className={styles.chartPeriod}>{t("currentYear")}</span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      className={styles.pieChart}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => {
                        const colors = [
                          "#013220", 
                          "#800020", 
                          "#01543a",
                          "#9a0025", 
                          "#017055", 
                          "#b4002d", 
                          "#019071", 
                          "#ce0035", 
                          "#01ab8d",
                          "#e8003e", 
                        ];

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                            stroke="#ffffff"
                            strokeWidth={1}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} ${t("watches")}`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
                        borderRadius: "4px",
                        border:
                          theme === "dark"
                            ? "1px solid #343a40"
                            : "1px solid #dee2e6",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        paddingTop: "1rem",
                        fontSize: "0.75rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Orders */}
              <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>{t("recentOrders")}</h3>
                  <span className={styles.chartPeriod}>{t("last24Hours")}</span>
                </div>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>{t("orderID")}</th>
                      <th className={styles.th}>{t("customer")}</th>
                      <th className={styles.th}>{t("product")}</th>
                      <th className={styles.th}>{t("amount")}</th>
                      <th className={styles.th}>{t("status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "#ORD-5531",
                        customer: "John Smith",
                        product: "Submariner",
                        amount: "$10,800",
                        status: "completed",
                      },
                      {
                        id: "#ORD-5530",
                        customer: "Emma Brown",
                        product: "Datejust",
                        amount: "$8,400",
                        status: "processing",
                      },
                      {
                        id: "#ORD-5529",
                        customer: "Michael Chen",
                        product: "GMT-Master II",
                        amount: "$11,500",
                        status: "completed",
                      },
                      {
                        id: "#ORD-5528",
                        customer: "Sarah Johnson",
                        product: "Day-Date",
                        amount: "$15,200",
                        status: "processing",
                      },
                      {
                        id: "#ORD-5527",
                        customer: "David Wilson",
                        product: "Explorer",
                        amount: "$7,200",
                        status: "completed",
                      },
                    ].map((order, index) => (
                      <tr key={index}>
                        <td className={styles.td}>{order.id}</td>
                        <td className={styles.td}>{order.customer}</td>
                        <td className={styles.td}>{order.product}</td>
                        <td className={styles.td}>{order.amount}</td>
                        <td className={styles.td}>
                          <span
                            className={`${styles.status} ${
                              styles[order.status]
                            }`}
                          >
                            {t(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>{t("topSellingProducts")}</h3>
                <span className={styles.chartPeriod}>{t("thisMonth")}</span>
              </div>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>{t("product")}</th>
                    <th className={styles.th}>{t("price")}</th>
                    <th className={styles.th}>{t("sold")}</th>
                    <th className={styles.th}>{t("revenue")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Submariner Date",
                      model: "Ref. 126610LN",
                      price: "$10,800",
                      sold: 42,
                      revenue: "$453,600",
                    },
                    {
                      name: "Datejust 41",
                      model: "Ref. 126334",
                      price: "$8,400",
                      sold: 37,
                      revenue: "$310,800",
                    },
                    {
                      name: "GMT-Master II",
                      model: "Ref. 126710BLRO",
                      price: "$11,500",
                      sold: 30,
                      revenue: "$345,000",
                    },
                    {
                      name: "Daytona",
                      model: "Ref. 116500LN",
                      price: "$14,500",
                      sold: 25,
                      revenue: "$362,500",
                    },
                    {
                      name: "Oyster Perpetual 41",
                      model: "Ref. 124300",
                      price: "$6,300",
                      sold: 23,
                      revenue: "$144,900",
                    },
                  ].map((product, index) => (
                    <tr key={index}>
                      <td className={styles.td}>
                        <div>
                          <div>{product.name}</div>
                          <div className={styles.modelText}>
                            {product.model}
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>{product.price}</td>
                      <td className={styles.td}>{product.sold}</td>
                      <td className={styles.td}>{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* ... */}
          </>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className={styles.tableContainer}>
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
                              $
                              {product.price
                                ? Number(product.price).toLocaleString()
                                : "0"}
                            </td>
                            <td className={styles.td}>
                              <button
                                className={`${styles.actionButton} ${styles.editButton}`}
                                onClick={() =>
                                  openModal("editProduct", product)
                                }
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className={styles.tableContainer}>
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
                            <td className={styles.td}>{user.name || "-"}</td>
                            <td className={styles.td}>{user.email}</td>
                            <td className={styles.td}>
                              {user.role || t("user")}
                            </td>
                            <td className={styles.td}>
                              {user.created_at
                                ? new Date(user.created_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className={styles.td}>
                              <button
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={() => deleteUser(user.user_id)}
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
                              ? t("noUsersFound")
                              : t("noUsersAvailable")}
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

        {/* Blogs Tab */}
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
                    <th className={styles.th}>{t("date")}</th>
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
                        <td className={styles.td}>{blog.date}</td>
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
                      <td colSpan="7" className={styles.noData}>
                        {searchTerm ? t("noBlogsFound") : t("noBlogsAvailable")}
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
                  {modalType === "addBlog" && t("addBlog")}
                  {modalType === "editBlog" && t("editBlog")}
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
                  <div>
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
                  </div>
                )}

                {/* Blog Form */}
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

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t("blog.date")}</label>
                        <input
                          type="date"
                          name="date"
                          className={styles.input}
                          value={blogFormData.date || ""}
                          onChange={handleBlogFormChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.readTime")}
                        </label>
                        <input
                          type="text"
                          name="read_time"
                          className={styles.input}
                          value={blogFormData.read_time || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: 5 min"
                        />
                      </div>
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

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t("blog.gallery")}
                      </label>
                      <textarea
                        name="gallery"
                        className={styles.textarea}
                        value={blogFormData.gallery || ""}
                        onChange={handleBlogFormChange}
                        rows="2"
                        placeholder="Image URLs (comma-separated)"
                      ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        className={styles.label}
                        style={{ fontWeight: "bold" }}
                      >
                        {t("blog.watchDetails")}
                      </label>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.diameter")}
                        </label>
                        <input
                          type="text"
                          name="diameter"
                          className={styles.input}
                          value={blogFormData.diameter || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: 40mm"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.movement")}
                        </label>
                        <input
                          type="text"
                          name="movement"
                          className={styles.input}
                          value={blogFormData.movement || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: Automatic"
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.material")}
                        </label>
                        <input
                          type="text"
                          name="material"
                          className={styles.input}
                          value={blogFormData.material || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: Stainless Steel"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.waterResistance")}
                        </label>
                        <input
                          type="text"
                          name="water_resistance"
                          className={styles.input}
                          value={blogFormData.water_resistance || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: 300m"
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.power")}
                        </label>
                        <input
                          type="text"
                          name="power"
                          className={styles.input}
                          value={blogFormData.power || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: 70 hours"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          {t("blog.bezel")}
                        </label>
                        <input
                          type="text"
                          name="bezel"
                          className={styles.input}
                          value={blogFormData.bezel || ""}
                          onChange={handleBlogFormChange}
                          placeholder="Ex: Ceramic"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* User Form */}
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
                    {modalType === "addBlog" && t("blog.add")}
                    {modalType === "editBlog" && t("blog.update")}
                    {modalType === "addUser" && t("user.add")}
                    {modalType === "editUser" && t("user.update")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
