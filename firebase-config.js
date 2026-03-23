// Firebase Configuration - LIVE API KEYS
const firebaseConfig = {
    apiKey: "AIzaSyBMhNFK9ueVA6-1i22Z_NbGV_50Uy0xXjQ",
    authDomain: "project-4da600f0-7b2b-45f4-808.firebaseapp.com",
    projectId: "project-4da600f0-7b2b-45f4-808",
    storageBucket: "project-4da600f0-7b2b-45f4-808.firebasestorage.app",
    messagingSenderId: "531999731190",
    appId: "1:531999731190:web:098953626b761eafb62bd7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Google Sign-In Logic
function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // Save user to Firestore
            saveUserToFirestore(user);
        }).catch((error) => {
            console.error("Auth Error:", error);
            alert("Sign-in failed: " + error.message);
        });
}

function saveUserToFirestore(user) {
    // Check if user is admin (case-insensitive)
    const userEmail = user.email ? user.email.toLowerCase() : '';
    const isAdmin = (userEmail === 'narhsnazzisco@gmail.com');
    
    console.log('User email:', user.email);
    console.log('Is admin:', isAdmin);
    
    db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        isAdmin: isAdmin,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => {
        // Redirect admin to admin dashboard, regular users to index
        if (isAdmin) {
            alert('Admin login successful! Redirecting to dashboard...');
            window.location.href = 'admin-dashboard/admin-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    })
    .catch((error) => {
        console.error('Error saving user:', error);
        // Still redirect even if Firestore fails
        if (isAdmin) {
            window.location.href = 'admin-dashboard/admin-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    });
}

// Function to save order to Firestore
function saveOrderToFirestore(orderDetails) {
    const user = auth.currentUser;
    const orderData = {
        userId: user ? user.uid : 'GUEST_' + Date.now(),
        userEmail: user ? user.email : (orderDetails.delivery ? orderDetails.delivery.email : 'guest@alfredproducts.com'),
        userName: user ? user.displayName : (orderDetails.delivery ? orderDetails.delivery.fullName : 'Guest Customer'),
        items: orderDetails.items,
        total: orderDetails.total,
        reference: orderDetails.reference,
        delivery: orderDetails.delivery || {},
        status: orderDetails.status || "Paid",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log("Saving order to Firestore:", orderData);

    return db.collection("orders").add(orderData)
    .then((docRef) => {
        console.log("Order saved successfully with ID: ", docRef.id);
        return docRef.id;
    })
    .catch((error) => {
        console.error("Error saving order to Firestore:", error);
        // Fallback: save to localStorage if Firestore fails
        const localOrders = JSON.parse(localStorage.getItem('alfredOrders') || '[]');
        localOrders.push({ ...orderData, id: 'local_' + Date.now(), sync: 'pending' });
        localStorage.setItem('alfredOrders', JSON.stringify(localOrders));
        throw error;
    });
}
