// ALFRED PRODUCTS - Main Script
// This script handles product generation, category filtering, and local image mapping.

// Placeholder image for products
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTIeMmUzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Supplier data for mockup
const suppliers = [
    { id: 1, name: "Premium Fashion Co.", verified: true, responseRate: 98, responseTime: "1h", products: 520, orders: 1200, rating: 4.9, avatar: "P" },
    { id: 2, name: "Tech Gadgets Direct", verified: true, responseRate: 95, responseTime: "2h", products: 340, orders: 890, rating: 4.8, avatar: "T" },
    { id: 3, name: "Beauty Essentials Ltd", verified: true, responseRate: 99, responseTime: "30m", products: 280, orders: 2100, rating: 4.9, avatar: "B" },
    { id: 4, name: "Global Bags Inc.", verified: true, responseRate: 92, responseTime: "3h", products: 450, orders: 750, rating: 4.7, avatar: "G" },
    { id: 5, name: "Sports Gear Pro", verified: false, responseRate: 88, responseTime: "4h", products: 190, orders: 320, rating: 4.5, avatar: "S" },
    { id: 6, name: "Home & Living Store", verified: true, responseRate: 96, responseTime: "1h", products: 620, orders: 1500, rating: 4.8, avatar: "H" },
    { id: 7, name: "Industrial Machines Co.", verified: true, responseRate: 94, responseTime: "2h", products: 150, orders: 280, rating: 4.6, avatar: "I" },
    { id: 8, name: "Kids World Trading", verified: true, responseRate: 97, responseTime: "1h", products: 380, orders: 980, rating: 4.7, avatar: "K" }
];

// Function to render supplier cards
function renderSupplierCard(supplier) {
    return `
        <div class="supplier-card">
            <div class="supplier-header">
                <div class="supplier-avatar">${supplier.avatar}</div>
                <div class="supplier-info">
                    <h4>${supplier.name} ${supplier.verified ? '<ion-icon name="checkmark-circle" style="color: var(--primary-color); font-size: 14px;"></ion-icon>' : ''}</h4>
                    <p>${supplier.products} products | ${supplier.orders}+ orders</p>
                </div>
            </div>
            <div class="supplier-stats">
                <div class="supplier-stat">
                    <div class="supplier-stat-value">${supplier.rating}</div>
                    <div class="supplier-stat-label">Rating</div>
                </div>
                <div class="supplier-stat">
                    <div class="supplier-stat-value">${supplier.responseRate}%</div>
                    <div class="supplier-stat-label">Response</div>
                </div>
                <div class="supplier-stat">
                    <div class="supplier-stat-value">${supplier.responseTime}</div>
                    <div class="supplier-stat-label">Response</div>
                </div>
            </div>
            <a href="supplier-profile.html?id=${supplier.id}" class="supplier-card-btn">View Profile</a>
        </div>
    `;
}

// Function to render modern product card with supplier info
function renderProductCard(product) {
    const supplier = suppliers[product.id % suppliers.length];
    const rating = (4 + Math.random()).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500) + 10;

    return `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" loading="lazy" alt="${product.title}" 
                     onerror="this.src='${PLACEHOLDER_IMAGE}'; this.onerror=null;"
                     onclick="event.preventDefault(); handleProductClick(${product.id})"
                     style="cursor: pointer;"
                     title="Click to buy now">
                <div class="product-actions-overlay">
                    <button class="product-action-btn" title="Add to Wishlist" onclick="event.preventDefault(); addToWishlist(${product.id})">
                        <ion-icon name="heart-outline"></ion-icon>
                    </button>
                    <button class="product-action-btn" title="Quick View" onclick="event.preventDefault();">
                        <ion-icon name="eye-outline"></ion-icon>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price} <span>/ unit</span></div>
                <div class="product-supplier">
                    <span>${supplier.name}</span>
                </div>
                <div class="product-rating">
                    <div class="rating-stars">
                        ${renderStars(rating)}
                    </div>
                    <span class="rating-count">(${reviewCount})</span>
                </div>
                <div class="product-moq">
                    <strong>MOQ:</strong> ${product.moq}
                </div>
                <button class="product-card-btn" onclick="event.preventDefault(); window.location.href='messages.html?supplier=${supplier.id}'">
                    Contact Supplier
                </button>
            </div>
        </a>
    `;
}

