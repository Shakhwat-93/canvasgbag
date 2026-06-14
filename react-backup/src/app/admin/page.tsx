import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Sliders,
  Palette,
  Plus,
  Trash2,
  Edit,
  LogOut,
  X,
  TrendingUp,
  Check,
  ExternalLink,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, SiteSettings } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";
import type { Product, Category, ProductVariant } from "@/lib/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const {
    products,
    categories,
    orders,
    settings,
    theme,
    setTheme,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    deleteOrder,
    updateSettings,
  } = useStore();

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "settings" | "theme">("dashboard");

  const [customSolidColor, setCustomSolidColor] = useState("#86E237");
  const [customSolidFg, setCustomSolidFg] = useState("dark");
  const [customGradStart, setCustomGradStart] = useState("#86E237");
  const [customGradEnd, setCustomGradEnd] = useState("#FF6B35");
  const [customGradFg, setCustomGradFg] = useState("light");

  // Authentication check on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(error.message);
        toast.error(error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
        toast.success("Welcome back, Admin!");
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred during login.");
      toast.error(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setEmail("");
      setPassword("");
      toast.success("Successfully logged out.");
    } catch (err: any) {
      toast.error(err.message || "Error logging out.");
    } finally {
      setLoading(false);
    }
  };

  // State variables for Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [additionalUrlInput, setAdditionalUrlInput] = useState("");
  const [productForm, setProductForm] = useState<{
    name: string;
    price: string;
    compareAtPrice: string;
    categorySlug: string;
    shortDescription: string;
    story: string;
    imageUrl: string;
    specs: string;
    benefits: string;
    isBestSeller: boolean;
    badge: string;
    variants: ProductVariant[];
    additionalImages: string[];
  }>({
    name: "",
    price: "",
    compareAtPrice: "",
    categorySlug: "",
    shortDescription: "",
    story: "",
    imageUrl: "",
    specs: "",
    benefits: "",
    isBestSeller: false,
    badge: "",
    variants: [],
    additionalImages: [],
  });

  // State variables for Category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });



  // State for settings page edit
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Unsaved changes state hooks
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Success Confirmation Modal (SweetAlert style)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalConfig, setSuccessModalConfig] = useState({
    title: "",
    description: "",
  });

  // Modal Discard Confirmation
  const [modalDiscardConfirmation, setModalDiscardConfirmation] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
    description: string;
  }>({
    isOpen: false,
    onConfirm: () => {},
    title: "",
    description: "",
  });

  const hasUnsavedSettings = useMemo(() => {
    return JSON.stringify(settingsForm) !== JSON.stringify(settings);
  }, [settingsForm, settings]);

  const isProductFormDirty = useMemo(() => {
    if (!isProductModalOpen) return false;
    if (editingProduct) {
      const specsArray = productForm.specs
        ? productForm.specs.split("\n").map((s) => s.trim()).filter(Boolean)
        : ["Premium canvas material", "Practical carry system"];
      const benefitsArray = productForm.benefits
        ? productForm.benefits.split("\n").map((b) => b.trim()).filter(Boolean)
        : ["High durability", "Sleek look"];
      
      const defaultVariant: ProductVariant = {
        id: `var-${Date.now()}`,
        name: `${productForm.name} - Standard`,
        colorCode: "#121212",
        image: productForm.imageUrl || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
        price: Number(productForm.price),
        inStock: true,
      };

      const finalVariants = productForm.variants.length > 0
        ? productForm.variants.map((v) => ({
            ...v,
            price: Number(productForm.price),
            image: v.image || productForm.imageUrl || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
          }))
        : [defaultVariant];

      const hasDiff = 
        productForm.name !== editingProduct.name ||
        Number(productForm.price) !== editingProduct.price ||
        (productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined) !== editingProduct.compareAtPrice ||
        productForm.categorySlug !== editingProduct.categorySlug ||
        productForm.shortDescription !== editingProduct.shortDescription ||
        productForm.story !== (editingProduct.story || "") ||
        productForm.imageUrl !== (editingProduct.images[0]?.url || "") ||
        JSON.stringify(specsArray) !== JSON.stringify(editingProduct.specs) ||
        JSON.stringify(benefitsArray) !== JSON.stringify(editingProduct.benefits) ||
        productForm.isBestSeller !== !!editingProduct.isBestSeller ||
        productForm.badge !== (editingProduct.badge || "") ||
        JSON.stringify(productForm.additionalImages) !== JSON.stringify(editingProduct.images.slice(1).map(img => img.url)) ||
        JSON.stringify(finalVariants.map(v => ({ name: v.name, price: v.price, colorCode: v.colorCode, image: v.image, inStock: v.inStock }))) !==
        JSON.stringify((editingProduct.variants || []).map(v => ({ name: v.name, price: v.price, colorCode: v.colorCode, image: v.image, inStock: v.inStock })));
      
      return hasDiff;
    } else {
      return (
        productForm.name !== "" ||
        productForm.price !== "" ||
        productForm.compareAtPrice !== "" ||
        productForm.shortDescription !== "" ||
        productForm.story !== "" ||
        productForm.imageUrl !== "" ||
        productForm.specs !== "" ||
        productForm.benefits !== "" ||
        productForm.isBestSeller !== false ||
        productForm.badge !== "" ||
        productForm.additionalImages.length > 0 ||
        productForm.variants.length > 1 ||
        (productForm.variants.length === 1 && (
          productForm.variants[0].name !== "Standard" ||
          productForm.variants[0].colorCode !== "#121212" ||
          productForm.variants[0].image !== "" ||
          productForm.variants[0].price !== 0
        ))
      );
    }
  }, [productForm, editingProduct, isProductModalOpen]);

  const isCategoryFormDirty = useMemo(() => {
    if (!isCategoryModalOpen) return false;
    if (editingCategory) {
      return (
        categoryForm.name !== editingCategory.name ||
        categoryForm.slug !== editingCategory.slug ||
        categoryForm.description !== editingCategory.description ||
        categoryForm.image !== editingCategory.image
      );
    } else {
      return (
        categoryForm.name !== "" ||
        categoryForm.slug !== "" ||
        categoryForm.description !== "" ||
        categoryForm.image !== ""
      );
    }
  }, [categoryForm, editingCategory, isCategoryModalOpen]);

  const hasUnsavedChanges = useMemo(() => {
    return hasUnsavedSettings || (isProductModalOpen && isProductFormDirty) || (isCategoryModalOpen && isCategoryFormDirty);
  }, [hasUnsavedSettings, isProductModalOpen, isProductFormDirty, isCategoryModalOpen, isCategoryFormDirty]);

  const unsavedType = useMemo(() => {
    if (hasUnsavedSettings) return "settings";
    if (isProductModalOpen && isProductFormDirty) return "product";
    if (isCategoryModalOpen && isCategoryFormDirty) return "category";
    return null;
  }, [hasUnsavedSettings, isProductModalOpen, isProductFormDirty, isCategoryModalOpen, isCategoryFormDirty]);

  // Alert on tab close/refresh if settings are unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleInterceptAction = (action: string, executeImmediately: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(action);
      setIsUnsavedModalOpen(true);
    } else {
      executeImmediately();
    }
  };

  const handlePendingActionExecute = async (mode: "save" | "discard") => {
    setIsUnsavedModalOpen(false);
    if (!pendingAction) return;

    if (mode === "save" && unsavedType === "settings") {
      try {
        updateSettings(settingsForm);
        toast.success("Page settings saved successfully!");
        setSuccessModalConfig({
          title: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
          description: "আপনার পরিবর্তনগুলো লাইভ ওয়েবসাইটে আপডেট করা হয়েছে।",
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 1800);
      } catch (err: any) {
        console.error(err);
        toast.error("Error: Settings size exceeds storage quota.");
        setPendingAction(null);
        return; // Stop if saving failed
      }
    } else {
      // Discard changes
      if (unsavedType === "settings") {
        setSettingsForm({ ...settings });
      } else if (unsavedType === "product") {
        setIsProductModalOpen(false);
        setEditingProduct(null);
      } else if (unsavedType === "category") {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
      }
    }

    // Now execute the pending action
    const [type, value] = pendingAction.split(":");
    if (type === "tab") {
      setActiveTab(value as any);
      setIsMobileMenuOpen(false);
    } else if (type === "action") {
      if (value === "logout") {
        await handleLogout();
        setIsMobileMenuOpen(false);
      } else if (value === "storefront") {
        navigate("/");
      }
    }
    setPendingAction(null);
  };

  const handleCloseProductModal = () => {
    if (isProductFormDirty) {
      setModalDiscardConfirmation({
        isOpen: true,
        title: "পরিবর্তনগুলো বাতিল করতে চান?",
        description: "পণ্য বিবরণীতে কিছু পরিবর্তন করা হয়েছে যা সংরক্ষণ করা হয়নি। আপনি কি নিশ্চিত যে আপনি এটি বাতিল করতে চান?",
        onConfirm: () => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
          setModalDiscardConfirmation((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleCloseCategoryModal = () => {
    if (isCategoryFormDirty) {
      setModalDiscardConfirmation({
        isOpen: true,
        title: "পরিবর্তনগুলো বাতিল করতে চান?",
        description: "ক্যাটাগরি বিবরণীতে কিছু পরিবর্তন করা হয়েছে যা সংরক্ষণ করা হয়নি। আপনি কি নিশ্চিত যে আপনি এটি বাতিল করতে চান?",
        onConfirm: () => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
          setModalDiscardConfirmation((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    }
  };

  // Premium Mobile Responsive & Confirmation States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: "product" | "category" | "order" | null;
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: "",
    name: "",
  });

  const handleConfirmDelete = () => {
    const { type, id, name } = deleteConfirmation;
    let displayType = "";
    if (type === "product") {
      deleteProduct(id);
      toast.success(`Product "${name}" deleted successfully!`);
      displayType = "প্রোডাক্ট";
    } else if (type === "category") {
      deleteCategory(id);
      toast.success(`Category "${name}" deleted successfully!`);
      displayType = "ক্যাটাগরি";
    } else if (type === "order") {
      deleteOrder(id);
      toast.success(`Order "${name}" deleted successfully!`);
      displayType = "অর্ডার";
    }
    setDeleteConfirmation({ isOpen: false, type: null, id: "", name: "" });

    setSuccessModalConfig({
      title: `${displayType} সফলভাবে মুছে ফেলা হয়েছে!`,
      description: `"${name}" নামক ${displayType.toLowerCase()}টি আপনার ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।`,
    });
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 2000);
  };

  // WebP Image Compressors for Product and Category Creators
  const handleProductImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Cap max dimension to 700px for efficient WebP base64 conversion
        const MAX_DIM = 700;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to WebP format directly for maximum optimization
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.7);
          
          setProductForm((prev) => ({
            ...prev,
            imageUrl: compressedDataUrl,
          }));
          toast.success("Local image processed & compressed to optimized WebP format!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesUpload = (files: FileList) => {
    let loadedCount = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_DIM = 700;
          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/webp", 0.7);
            
            setProductForm((prev) => ({
              ...prev,
              additionalImages: [...prev.additionalImages, compressedDataUrl],
            }));
            loadedCount++;
            if (loadedCount === files.length) {
              toast.success(`${files.length} additional images added and compressed to WebP!`);
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCategoryImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Cap max dimension to 700px for WebP category image conversion
        const MAX_DIM = 700;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to WebP directly
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.7);
          
          setCategoryForm((prev) => ({
            ...prev,
            image: compressedDataUrl,
          }));
          toast.success("Category image processed & compressed to optimized WebP format!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Calculations for Dashboard Stats
  const confirmedOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;

  // Custom Chart Data: represent weekly distribution of sales (mock)
  const salesChartData = [
    { day: "Jan", sales: 180000, height: "h-[35%]" },
    { day: "Feb", sales: 240000, height: "h-[45%]" },
    { day: "Mar", sales: 490000, height: "h-[90%]" },
    { day: "Apr", sales: 320000, height: "h-[60%]" },
    { day: "May", sales: 410000, height: "h-[75%]" },
    { day: "Jun", sales: 290000, height: "h-[55%]" },
    { day: "Jul", sales: 380000, height: "h-[70%]" },
  ];

  // Handler for product form submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.slug === productForm.categorySlug);

    const specsArray = productForm.specs
      ? productForm.specs.split("\n").map((s) => s.trim()).filter(Boolean)
      : ["Premium canvas material", "Practical carry system"];
    
    const benefitsArray = productForm.benefits
      ? productForm.benefits.split("\n").map((b) => b.trim()).filter(Boolean)
      : ["High durability", "Sleek look"];

    const slug = productForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const defaultVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      name: `${productForm.name} - Standard`,
      colorCode: "#121212",
      image: productForm.imageUrl || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      price: Number(productForm.price),
      inStock: true,
    };

    const finalVariants = productForm.variants.length > 0
      ? productForm.variants.map((v) => ({
          ...v,
          price: Number(productForm.price),
          image: v.image || productForm.imageUrl || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
        }))
      : [defaultVariant];

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: productForm.name,
      slug,
      categorySlug: productForm.categorySlug || "everyday-totes",
      categoryName: category ? category.name : "Everyday Totes",
      price: Number(productForm.price),
      compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewCount: editingProduct ? editingProduct.reviewCount : 12,
      shortDescription: productForm.shortDescription,
      story: productForm.story || "A versatile carry solution built for active routines.",
      benefits: benefitsArray,
      specs: specsArray,
      images: [
        {
          id: `img-1`,
          url: productForm.imageUrl || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
          alt: productForm.name,
        },
        ...productForm.additionalImages.map((url, idx) => ({
          id: `img-add-${idx}-${Date.now()}`,
          url: url,
          alt: `${productForm.name} Showcase Image ${idx + 1}`,
        })),
      ],
      variants: finalVariants,
      isBestSeller: productForm.isBestSeller,
      badge: productForm.badge || undefined,
    };

    if (editingProduct) {
      updateProduct(newProduct);
      toast.success(`Product "${newProduct.name}" updated successfully!`);
      setSuccessModalConfig({
        title: "প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!",
        description: `"${newProduct.name}" প্রোডাক্টটি সফলভাবে আপডেট করা হয়েছে এবং লাইভ স্টোরে পরিবর্তনগুলো দেখা যাবে।`,
      });
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2000);
    } else {
      addProduct(newProduct);
      toast.success(`Product "${newProduct.name}" created successfully!`);
      setSuccessModalConfig({
        title: "প্রোডাক্ট সফলভাবে যুক্ত করা হয়েছে!",
        description: `"${newProduct.name}" প্রোডাক্টটি আপনার ক্যাটালগে সফলভাবে যুক্ত করা হয়েছে।`,
      });
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2000);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      compareAtPrice: "",
      categorySlug: "",
      shortDescription: "",
      story: "",
      imageUrl: "",
      specs: "",
      benefits: "",
      isBestSeller: false,
      badge: "",
      variants: [],
      additionalImages: [],
    });
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: String(prod.price),
      compareAtPrice: prod.compareAtPrice ? String(prod.compareAtPrice) : "",
      categorySlug: prod.categorySlug,
      shortDescription: prod.shortDescription,
      story: prod.story || "",
      imageUrl: prod.images[0]?.url || "",
      specs: prod.specs.join("\n"),
      benefits: prod.benefits.join("\n"),
      isBestSeller: !!prod.isBestSeller,
      badge: prod.badge || "",
      variants: prod.variants || [],
      additionalImages: (prod.images || []).slice(1).map((img) => img.url),
    });
    setIsProductModalOpen(true);
  };

  // Handler for category form submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawSlug = categoryForm.slug || categoryForm.name;
    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const newCategory: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: categoryForm.name,
      slug,
      description: categoryForm.description,
      image: categoryForm.image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      productCount: products.filter((p) => p.categorySlug === slug).length,
    };

    if (editingCategory) {
      updateCategory(newCategory);
      toast.success(`Category "${newCategory.name}" updated successfully!`);
      setSuccessModalConfig({
        title: "ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!",
        description: `"${newCategory.name}" ক্যাটাগরিটি সফলভাবে আপডেট করা হয়েছে।`,
      });
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2000);
    } else {
      addCategory(newCategory);
      toast.success(`Category "${newCategory.name}" created successfully!`);
      setSuccessModalConfig({
        title: "ক্যাটাগরি সফলভাবে যুক্ত করা হয়েছে!",
        description: `"${newCategory.name}" ক্যাটাগরিটি আপনার স্টোরে সফলভাবে যুক্ত করা হয়েছে।`,
      });
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2000);
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      image: "",
    });
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
    });
    setIsCategoryModalOpen(true);
  };

  const handleImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Cap max dimension to 800px for web compression
        const MAX_DIM = 800;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.7 quality to reduce base64 size significantly
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          
          setSettingsForm((prev) => ({
            ...prev,
            [key]: compressedDataUrl,
          }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      toast.success("Page settings saved successfully!");
      setSuccessModalConfig({
        title: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
        description: "আপনার পরিবর্তনগুলো লাইভ ওয়েবসাইটে আপডেট করা হয়েছে।",
      });
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 1800);
    } catch (err: any) {
      console.error(err);
      toast.error("Error: Settings size exceeds storage quota. Please try using a smaller image file or a URL link instead.");
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-poppins">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-900/10 animate-ping opacity-75 animate-[ping_2s_infinite]" />
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg relative z-10">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-slate-900 rounded-full animate-[loading_1.5s_infinite_linear]" style={{
              animation: 'loading 1s infinite ease-in-out'
            }} />
          </div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-2">Securing Connection...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden font-poppins">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-800 mb-4 shadow-sm">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">CanvasBag Control Hub</h1>
            <p className="text-sm text-slate-500 mt-2">Sign in to manage your premium store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@canvasbag.com"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all placeholder:text-slate-400 text-sm font-medium"
                autoFocus
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all placeholder:text-slate-400 text-sm font-medium"
                disabled={loading}
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50/80 border border-red-100 p-3 rounded-lg text-center leading-relaxed">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-all text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Secured with Supabase Auth
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderSidebarContents = (isMobile = false) => (
    <>
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-sm">
            🎒
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">CanvasBag</h2>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Control Center</span>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      <nav className="space-y-1 flex-1">
        <button
          onClick={() => handleInterceptAction("tab:dashboard", () => {
            setActiveTab("dashboard");
            if (isMobile) setIsMobileMenuOpen(false);
          })}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "dashboard"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          Dashboard Overview
        </button>

        <button
          onClick={() => handleInterceptAction("tab:products", () => {
            setActiveTab("products");
            if (isMobile) setIsMobileMenuOpen(false);
          })}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          Products Catalog
        </button>

        <button
          onClick={() => handleInterceptAction("tab:categories", () => {
            setActiveTab("categories");
            if (isMobile) setIsMobileMenuOpen(false);
          })}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          Categories Map
        </button>



        <button
          onClick={() => handleInterceptAction("tab:settings", () => {
            setActiveTab("settings");
            if (isMobile) setIsMobileMenuOpen(false);
          })}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          Page Settings
        </button>

        <button
          onClick={() => handleInterceptAction("tab:theme", () => {
            setActiveTab("theme");
            if (isMobile) setIsMobileMenuOpen(false);
          })}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "theme"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Palette className="w-4 h-4 shrink-0" />
          Theme Accent
        </button>
      </nav>

      {/* Demo Storefront Link */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center relative overflow-hidden group">
        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Demo Storefront</p>
        <p className="text-[11px] text-slate-500 mt-1">Make changes here to see them instantly on the storefront.</p>
        <Link
          to="/"
          onClick={(e) => {
            if (hasUnsavedChanges) {
              e.preventDefault();
              handleInterceptAction("action:storefront", () => {
                navigate("/");
              });
            } else {
              if (isMobile) setIsMobileMenuOpen(false);
            }
          }}
          className="mt-3.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:underline"
        >
          Storefront
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <button
        onClick={() => handleInterceptAction("action:logout", () => {
          handleLogout();
          if (isMobile) setIsMobileMenuOpen(false);
        })}
        className="mt-6 w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer animate-duration-200"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Exit Session
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-poppins flex flex-col md:flex-row relative">
      
      {/* Dynamic theme accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/40 z-20" />

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-100 p-4 sticky top-0 z-30 shadow-xs w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-sm">
            🎒
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">CanvasBag</h2>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Control Center</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 rounded-lg hover:bg-slate-50 border border-slate-100 text-slate-650 transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
            />
            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white z-50 p-5 flex flex-col shadow-xl md:hidden overflow-y-auto"
            >
              {renderSidebarContents(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 p-5 flex-col shrink-0 sticky top-0 h-screen">
        {renderSidebarContents(false)}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-65px)] md:max-h-screen relative">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Management Console</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 capitalize">{activeTab} Interface</h1>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400 font-semibold">Active theme:</span>
            <span className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-slate-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {theme}
            </span>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Bento Stats row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales (BDT)</span>
                <p className="text-2xl font-bold text-slate-900 mt-2 leading-none">{formatCurrency(totalRevenue)}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.4% vs last week</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders Registered</span>
                <p className="text-2xl font-bold text-slate-900 mt-2 leading-none">{totalOrders}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="text-amber-600 font-semibold">{orders.filter(o => o.status === "pending").length} pending</span>
                  <span>confirmation call</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
                <p className="text-2xl font-bold text-slate-900 mt-2 leading-none">{activeProducts}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="text-slate-800 font-bold">{categories.length}</span>
                  <span>different bag types</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color Theme</span>
                <p className="text-2xl font-bold text-slate-900 mt-2 leading-none uppercase tracking-wide flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary border border-slate-200" />
                  {theme}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-900 font-semibold hover:underline cursor-pointer" onClick={() => setActiveTab("theme")}>
                  <span>Change color accent →</span>
                </div>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Cash Flow Summary</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Mocked monthly revenue overview in BDT</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 uppercase tracking-wider">
                    2026 Sandbox
                  </span>
                </div>

                {/* SVG/Div Chart */}
                <div className="h-64 flex items-end gap-3.5 pt-4 border-b border-slate-100 relative">
                  {salesChartData.map((data) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group">
                      <div className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.sales / 1000}k
                      </div>
                      <div
                        className={`w-full rounded-t-md bg-slate-100 hover:bg-primary transition-all duration-300 ${data.height}`}
                      />
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors pb-2">
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Orders</h3>
                </div>

                <div className="flex-1 space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-none truncate">{order.customerName}</p>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1 uppercase">
                          {order.id} · {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          order.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : order.status === "cancelled"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs font-bold text-slate-900 leading-none">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Store Catalog ({products.length} Items)
              </h3>
              
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    price: "",
                    compareAtPrice: "",
                    categorySlug: categories[0]?.slug || "everyday-totes",
                    shortDescription: "",
                    story: "",
                    imageUrl: "",
                    specs: "",
                    benefits: "",
                    isBestSeller: false,
                    badge: "",
                    variants: [
                      {
                        id: `var-${Date.now()}`,
                        name: "Standard",
                        colorCode: "#121212",
                        image: "",
                        price: 0,
                        inStock: true,
                      }
                    ],
                    additionalImages: [],
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/5] bg-slate-50 border-b border-slate-100">
                    <img
                      src={product.images[0]?.url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {product.isBestSeller && (
                      <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Best Seller
                      </span>
                    )}
                    {product.badge && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}

                    {/* Quick actions overlay */}
                    <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 text-slate-800 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmation({
                            isOpen: true,
                            type: "product",
                            id: product.id,
                            name: product.name,
                          });
                        }}
                        className="w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                        {product.categoryName}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 mt-1 leading-tight line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="mt-3 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Product Categories Map
              </h3>
              
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({
                    name: "",
                    slug: "",
                    description: "",
                    image: "",
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative min-h-[160px] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="text-slate-400 hover:text-slate-850 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirmation({
                              isOpen: true,
                              type: "category",
                              id: cat.id,
                              name: cat.name,
                            });
                          }}
                          className="text-slate-400 hover:text-red-650 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                    <span>SLUG: <code className="text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded font-mono lowercase">{cat.slug}</code></span>
                    <span className="text-slate-500 font-bold">
                      {products.filter((p) => p.categorySlug === cat.slug).length} products
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === "settings" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm max-w-3xl">
            <h3 className="text-sm font-bold text-slate-805 uppercase tracking-wider mb-6">
              Page-wise Content Config
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 uppercase tracking-wider">Announcement Top Bar</label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Hero Headline</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400 resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Hero Badge Text</label>
                    <input
                      type="text"
                      value={settingsForm.heroSubheadline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={settingsForm.heroMobileFourCards ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroMobileFourCards: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                      />
                      <span>Optimize Mobile Hero Layout (Show 4 cards instead of 7)</span>
                    </label>
                    <p className="text-[10px] text-slate-400 pl-6">
                      When enabled, shows 4 spacious cards in a beautiful 2x2 grid on mobile view instead of a cluttered 7-card layout.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Marketing & Tracking Integration</h4>
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Google Tag Manager (GTM) Container ID</label>
                  <input
                    type="text"
                    value={settingsForm.gtmId || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gtmId: e.target.value })}
                    placeholder="e.g. GTM-XXXXXXX"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                  <p className="text-[10px] text-slate-400">Loads GTM container scripts inside head and noscript tags. Automatically enables full GA4 E-Commerce Data Layer tracking (view_item, add_to_cart, remove_from_cart, begin_checkout, add_shipping_info, purchase).</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Order Settings & Security</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Duplicate Order Block Time Limit (Hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={settingsForm.duplicateBlockHours ?? 6}
                      onChange={(e) => setSettingsForm({ ...settingsForm, duplicateBlockHours: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 6"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                    <p className="text-[10px] text-slate-400">Block duplicate orders from the same phone number or IP address within this hour threshold.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Inside Dhaka Delivery (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.shippingInsideDhaka ?? 60}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shippingInsideDhaka: parseInt(e.target.value) || 0 })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                    <p className="text-[10px] text-slate-400">Inside Dhaka delivery charge.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Outside Dhaka Delivery (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.shippingOutsideDhaka ?? 130}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shippingOutsideDhaka: parseInt(e.target.value) || 0 })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                    <p className="text-[10px] text-slate-400">Outside Dhaka delivery charge.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Home Promo Section Settings</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Pill Badge Title</label>
                    <input
                      type="text"
                      value={settingsForm.promoTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoTitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Promo Headline</label>
                    <input
                      type="text"
                      value={settingsForm.promoHeadline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoHeadline: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Promo Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.promoDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDescription: e.target.value })}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Promo Button Link</label>
                    <input
                      type="text"
                      value={settingsForm.promoLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoLink: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-wider">Promo Button Label</label>
                    <input
                      type="text"
                      value={settingsForm.promoButtonText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoButtonText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Homepage Bento Images (7 Showcase Models)</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: "heroImage1", label: "Model 1 (Orange Tab Left)", default: "/brand/hero_orange_model.webp" },
                    { key: "heroImage2", label: "Model 2 (Kid Sunglasses)", default: "/brand/hero_kid_model.webp" },
                    { key: "heroImage3", label: "Model 3 (Green Coat)", default: "/brand/hero_green_model.webp" },
                    { key: "heroImage4", label: "Model 4 (Yellow Hat Center)", default: "/brand/hero_yellow_model.webp" },
                    { key: "heroImage5", label: "Model 5 (Blue Tracksuit)", default: "/brand/hero_blue_model.webp" },
                    { key: "heroImage6", label: "Model 6 (Mint Tab Right)", default: "/brand/hero_mint_model.webp" },
                    { key: "heroImage7", label: "Model 7 (Dark Green Suit)", default: "/brand/hero_dark_green_model.webp" },
                  ].map((img) => {
                    const value = (settingsForm as any)[img.key] || img.default;
                    return (
                      <div key={img.key} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative bg-white">
                          <img
                            src={value}
                            alt={img.label}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{img.label}</label>
                          <input
                            type="text"
                            value={(settingsForm as any)[img.key] || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, [img.key]: e.target.value })}
                            placeholder={img.default}
                            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-800 focus:outline-none focus:border-slate-400"
                          />
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded cursor-pointer font-bold inline-flex items-center gap-1 transition-colors">
                              Upload File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(img.key, file);
                                }}
                              />
                            </label>
                            {((settingsForm as any)[img.key]) && (
                              <button
                                type="button"
                                onClick={() => setSettingsForm({ ...settingsForm, [img.key]: "" })}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Apply Page Customizations
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Theme */}
        {activeTab === "theme" && (
          <div className="space-y-6 text-xs max-w-4xl">
            {/* Header Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Color Theme Designer
              </h3>
              <p className="text-slate-500 font-normal">
                Choose an elite-level accent color theme for the CanvasBag storefront. The UI adapts instantly.
              </p>
            </div>

            {/* Curated Presets Container */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Premium Solids Presets */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-slate-900 rounded-sm" />
                  Premium Solid Accents
                </h4>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {[
                    { id: "lime", name: "Cyber Lime", color: "#86E237", class: "bg-[#86E237]" },
                    { id: "orange", name: "Electric Orange", color: "#FF6B35", class: "bg-[#FF6B35]" },
                    { id: "purple", name: "Royal Purple", color: "#9B51E0", class: "bg-[#9B51E0]" },
                    { id: "blue", name: "Classic Blue", color: "#3C99DC", class: "bg-[#3C99DC]" },
                    { id: "pink", name: "Hot Pink", color: "#FF4081", class: "bg-[#FF4081]" },
                    { id: "hex:#10B981,light", name: "Emerald Green", color: "#10B981", class: "bg-[#10B981]" },
                    { id: "hex:#F43F5E,light", name: "Crimson Rose", color: "#F43F5E", class: "bg-[#F43F5E]" },
                    { id: "hex:#1E293B,light", name: "Midnight Slate", color: "#1E293B", class: "bg-[#1E293B]" },
                  ].map((opt) => {
                    const isActive = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setTheme(opt.id);
                          toast.success(`Theme switched to ${opt.name}!`);
                          setSuccessModalConfig({
                            title: "থিম কালার পরিবর্তন করা হয়েছে!",
                            description: `আপনার ওয়েবসাইটের প্রাইমারি কালার সফলভাবে "${opt.name}" এ সেট করা হয়েছে।`,
                          });
                          setIsSuccessModalOpen(true);
                          setTimeout(() => {
                            setIsSuccessModalOpen(false);
                          }, 1800);
                        }}
                        className={`p-3 rounded-2xl bg-white border flex flex-col items-center gap-3 transition-all cursor-pointer hover:bg-slate-50 group ${
                          isActive ? "border-slate-900 shadow-xs" : "border-slate-100"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full ${opt.class} flex items-center justify-center text-white border border-slate-200 group-hover:scale-105 transition-transform`}>
                          {isActive && <Check className="w-4 h-4 text-white stroke-[3.5px]" />}
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-slate-800 leading-none truncate max-w-full">{opt.name}</p>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-1 uppercase">{opt.color}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Premium Gradients Presets */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-slate-900 rounded-sm" />
                  Premium Gradient Accents
                </h4>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {[
                    { id: "gradient:#F97316,#EF4444,light", name: "Sunset Glow", color: "Orange-Red", style: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)" },
                    { id: "gradient:#6366F1,#A855F7,light", name: "Cosmic Nebula", color: "Indigo-Purple", style: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)" },
                    { id: "gradient:#06B6D4,#3B82F6,light", name: "Oceanic Deep", color: "Cyan-Blue", style: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" },
                    { id: "gradient:#10B981,#14B8A6,light", name: "Forest Magic", color: "Emerald-Teal", style: "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)" },
                    { id: "gradient:#FBBF24,#F97316,dark", name: "Golden Hour", color: "Yellow-Orange", style: "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)" },
                    { id: "gradient:#EC4899,#8B5CF6,light", name: "Neon Plasma", color: "Pink-Violet", style: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)" },
                  ].map((opt) => {
                    const isActive = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setTheme(opt.id);
                          toast.success(`Theme switched to ${opt.name}!`);
                          setSuccessModalConfig({
                            title: "থিম কালার পরিবর্তন করা হয়েছে!",
                            description: `আপনার ওয়েবসাইটের প্রাইমারি কালার সফলভাবে "${opt.name}" এ সেট করা হয়েছে।`,
                          });
                          setIsSuccessModalOpen(true);
                          setTimeout(() => {
                            setIsSuccessModalOpen(false);
                          }, 1800);
                        }}
                        className={`p-3 rounded-2xl bg-white border flex flex-col items-center gap-3 transition-all cursor-pointer hover:bg-slate-50 group ${
                          isActive ? "border-slate-900 shadow-xs" : "border-slate-100"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-slate-200 group-hover:scale-105 transition-transform"
                          style={{ backgroundImage: opt.style }}
                        >
                          {isActive && <Check className="w-4 h-4 text-white stroke-[3.5px]" />}
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-slate-800 leading-none truncate max-w-full">{opt.name}</p>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-1">{opt.color}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Accent Builders */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Solid Builder */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-slate-900 rounded-sm" />
                  Custom Solid Builder
                </h4>
                
                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm" style={{ backgroundColor: customSolidColor }}>
                      <input
                        type="color"
                        value={customSolidColor}
                        onChange={(e) => setCustomSolidColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accent HEX Color</label>
                      <input
                        type="text"
                        value={customSolidColor}
                        onChange={(e) => setCustomSolidColor(e.target.value)}
                        placeholder="#86E237"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[11px] text-slate-800 font-semibold uppercase focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Text Label Color (On Accent)</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 font-bold text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="solidFg"
                          checked={customSolidFg === "dark"}
                          onChange={() => setCustomSolidFg("dark")}
                          className="w-4 h-4 accent-slate-900"
                        />
                        Dark Text (Slate)
                      </label>
                      <label className="flex items-center gap-2 font-bold text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="solidFg"
                          checked={customSolidFg === "light"}
                          onChange={() => setCustomSolidFg("light")}
                          className="w-4 h-4 accent-slate-900"
                        />
                        Light Text (White)
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme(`hex:${customSolidColor},${customSolidFg}`);
                      toast.success("Custom solid theme applied successfully!");
                      setSuccessModalConfig({
                        title: "কাস্টম থিম কালার সেভ করা হয়েছে!",
                        description: `আপনার নির্বাচিত সলিড কালার (${customSolidColor.toUpperCase()}) সফলভাবে থিম কালার হিসেবে সেট করা হয়েছে।`,
                      });
                      setIsSuccessModalOpen(true);
                      setTimeout(() => {
                        setIsSuccessModalOpen(false);
                      }, 1800);
                    }}
                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                  >
                    Apply Custom Solid Theme
                  </button>
                </div>
              </div>

              {/* Gradient Builder */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-slate-900 rounded-sm" />
                  Custom Gradient Builder
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Color */}
                    <div className="flex gap-2.5 items-center">
                      <div className="relative w-10 h-10 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm" style={{ backgroundColor: customGradStart }}>
                        <input
                          type="color"
                          value={customGradStart}
                          onChange={(e) => setCustomGradStart(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Start Color</label>
                        <input
                          type="text"
                          value={customGradStart}
                          onChange={(e) => setCustomGradStart(e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-200 text-[10px] font-bold uppercase"
                        />
                      </div>
                    </div>

                    {/* End Color */}
                    <div className="flex gap-2.5 items-center">
                      <div className="relative w-10 h-10 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm" style={{ backgroundColor: customGradEnd }}>
                        <input
                          type="color"
                          value={customGradEnd}
                          onChange={(e) => setCustomGradEnd(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">End Color</label>
                        <input
                          type="text"
                          value={customGradEnd}
                          onChange={(e) => setCustomGradEnd(e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-slate-200 text-[10px] font-bold uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Text Label Color (On Gradient)</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 font-bold text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="gradFg"
                          checked={customGradFg === "dark"}
                          onChange={() => setCustomGradFg("dark")}
                          className="w-4 h-4 accent-slate-900"
                        />
                        Dark Text (Slate)
                      </label>
                      <label className="flex items-center gap-2 font-bold text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="gradFg"
                          checked={customGradFg === "light"}
                          onChange={() => setCustomGradFg("light")}
                          className="w-4 h-4 accent-slate-900"
                        />
                        Light Text (White)
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme(`gradient:${customGradStart},${customGradEnd},${customGradFg}`);
                      toast.success("Custom gradient theme applied successfully!");
                      setSuccessModalConfig({
                        title: "কাস্টম গ্রেডিয়েন্ট থিম সেভ করা হয়েছে!",
                        description: `আপনার নির্বাচিত গ্রেডিয়েন্ট (${customGradStart.toUpperCase()} → ${customGradEnd.toUpperCase()}) সফলভাবে থিম কালার হিসেবে সেট করা হয়েছে।`,
                      });
                      setIsSuccessModalOpen(true);
                      setTimeout(() => {
                        setIsSuccessModalOpen(false);
                      }, 1800);
                    }}
                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                  >
                    Apply Custom Gradient Theme
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: Add / Edit Product */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Create Product Entry"}
                </h3>
                <button
                  onClick={handleCloseProductModal}
                  className="text-slate-450 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Canvas Duffel Pro"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Category Classification</label>
                    <select
                      value={productForm.categorySlug}
                      onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer font-semibold"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Price (BDT)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 1850"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Compare at Price (BDT) - Optional</label>
                    <input
                      type="number"
                      value={productForm.compareAtPrice}
                      onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                      placeholder="e.g. 2400"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-500">Product Image Asset</label>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supports WebP upload</span>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr] items-start">
                    <div className="space-y-3">
                      {/* Image Upload Input */}
                      <div className="relative border border-dashed border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-4 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleProductImageUpload(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 group-hover:text-slate-700">
                          <span className="text-base">📤</span>
                          <span className="text-[11px] font-bold">Upload Local File</span>
                          <span className="text-[9px] text-slate-400 font-medium">Auto-convert to optimized WebP base64</span>
                        </div>
                      </div>

                      {/* Direct URL input fallback */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or Paste Direct URL</span>
                        <input
                          type="text"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          placeholder="e.g. https://images.unsplash.com/photo..."
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>

                    {/* Image Preview Block */}
                    <div className="space-y-1 w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preview</span>
                      <div className="relative aspect-square w-full rounded-xl bg-slate-50 border border-slate-150 overflow-hidden flex items-center justify-center">
                        {productForm.imageUrl ? (
                          <img
                            src={productForm.imageUrl}
                            alt="Product preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">No Image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Showcase Images */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-500">Additional Showcase Images (For Thumbnail Slider)</label>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supports multiple WebP uploads</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr] items-start">
                    <div className="space-y-3">
                      {/* Image Upload Input */}
                      <div className="relative border border-dashed border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-4 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              handleAdditionalImagesUpload(files);
                            }
                          }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 group-hover:text-slate-700">
                          <span className="text-base">📸</span>
                          <span className="text-[11px] font-bold">Upload Showcase Images</span>
                          <span className="text-[9px] text-slate-400 font-medium">Select one or more images</span>
                        </div>
                      </div>

                      {/* Direct URL input fallback */}
                      <div className="flex gap-2 items-end">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or Paste Direct URL</span>
                          <input
                            type="text"
                            value={additionalUrlInput}
                            onChange={(e) => setAdditionalUrlInput(e.target.value)}
                            placeholder="e.g. https://images.unsplash.com/photo..."
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (additionalUrlInput.trim()) {
                              setProductForm((prev) => ({
                                ...prev,
                                additionalImages: [...prev.additionalImages, additionalUrlInput.trim()],
                              }));
                              setAdditionalUrlInput("");
                              toast.success("Additional image URL added!");
                            }
                          }}
                          className="h-10 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>

                    {/* Additional Images Grid/Preview */}
                    <div className="space-y-1 w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Showcase Gallery ({productForm.additionalImages.length})</span>
                      {productForm.additionalImages.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 border border-slate-100 p-2 rounded-xl bg-slate-50 max-h-[140px] overflow-y-auto">
                          {productForm.additionalImages.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                              <img
                                src={url}
                                alt={`Showcase ${idx}`}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setProductForm((prev) => ({
                                    ...prev,
                                    additionalImages: prev.additionalImages.filter((_, i) => i !== idx),
                                  }));
                                }}
                                className="absolute top-1 right-1 bg-red-650/90 text-white hover:bg-red-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer transition-colors"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="relative aspect-square w-full rounded-xl bg-slate-50 border border-slate-150 overflow-hidden flex items-center justify-center">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">No Additional Images</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Variants Section */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Variants</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm((prev) => ({
                          ...prev,
                          variants: [
                            ...prev.variants,
                            {
                              id: `var-${Date.now()}`,
                              name: "",
                              colorCode: "#121212",
                              image: prev.imageUrl || "",
                              price: Number(prev.price) || 0,
                              inStock: true,
                            },
                          ],
                        }));
                      }}
                      className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {productForm.variants.map((v, idx) => (
                      <div key={v.id || idx} className="grid gap-3 sm:grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr_auto] items-end border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-400 text-[10px]">Variant Name</label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[idx] = { ...v, name: e.target.value };
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            placeholder="Stealth Black"
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400 text-[10px]">Color Code</label>
                          <input
                            type="text"
                            value={v.colorCode || ""}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[idx] = { ...v, colorCode: e.target.value };
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            placeholder="#121212"
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400 text-[10px]">Price (BDT)</label>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[idx] = { ...v, price: Number(e.target.value) };
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            placeholder="1450"
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400 text-[10px]">Image URL</label>
                          <input
                            type="text"
                            value={v.image}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[idx] = { ...v, image: e.target.value };
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            placeholder="/brand/..."
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400 text-[10px]">Stock Status</label>
                          <select
                            value={v.inStock ? "in" : "out"}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[idx] = { ...v, inStock: e.target.value === "in" };
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            className="w-full h-10 px-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer font-semibold"
                          >
                            <option value="in">In Stock</option>
                            <option value="out">Out of Stock</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          disabled={productForm.variants.length <= 1}
                          onClick={() => {
                            const updated = productForm.variants.filter((_, i) => i !== idx);
                            setProductForm({ ...productForm, variants: updated });
                          }}
                          className="text-red-500 hover:text-red-700 h-10 px-2 disabled:opacity-30 cursor-pointer flex items-center justify-center font-bold text-base"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Short Card Subtitle</label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    placeholder="e.g. Spacious active workout travel pack"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Brand Story (Long Details)</label>
                  <textarea
                    rows={2}
                    value={productForm.story}
                    onChange={(e) => setProductForm({ ...productForm, story: e.target.value })}
                    placeholder="Provide details about the utility design..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Specs (One per line)</label>
                    <textarea
                      rows={3}
                      value={productForm.specs}
                      onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                      placeholder={"Water-resistant shell\nDimensions: 45 x 30 x 20 cm"}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Benefits (One per line)</label>
                    <textarea
                      rows={3}
                      value={productForm.benefits}
                      onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                      placeholder={"Smart water container hold\nEasy quick grab side pouch"}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isBestSeller"
                      checked={productForm.isBestSeller}
                      onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-250 accent-slate-900 cursor-pointer"
                    />
                    <label htmlFor="isBestSeller" className="font-bold text-slate-700 cursor-pointer">
                      Flag as Best Seller
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Promo Badge Text</label>
                    <input
                      type="text"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      placeholder="Sale"
                      className="w-full h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseProductModal}
                    className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer"
                  >
                    {editingProduct ? "Save Changes" : "Insert Entry"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Add / Edit Category */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {editingCategory ? `Edit ${editingCategory.name}` : "Create Category"}
                </h3>
                <button
                  onClick={handleCloseCategoryModal}
                  className="text-slate-450 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Travel Duffels"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Category Slug (Optional)</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="e.g. travel-duffels"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 lowercase"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-500">Category Cover Image</label>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supports WebP upload</span>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr] items-start">
                    <div className="space-y-3">
                      {/* Image Upload Input */}
                      <div className="relative border border-dashed border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-4 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleCategoryImageUpload(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 group-hover:text-slate-700">
                          <span className="text-base">📤</span>
                          <span className="text-[11px] font-bold">Upload Local File</span>
                          <span className="text-[9px] text-slate-400 font-medium">Auto-convert to optimized WebP base64</span>
                        </div>
                      </div>

                      {/* Direct URL input fallback */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or Paste Direct URL</span>
                        <input
                          type="text"
                          value={categoryForm.image}
                          onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                          placeholder="e.g. https://images.unsplash.com/photo..."
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>

                    {/* Image Preview Block */}
                    <div className="space-y-1 w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preview</span>
                      <div className="relative aspect-square w-full rounded-xl bg-slate-50 border border-slate-150 overflow-hidden flex items-center justify-center">
                        {categoryForm.image ? (
                          <img
                            src={categoryForm.image}
                            alt="Category preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">No Image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Short Description</label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Describe what lifestyle of carry matches this category..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseCategoryModal}
                    className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer"
                  >
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Warning Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Are you sure you want to delete this {deleteConfirmation.type}?
                <span className="block font-bold text-slate-800 mt-1">{deleteConfirmation.name}</span>
                This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation({ isOpen: false, type: null, id: "", name: "" })}
                  className="flex-1 h-10 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 h-10 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Intercept warning Modal (SweetAlert style) */}
      <AnimatePresence>
        {isUnsavedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {unsavedType === "settings" ? "Unsaved Settings" : unsavedType === "product" ? "Unsaved Product" : "Unsaved Category"}
              </h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                {unsavedType === "settings"
                  ? "সেটিংস পেজে কিছু পরিবর্তন করা হয়েছে যা সংরক্ষণ করা হয়নি। আপনি কি প্রস্থান করার আগে পরিবর্তনগুলো সংরক্ষণ করতে চান?"
                  : unsavedType === "product"
                  ? "পণ্য বিবরণীতে কিছু পরিবর্তন করা হয়েছে যা সংরক্ষণ করা হয়নি। আপনি কি প্রস্থান করার আগে পরিবর্তনগুলো বাতিল করতে চান?"
                  : "ক্যাটাগরি বিবরণীতে কিছু পরিবর্তন করা হয়েছে যা সংরক্ষণ করা হয়নি। আপনি কি প্রস্থান করার আগে পরিবর্তনগুলো বাতিল করতে চান?"}
              </p>

              <div className="flex flex-col gap-2 mt-6">
                {unsavedType === "settings" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePendingActionExecute("save")}
                      className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      সংরক্ষণ করুন (Save & Continue)
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handlePendingActionExecute("discard")}
                        className="h-10 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        বাতিল করুন (Discard)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUnsavedModalOpen(false);
                          setPendingAction(null);
                        }}
                        className="h-10 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        চালিয়ে যান (Keep Editing)
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePendingActionExecute("discard")}
                      className="w-full h-10 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
                    >
                      বাতিল করে এগিয়ে যান (Discard & Continue)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUnsavedModalOpen(false);
                        setPendingAction(null);
                      }}
                      className="w-full h-10 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-xl cursor-pointer transition-all"
                    >
                      চালিয়ে যান (Keep Editing)
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Discard Confirmation Modal (SweetAlert style) */}
      <AnimatePresence>
        {modalDiscardConfirmation.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {modalDiscardConfirmation.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                {modalDiscardConfirmation.description}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalDiscardConfirmation((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 h-10 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  চালিয়ে যান (Keep Editing)
                </button>
                <button
                  type="button"
                  onClick={modalDiscardConfirmation.onConfirm}
                  className="flex-1 h-10 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
                >
                  বাতিল করুন (Discard)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Confirmation Modal (SweetAlert style) */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 relative text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle2 className="w-8 h-8 animate-[pulse_1.5s_infinite]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {successModalConfig.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                {successModalConfig.description}
              </p>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="mt-6 w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
              >
                ঠিক আছে (OK)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
