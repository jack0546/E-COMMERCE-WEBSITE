// Firebase Firestore Data Export Script
// This script exports data from Firestore to CSV format for Excel/Access

// Firebase Config - Replace with your project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Export function - saves as CSV file
async function exportCollectionToCSV(collectionName, filename) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];
  
  snapshot.forEach(doc => {
    const docData = doc.data();
    docData.id = doc.id; // Add document ID
    data.push(docData);
  });
  
  if (data.length === 0) {
    console.log(`No data found in ${collectionName}`);
    return;
  }
  
  // Get all unique keys from all documents
  const allKeys = new Set();
  data.forEach(doc => {
    Object.keys(doc).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  const csvContent = [
    headers.join(','),
    ...data.map(row => {
      return headers.map(header => {
        let cell = row[header];
        if (cell === undefined || cell === null) {
          cell = '';
        }
        // Handle nested objects and arrays
        if (typeof cell === 'object') {
          cell = JSON.stringify(cell).replace(/"/g, '""');
        }
        // Escape quotes and wrap in quotes if contains comma
        cell = String(cell);
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(',');
    })
  ].join('\n');
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename + '.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`Exported ${data.length} records from ${collectionName}`);
}

// Export all collections
async function exportAllData() {
  try {
    // Export Orders
    await exportCollectionToCSV('orders', 'orders_export');
    
    // Export Products  
    await exportCollectionToCSV('products', 'products_export');
    
    // Export Users
    await exportCollectionToCSV('users', 'users_export');
    
    console.log('All data exported successfully!');
    alert('Data exported to CSV files. Check your downloads folder.');
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting data: ' + error.message);
  }
}

// Auto-run export when page loads (for admin use)
window.addEventListener('DOMContentLoaded', () => {
  // Uncomment the line below to auto-export on page load
  // exportAllData();
});

// Export to Excel format (XLS)
async function exportToExcel(collectionName, filename) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];
  
  snapshot.forEach(doc => {
    const docData = doc.data();
    docData.id = doc.id;
    data.push(docData);
  });
  
  if (data.length === 0) {
    console.log(`No data found in ${collectionName}`);
    return;
  }
  
  // Get all unique keys
  const allKeys = new Set();
  data.forEach(doc => {
    Object.keys(doc).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  
  // Create Excel XML format
  let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
  xml += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
  xml += '<Worksheet ss:Name="' + collectionName + '"><Table>';
  
  // Header row
  xml += '<Row>';
  headers.forEach(header => {
    xml += '<Cell><Data ss:Type="String">' + header + '</Data></Cell>';
  });
  xml += '</Row>';
  
  // Data rows
  data.forEach(row => {
    xml += '<Row>';
    headers.forEach(header => {
      let cell = row[header];
      if (cell === undefined || cell === null) {
        cell = '';
      }
      if (typeof cell === 'object') {
        cell = JSON.stringify(cell);
      }
      xml += '<Cell><Data ss:Type="String">' + String(cell) + '</Data></Cell>';
    });
    xml += '</Row>';
  });
  
  xml += '</Table></Worksheet></Workbook>';
  
  // Download
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename + '.xls');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`Exported ${data.length} records to Excel`);
}