// Handle product image click - navigate to delivery form on product page
function handleProductClick(productId) {
    // Navigate to product page with delivery form
    window.location.href = 'product.html?id=' + productId;
}

// Handle add to cart from product page - check auth
function handleAddToCart(productId) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, add to cart
            addToCart(productId);
            alert('Product added to cart!');
            updateCartBadge();
        } else {
            // User is not logged in, redirect to login
            alert('Please sign in or create an account to add items to cart.');
            window.location.href = 'login.html?redirect=product.html?id=' + productId + '&productId=' + productId;
        }
    });
}

// Helper function to render star rating
function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<ion-icon name="star"></ion-icon>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<ion-icon name="star-half"></ion-icon>';
        } else {
            stars += '<ion-icon name="star-outline"></ion-icon>';
        }
    }
    return stars;
}

// Modern render function for homepage
function renderProductsModern(filterCategory = null, keywordFilter = null, targetGridId = 'productGrid', limit = null) {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;

    grid.innerHTML = '';
    let filtered = catalog;

    if (filterCategory) {
        filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (keywordFilter) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keywordFilter.toLowerCase()));
    }

    const isHomePage = (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/'));
    const defaultLimit = isHomePage ? 16 : filtered.length;
    const finalLimit = limit || defaultLimit;

    filtered.slice(0, finalLimit).forEach(product => {
        grid.innerHTML += renderProductCard(product);
    });
}

// Render suppliers grid
function renderSuppliers(targetGridId = 'suppliersGrid', limit = null) {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;

    grid.innerHTML = '';
    const finalLimit = limit || suppliers.length;

    suppliers.slice(0, finalLimit).forEach(supplier => {
        grid.innerHTML += renderSupplierCard(supplier);
    });
}

const categoryData = {
    apparel: {
        name: "Apparel & Accessories",
        keywords: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Dress", "Skirt", "Shorts", "Sweater", "Graduation Cap", "Cheongsam", "Sequins", "Trimmings", "Ice Hockey", "Rhinestones", "Men's Sets", "Muslim Skirt", "Pirate Hat", "Dance Pants", "Tactical Clothes", "Fabric Belts", "Pilot Shirt"],
        moqSuffix: "Pieces"
    },
    shoes: {
        name: "Shoes & Accessories",
        keywords: ["Sneakers", "Running Shoes", "Leather Boots", "Sandals", "Loafers", "Heels", "Home Slippers", "Fur Slippers", "Moccasin Slippers", "Moccasins", "Flats", "Slides Slippers", "Clogs Shoes", "Summer Sandals", "Beach Slippers", "Indoor Slippers", "Women Slides", "Formal Shoes", "Canvas Shoes", "Boots", "Winter Boots", "Work Boots", "Dress Shoes", "Casual Shoes", "Oxford Shoes", "Derby Shoes", "Ballet Flats", "Espadrilles", "Mule Shoes", "Platform Shoes", "Wedge Sandals", "Flip Flops", "Water Shoes", "Dance Shoes", "Basketball Shoes", "Volleyball Shoes", "Tennis Shoes", "Golf Shoes", "Hiking Boots", "Climbing Shoes", "Running Sneakers", "Walking Shoes", "Training Shoes"],
        moqSuffix: "Pairs"
    },
    electronics: {
        name: "Consumer Electronics",
        keywords: ["Smartphone", "Laptop", "Smart Watch", "Bluetooth Earbuds", "Drone", "VR Headset", "Gaming Console", "Speaker Driver", "Keyboard switches", "Tf Card", "Camera Accessories", "Smart Products", "Computer Accessories", "Software", "Ethernet Adapter", "Satellite Multiswitch", "Hd Camcorder", "Uv Filter", "Camera Filters", "Soldering Mat"],
        moqSuffix: "Units"
    },
    bags: {
        name: "Luggage, Bags & Cases",
        keywords: ["Leather Backpack", "Luxury Handbag", "Travel Suitcase", "Tote Bag", "Messenger Bag", "Beauty Case", "College Bag", "Cosmetic Case", "Bag Accessories", "Wine Bag", "Shoulder Bag", "Backpack", "Bag Chain", "Shoulder Strap", "Lipstick Bags", "Luggage Scooter", "Lipstick Case", "Bag Handle", "Wallet", "Clutch Bag", "Evening Bag", "Crossbody Bag", "Satchel", "Hobo Bag", "Bucket Bag", "Doctor Bag", "Baguette Bag", "Bow Bag", "Quilted Bag"],
        moqSuffix: "Pieces"
    },
    beauty: {
        name: "Beauty & Personal Care",
        keywords: ["Perfume Gift Sets", "Perfume Set", "Body Mist", "Women's Perfume", "Deodorant Spray", "Deodorant", "Men's Perfume", "Cosmetic", "Nail Equipments", "Hair Removal Machine", "Makeup Sets", "Antiperspirant", "Nail Supplies", "Feminine Hygiene Products", "Laundry Soap", "After Shave Cologne", "Hair Extension Tools", "Washing Powder", "Aftershave", "Perfume Oil", "Sea Salt", "Hair Relaxers", "Breath Fresheners", "Detergent Sheets", "Detangling Brush", "Hair Mousse"],
        moqSuffix: "Units"
    },
    home: {
        name: "Home & Garden",
        keywords: ["Home Decor", "Wall Art", "Photo Frame", "Vase", "Candle Holder", "Mirror", "Clock", "Throw Pillow", "Blanket", "Curtain", "Rug", "Lamp", "Table Lamp", "Floor Lamp", "Bed Sheets", "Pillowcase", "Comforter", "Mattress", "Pillow", "Cushion", "Table Runner", "Placemat", "Coaster", "Tray", "Basket", "Storage Box", "Organizer", "Drawer", "Cabinet", "Shelf", "Bookshelf", "TV Stand", "Coffee Table"],
        moqSuffix: "Pieces"
    },
    sports: {
        name: "Sports & Entertainment",
        keywords: ["Camping Gear", "Fishing Accessories", "Novelties", "Step Platforms", "Bows", "Diving Reel", "Shot Put", "Tennis Net", "Flying Car", "Suspension Trainers", "Amusement Park Products", "Volleyball Shoes", "Football Boots", "Hockey Skate", "Mtb Shoes", "Sports Gloves", "Sweatband", "Keeper Gloves"],
        moqSuffix: "Units"
    },
    industrial: {
        name: "Industrial & Commercial Machinery",
        keywords: ["Welding Machine", "Laser Welders", "Air Dryer", "Farm Trailers", "Agriculture Products", "Grinder Machine", "Gasoline Engine", "Crystallizers", "Air Curtain", "Plastic Welders", "TIG Welders", "Arc Welders", "Welding Robot", "Spot Welders", "Juice Dispenser", "Food Cart", "Food Trailer"],
        moqSuffix: "Units"
    },
    health: {
        name: "Health & Medical",
        keywords: ["Ecg Machine", "Insulin Syringe", "Medical Consumables", "Rehabilitation Equipment", "Veterinary Medicine", "Massage Products", "Stretcher", "Acupuncture Machine", "Scalpel Blade", "Sleeping Aid", "Pathological Analysis Equipments"],
        moqSuffix: "Units"
    },
    gifts: {
        name: "Gifts & Crafts",
        keywords: ["Gift Box", "Gift Bag", "Gift Wrap", "Greeting Card", "Key Chain", "Keychain", "Mouse Pad", "USB Drive", "Power Bank", "Phone Case", "Watch", "Sunglasses", "Jewelry Box", "Photo Album", "Crystal Trophy", "Award Plaque", "Medal", "Souvenir", "Promotional Item", "Party Favor"],
        moqSuffix: "Pieces"
    },
    pet: {
        name: "Pet Supplies",
        keywords: ["Dog Food", "Hamster Cage", "Dog Kennel", "Aquarium Filter", "Cat Tree", "Pet Accessories", "Aquariums", "Saltwater Aquarium", "Dog Ramp", "Sponge Filter", "Cat Toy", "Dog Car Seat", "Dog Crate"],
        moqSuffix: "Units"
    },
    school: {
        name: "School & Office Supplies",
        keywords: ["Water Color", "Paper Punch", "Bible Cover", "Cutting Plotter", "Art Supplies", "Erasers", "Medical Science", "World Globe", "Sketch Pad", "Watercolor Paper", "Id Badge Holder", "Binder Clips", "Cork Board"],
        moqSuffix: "Units"
    },
    energy: {
        name: "Renewable Energy",
        keywords: ["Water Turbine", "Rechargeable Batteries", "Hydro Generator", "Wind Turbine", "Battery", "Solar Panels", "Solar Energy System", "Magnet Generator", "Solar Cells", "Solar Charger", "Solar Tracker", "Turbine Generator", "Solar Kits"],
        moqSuffix: "Units"
    },
    electrical: {
        name: "Electrical Equipment & Supplies",
        keywords: ["Winding Wire", "Wall Socket", "Electrical Switch", "Transformers", "Cable Connector", "Welding Cable", "Gasoline Generators", "Bnc Connector", "Generator Parts", "Aluminum Box", "Fuse Box"],
        moqSuffix: "Units"
    },
    safety: {
        name: "Safety & Security",
        keywords: ["Work Clothing", "Parking Barrier", "Locksmith Tools", "Keys", "Locksmith Supplies", "Nvr", "Spy Camera", "Latch", "Smart Card Reader", "Rim Lock", "Military Supplies", "Reflective Fabric", "Lightning Rods"],
        moqSuffix: "Units"
    },
    vehicles: {
        name: "Vehicles & Transportation",
        keywords: ["Sport Car", "Pit Bike", "Used Motorcycles", "Motorcycle", "Trailers", "Electric Truck", "ATVs", "Suv Car", "Pick Up Truck", "Utility Trailer", "Dump Trailer", "Tow Truck", "Hybrid Car"],
        moqSuffix: "Units"
    },
    agriculture: {
        name: "Agriculture & Food",
        keywords: ["Absinthe", "Dory", "Coconut Water", "Vanilla Beans", "Cardamom", "Cloves", "Saffron", "Mooncakes", "Mussel", "Ramune", "Condensed Milk", "Logs", "Betel Nuts"],
        moqSuffix: "kg"
    },
    service: {
        name: "Service & Business",
        keywords: ["Fashion Design", "PC Games", "Quality Control", "Wix", "AI Chatbot", "Taobao Agent", "1688 Agent"],
        moqSuffix: "Service"
    }
};

// --- CATALOG MANAGEMENT ---
// To update a specific product, find its ID below and change the values.
// 1. To change an image: Replace the URL or use a local path like 'images/my-photo.jpg'
// 2. To change price: Update the GHS string
// 3. To change title: Edit the title text

const manualCatalog = [
    // --- APPAREL ---
    { id: 1, category: "apparel", title: "Premium Men's Cotton Suit", price: "GHS 1,200.00", moq: "1 Set", image: "images/products/apparel/cotton_suit.jpg" },
    { id: 2, category: "apparel", title: "Designer Summer Silk Dress", price: "GHS 450.00", moq: "5 Pieces", image: "images/products/apparel/silk_dress.jpg" },

    // --- SHOES ---
    { id: 3, category: "shoes", title: "Nike Air Jordan 1 Retro", price: "GHS 950.00", moq: "10 Pairs", image: "images/products/shoes/jordan_1.jpg" },
    { id: 4, category: "shoes", title: "Luxury Leather Office Loafers", price: "GHS 600.00", moq: "5 Pairs", image: "images/products/shoes/loafers.jpg" },

    // --- ELECTRONICS ---
    { id: 5, category: "electronics", title: "Apple iPhone 15 Pro Max", price: "GHS 14.00", moq: "1 Unit", image: "images/products/electronics/iphone15.jpg" },
    { id: 6, category: "electronics", title: "Samsung 65' 4K UHD Smart TV", price: "GHS 8.00", moq: "1 Unit", image: "images/products/electronics/samsung_tv.jpg" },

    // --- BAGS ---
    { id: 7, category: "bags", title: "Louis Vuitton Travel Suitcase", price: "GHS 5,400.00", moq: "2 Pieces", image: "images/products/bags/suitcase.jpg" },
    { id: 8, category: "bags", title: "Waterproof Hiking Backpack", price: "GHS 350.00", moq: "20 Pieces", image: "images/products/bags/backpack.jpg" },

    // --- BEAUTY ---
    { id: 9, category: "beauty", title: "Chanel No.5 Luxury Perfume", price: "GHS 1,800.00", moq: "1 Unit", image: "images/products/beauty/chanel_no5.jpg" },
    { id: 10, category: "beauty", title: "Organic Gold Skin Care Set", price: "GHS 550.00", moq: "10 Sets", image: "images/products/beauty/skin_care.jpg" }
];

// --- IMAGE MAPPING FOR CATEGORIES ---
// Map each category to its available images in the images/ folder
// ALL available local images are allocated here - no blanks!
const categoryImages = {
    bags: [
        'images/BAG1.jpg', 'images/BAG2.jpg', 'images/BAG3.jpg', 'images/BAG4.jpg',
        'images/BAG5.jpg', 'images/BAG6.jpg', 'images/BAG7.jpg', 'images/BAG8.jpg',
        'images/BAG9.jpg', 'images/BAG10.jpg', 'images/BAG11.jpg', 'images/BAG12.jpg',
        'images/BAG14.jpg', 'images/BAG15.jpg', 'images/BAG16.jpg', 'images/BAG17.jpg',
        'images/BAG18.jpg', 'images/BAG19.jpg', 'images/BAG20.jpg', 'images/BAG21.jpg',
        'images/BAG22.jpg', 'images/BAG23.jpg', 'images/BAG24.jpg', 'images/BAG25.jpg',
        'images/BAG26.jpg', 'images/BAG29.jpg', 'images/BAG30.jpg',
        'images/BAGS26.jpg', 'images/BAGS27.jpg', 'images/BAGS28.jpg'
    ],
    shoes: [
        'images/SHOE1.jpg', 'images/SHOE2.jpg', 'images/SHOE3.jpg', 'images/SHOE 4.jpg',
        'images/SHOE5.jpg', 'images/SHOE6.jpg', 'images/SHOE7.jpg', 'images/SHOE8.jpg',
        'images/SHOE9.jpg', 'images/SHOE10.jpg', 'images/SHOE11.jpg', 'images/SHOE12.jpg',
        'images/SHOE13.jpg', 'images/SHOE14.jpg', 'images/SHOE15.jpg', 'images/SHOE16.jpg',
        'images/SHOE17.jpg', 'images/SHOE18.jpg', 'images/SHOE19.jpg', 'images/SHOE20.jpg',
        'images/SHOE21.jpg', 'images/SHOE22.jpg', 'images/SHOE23.jpg', 'images/SHOE24.jpg',
        'images/SHOE25.jpg', 'images/SHOE26.jpg', 'images/SHOE27.jpg', 'images/SHOE28.jpg',
        'images/SHOE29.jpg', 'images/SHOE30.jpg', 'images/SHOE31.jpg', 'images/SHOE32.jpg',
        'images/SHOE33.jpg', 'images/SHOE34.jpg', 'images/SHOE35.jpg', 'images/SHOE36.jpg',
        'images/SHOE37.jpg', 'images/SHOE38.jpg', 'images/SHOE39.jpg', 'images/SHOE40.jpg',
        'images/SHOE340#.jpg'
    ],
    electronics: [
        'images/SMART1.jpg', 'images/SMART2.jpg', 'images/SMART3.jpg', 'images/SMAR4.jpg',
        'images/SMART5.jpg', 'images/SMART6.jpg', 'images/SMART7.jpg', 'images/SMART8.jpg',
        'images/SMART9.jpg'
    ],
    beauty: [
        'images/SPRAY1.jpg', 'images/SPRAY2.jpg', 'images/SPRAY3.jpg'
    ],
    home: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ],
    // Additional category for variety
    gifts: [
        'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
        'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
        'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
        'images/image13.jpg', 'images/test.jpg'
    ]
};

// This loop handles the remaining products automatically (Start from id 16)
const generatedCatalog = [];
const catKeysAvailable = Object.keys(categoryData);

// Create a hash from string function for consistent unique image selection
function stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

for (let i = 16; i <= 5000; i++) {
    const key = catKeysAvailable[i % catKeysAvailable.length];
    const cat = categoryData[key];
    const itemKeyword = cat.keywords[i % cat.keywords.length];
    const fileName = itemKeyword.replace(/\s+/g, '_').toLowerCase();

    // Get image from category mapping - use hash to get unique image per keyword
    const catImages = categoryImages[key] || [];

    // Use hash of keyword to select image - ensures same keyword gets same image, different keywords get different images
    const keywordHash = stringToHash(itemKeyword);
    const localImageIndex = catImages.length > 0 ? keywordHash % catImages.length : -1;
    const mappedImage = catImages.length > 0 ? catImages[localImageIndex] : '';

    // Use Unsplash with unique sig based on keyword hash for unique images per product
    // This ensures NO repetition - each product gets a unique image URL
    const uniqueSig = keywordHash + (i * 1000);
    const unsplashUrl = `https://images.unsplash.com/featured/400x400?${encodeURIComponent(itemKeyword)}&sig=${uniqueSig}`;

    generatedCatalog.push({
        id: i,
        category: key,
        title: `Wholesale ${itemKeyword} (Order #${i})`,
        price: `GHS ${(Math.random() * 500 + 50).toFixed(2)}`,
        moq: `${Math.floor(Math.random() * 200 + 10)} ${cat.moqSuffix || 'Units'}`,
        // Use local image if available, otherwise use unique Unsplash URL
        image: mappedImage || unsplashUrl,
        stockImage: unsplashUrl
    });
}

const catalog = [...manualCatalog, ...generatedCatalog];

// Render Engine
function renderProducts(filterCategory = null, keywordFilter = null, targetGridId = 'productGrid', limit = null) {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;

    grid.innerHTML = '';
    let filtered = catalog;

    if (filterCategory) {
        filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (keywordFilter) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keywordFilter.toLowerCase()));
    }

    // Limit display for performance while still being a lot
    const isHomePage = (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/'));
    const defaultLimit = isHomePage ? 48 : filtered.length;
    const finalLimit = limit || defaultLimit;

    filtered.slice(0, finalLimit).forEach(product => {
        const card = document.createElement('a');
        card.href = `product.html?id=${product.id}`;
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" loading="lazy" alt="${product.title}" 
                     onerror="this.src='${PLACEHOLDER_IMAGE}'; this.onerror=null;"
                     onclick="event.preventDefault(); event.stopPropagation(); handleProductClick(${product.id})"
                     style="cursor: pointer;"
                     title="Click to buy now">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-price">${product.price}</span>
                <span class="product-moq">${product.moq}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    let activeCat = params.get('cat');
    let keywordSubFilter = params.get('search');

    if (!activeCat) {
        if (path.includes('apparel')) activeCat = 'apparel';
        else if (path.includes('shoes')) activeCat = 'shoes';
        else if (path.includes('electronics')) activeCat = 'electronics';
        else if (path.includes('bags')) activeCat = 'bags';
        else if (path.includes('beauty')) activeCat = 'beauty';
        else if (path.includes('home')) activeCat = 'home';
        else if (path.includes('industrial')) activeCat = 'industrial';
        else if (path.includes('medical')) activeCat = 'health';
        else if (path.includes('sports')) activeCat = 'sports';
        else if (path.includes('mobile')) {
            activeCat = 'electronics';
            keywordSubFilter = 'Smartphone';
        }
    }

    renderProducts(activeCat, keywordSubFilter);

    // Populate Deals if on Index
    if (document.getElementById('dealsGrid')) {
        renderProducts('electronics', null, 'dealsGrid', 6); // Show top 6 electronics
    }

    // Detail Page Logic
    if (path.includes('product.html')) {
        const params = new URLSearchParams(window.location.search);
        const prodId = parseInt(params.get('id'));
        const product = catalog.find(p => p.id === prodId) || catalog[0];

        const t = document.getElementById('productTitle');
        const p = document.getElementById('productPrice');
        const im = document.querySelector('.main-image');
        const m = document.querySelector('.product-moq');

        if (t) t.innerText = product.title;
        if (p) p.innerText = product.price;
        if (m) m.innerText = product.moq;
        if (im) im.innerHTML = `<img id="mainImg" src="${product.image}" onerror="this.src='${product.stockImage || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'}'; this.onerror=null;">`;
    }

    updateCartBadge();

    // Search Bar Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                renderProducts(null, query);
                // Scroll to products
                const grid = document.getElementById('productGrid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }
        };
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
});

// Cart Logic
function addToCart(productId) {
    const product = catalog.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    const item = cart.find(i => i.id === productId);
    if (item) item.quantity++;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem('alfredCart', JSON.stringify(cart));
    updateCartBadge();

    // Feedback notification
    const btn = document.querySelector('#addCartBtn');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Added to Cart!';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
        }, 2000);
    }
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('alfredCart')) || [];
    const count = cart.reduce((a, b) => a + b.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = count;
}

// Payment & Delivery Form Logic
function validateAndPay() {
    const form = document.getElementById('deliveryForm');
    if (!form || !form.checkValidity()) {
        form ? form.reportValidity() : alert('Please fill in all delivery details.');
        return;
    }

    const deliveryInfo = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        whatsappNumber: document.getElementById('whatsappNumber').value || 'N/A',
        region: document.getElementById('region').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value
    };

    localStorage.setItem('tempDeliveryInfo', JSON.stringify(deliveryInfo));
    payWithPaystack();
}

function payWithPaystack() {
    const params = new URLSearchParams(window.location.search);
    const prodId = parseInt(params.get('id'));
    const product = catalog.find(p => p.id === prodId) || catalog[0];

    const deliveryInfo = JSON.parse(localStorage.getItem('tempDeliveryInfo'));
    if (!deliveryInfo) {
        alert('Missing delivery information.');
        return;
    }

    const priceNum = parseFloat(product.price.replace('GHS', '').trim());
    const amount = priceNum * 100;

    let handler = PaystackPop.setup({
        key: 'pk_live_6b9968065dc0bd4842c97ffa138e49127c862888',
        email: (auth.currentUser ? auth.currentUser.email : 'customer@alfredproducts.com'),
        amount: amount,
        currency: "GHS",
        ref: 'ALF_' + Math.floor((Math.random() * 1e9) + 1),
        metadata: {
            custom_fields: [
                { display_name: "Customer", value: deliveryInfo.fullName },
                { display_name: "Phone", value: deliveryInfo.phoneNumber },
                { display_name: "Address", value: `${deliveryInfo.address}, ${deliveryInfo.city}` }
            ]
        },
        callback: function (response) {
            alert('Order Placed Successfully!');
            saveOrderToFirestore({
                items: [{ ...product, quantity: 1 }],
                total: priceNum.toFixed(2),
                reference: response.reference,
                delivery: deliveryInfo,
                status: 'pending'
            });
            localStorage.removeItem('tempDeliveryInfo');
            window.location.href = 'orders.html';
        }
    });
    handler.openIframe();
}

// Tab and Gallery Logic
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) tabcontent[i].classList.remove("active");
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function changeImage(type) {
    const mainImg = document.getElementById('mainImg');
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    if (type === 'hero') thumbs[0].classList.add('active');
    else if (type === 'thumb1') {
        mainImg.src = 'thumb1.png';
        thumbs[1].classList.add('active');
    }
}

// Auth Header Sync
if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        if (user) {
            headerActions.innerHTML = `
                <a href="orders.html" class="action-item">
                    <img src="${user.photoURL || 'https://via.placeholder.com/30'}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ddd;">
                    <span>${user.displayName.split(' ')[0]}</span>
                </a>
                <a href="messages.html" class="action-item"><ion-icon name="mail-outline"></ion-icon><span>Messages</span></a>
                <a href="cart.html" class="action-item"><ion-icon name="cart-outline"></ion-icon><span id="cartCount">0</span></a>
            `;
            updateCartBadge();
        }
    });
}
