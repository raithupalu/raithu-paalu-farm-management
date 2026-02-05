/**
 * Realistic Dummy Data for Raithu Paalu Farm Management
 * Based on Indian rural farming context with Telugu names and realistic values
 */

// Milk rate per liter (varies by fat content)
export const MILK_RATE_PER_LITER = 75; // ₹75 per liter (standard rate)
export const FAT_RATE_PER_PERCENT = 2; // ₹2 extra per 1% fat

// Farmer Data (Milk Suppliers - from villages around Telangana/Andhra)
export const farmersData = [
  {
    _id: 'farmer_001',
    name: 'Ramesh Babu',
    phone: '+91 98765 43210',
    village: 'Kukatpally',
    taluka: 'Medchal',
    district: 'Medchal-Malkajgiri',
    totalBuffaloes: 4,
    createdAt: '2024-01-15T06:00:00Z'
  },
  {
    _id: 'farmer_002',
    name: 'Lakshman Rao',
    phone: '+91 98765 43211',
    village: 'Shamshabad',
    taluka: 'Ranga Reddy',
    district: 'Ranga Reddy',
    totalBuffaloes: 3,
    createdAt: '2024-01-18T06:30:00Z'
  },
  {
    _id: 'farmer_003',
    name: 'Venkateshwarlu',
    phone: '+91 98765 43212',
    village: 'Shankarapalli',
    taluka: 'Sangareddy',
    district: 'Medak',
    totalBuffaloes: 6,
    createdAt: '2024-01-20T05:45:00Z'
  },
  {
    _id: 'farmer_004',
    name: 'Srinivas Reddy',
    phone: '+91 98765 43213',
    village: 'Dundigal',
    taluka: 'Medchal',
    district: 'Medchal-Malkajgiri',
    totalBuffaloes: 5,
    createdAt: '2024-01-22T06:15:00Z'
  },
  {
    _id: 'farmer_005',
    name: 'Anjaneyulu',
    phone: '+91 98765 43214',
    village: 'Bollarum',
    taluka: 'Medchal',
    district: 'Medchal-Malkajgiri',
    totalBuffaloes: 2,
    createdAt: '2024-01-25T07:00:00Z'
  },
  {
    _id: 'farmer_006',
    name: 'Rama Krishna',
    phone: '+91 98765 43215',
    village: 'Miyapur',
    taluka: 'Ranga Reddy',
    district: 'Ranga Reddy',
    totalBuffaloes: 4,
    createdAt: '2024-01-28T06:20:00Z'
  },
  {
    _id: 'farmer_007',
    name: 'Surya Prakash',
    phone: '+91 98765 43216',
    village: 'Patancheru',
    taluka: 'Sangareddy',
    district: 'Medak',
    totalBuffaloes: 3,
    createdAt: '2024-02-01T05:50:00Z'
  },
  {
    _id: 'farmer_008',
    name: 'Narayana Murthy',
    phone: '+91 98765 43217',
    village: 'Ghatkesar',
    taluka: 'Medchal',
    district: 'Medchal-Malkajgiri',
    totalBuffaloes: 5,
    createdAt: '2024-02-05T06:10:00Z'
  }
];

// Buffalo Data (with Indian names and realistic production)
export const buffaloesData = [
  {
    _id: 'buf_001',
    name: 'Ganga',
    tagId: 'BUF/2024/001',
    breed: 'Murrah',
    age: 6,
    weight: 480,
    milkProduction: 14,
    fatContent: 8.5,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-01-15',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_001'
  },
  {
    _id: 'buf_002',
    name: 'Yamuna',
    tagId: 'BUF/2024/002',
    breed: 'Murrah',
    age: 5,
    weight: 450,
    milkProduction: 12,
    fatContent: 8.0,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-01-15',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_001'
  },
  {
    _id: 'buf_003',
    name: 'Saraswati',
    tagId: 'BUF/2024/003',
    breed: ' Jaffrabadi',
    age: 7,
    weight: 520,
    milkProduction: 10,
    fatContent: 9.0,
    healthStatus: 'pregnant',
    lastVaccinationDate: '2024-01-10',
    lastMilkDate: '2024-01-28',
    farmerId: 'farmer_002'
  },
  {
    _id: 'buf_004',
    name: 'Narmada',
    tagId: 'BUF/2024/004',
    breed: 'Murrah',
    age: 4,
    weight: 420,
    milkProduction: 8,
    fatContent: 7.5,
    healthStatus: 'sick',
    lastVaccinationDate: '2024-01-20',
    lastMilkDate: '2024-02-01',
    farmerId: 'farmer_002'
  },
  {
    _id: 'buf_005',
    name: 'Godavari',
    tagId: 'BUF/2024/005',
    breed: 'Murrah',
    age: 5,
    weight: 460,
    milkProduction: 13,
    fatContent: 8.2,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-01-18',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_003'
  },
  {
    _id: 'buf_006',
    name: 'Kaveri',
    tagId: 'BUF/2024/006',
    breed: ' Jaffrabadi',
    age: 6,
    weight: 500,
    milkProduction: 11,
    fatContent: 8.8,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-01-12',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_003'
  },
  {
    _id: 'buf_007',
    name: 'Brahmaputra',
    tagId: 'BUF/2024/007',
    breed: 'Murrah',
    age: 3,
    weight: 380,
    milkProduction: 6,
    fatContent: 7.0,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-02-01',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_004'
  },
  {
    _id: 'buf_008',
    name: 'Indus',
    tagId: 'BUF/2024/008',
    breed: 'Murrah',
    age: 4,
    weight: 430,
    milkProduction: 9,
    fatContent: 7.8,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-01-25',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_004'
  },
  {
    _id: 'buf_009',
    name: 'Tapti',
    tagId: 'BUF/2024/009',
    breed: 'Surti',
    age: 5,
    weight: 440,
    milkProduction: 10,
    fatContent: 8.5,
    healthStatus: 'healthy',
    lastVaccinationDate: '2024-01-22',
    lastMilkDate: '2024-02-02',
    farmerId: 'farmer_005'
  },
  {
    _id: 'buf_010',
    name: 'Mahanadi',
    tagId: 'BUF/2024/010',
    breed: 'Murrah',
    age: 7,
    weight: 510,
    milkProduction: 8,
    fatContent: 9.2,
    healthStatus: 'pregnant',
    lastVaccinationDate: '2024-01-08',
    lastMilkDate: '2024-01-25',
    farmerId: 'farmer_006'
  }
];

// Milk Entry Data (last 30 days)
export const milkEntriesData = generateMilkEntries();

function generateMilkEntries() {
  const entries = [];
  const today = new Date('2024-02-02');
  
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    
    // Each farmer contributes milk every day
    farmersData.forEach((farmer, farmerIndex) => {
      // Random number of buffaloes milked (60-100% of total)
      const buffaloesMilked = Math.floor(farmer.totalBuffaloes * (0.6 + Math.random() * 0.4));
      
      for (let b = 0; b < buffaloesMilked; b++) {
        const baseQuantity = 8 + Math.random() * 6; // 8-14 liters per buffalo
        const fatContent = 7 + Math.random() * 2.5; // 7-9.5% fat
        const rate = MILK_RATE_PER_LITER + (fatContent - 6) * FAT_RATE_PER_PERCENT;
        
        entries.push({
          _id: `milk_${day}_${farmerIndex}_${b}`,
          farmerId: farmer._id,
          farmerName: farmer.name,
          buffaloName: buffaloesData[b % farmer.totalBuffaloes]?.name || 'Unknown',
          date: date.toISOString().split('T')[0],
          time: day === 0 ? `${5 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM` : null,
          quantity: Math.round(baseQuantity * 10) / 10,
          fat: Math.round(fatContent * 10) / 10,
          rate: Math.round(rate * 10) / 10,
          totalAmount: Math.round(baseQuantity * rate * 10) / 10,
          quality: fatContent >= 8 ? 'A Grade' : fatContent >= 7 ? 'B Grade' : 'C Grade'
        });
      }
    });
  }
  
  return entries;
}

// Customer Data (Milk Subscribers)
export const customersData = [
  {
    _id: 'cust_001',
    name: 'Ramesh Kumar',
    phone: '+91 99887 76655',
    email: 'ramesh.kumar@email.com',
    address: 'H.No 12-5-88, Sri Nagar Colony, Kukatpally, Hyderabad',
    subscription: 'Daily',
    quantity: 2,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 4800,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2024-01-15',
    totalOrders: 48
  },
  {
    _id: 'cust_002',
    name: 'Lakshmi Devi',
    phone: '+91 99887 76656',
    email: 'lakshmi.devi@email.com',
    address: 'H.No 25-3-45, Vivekananda Nagar, Shamshabad, Hyderabad',
    subscription: 'Daily',
    quantity: 1.5,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 3600,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2024-01-18',
    totalOrders: 45
  },
  {
    _id: 'cust_003',
    name: 'Suresh Reddy',
    phone: '+91 99887 76657',
    email: 'suresh.reddy@email.com',
    address: 'H.No 8-2-120/45, Banjara Hills, Hyderabad',
    subscription: 'Daily',
    quantity: 3,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 7200,
    status: 'active',
    paymentStatus: 'pending',
    startDate: '2024-01-20',
    totalOrders: 43
  },
  {
    _id: 'cust_004',
    name: 'Priya Sharma',
    phone: '+91 99887 76658',
    email: 'priya.sharma@email.com',
    address: 'H.No 102, MIG Phase 1, KPHB Colony, Kukatpally',
    subscription: 'Daily',
    quantity: 1,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 2400,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2024-01-22',
    totalOrders: 41
  },
  {
    _id: 'cust_005',
    name: 'Venkat Rao',
    phone: '+91 99887 76659',
    email: 'venkat.rao@email.com',
    address: 'H.No 56-89, Gandhi Nagar, Medchal',
    subscription: 'Daily',
    quantity: 2.5,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 6000,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2024-01-25',
    totalOrders: 38
  },
  {
    _id: 'cust_006',
    name: 'Anita Kumari',
    phone: '+91 99887 76660',
    email: 'anita.kumari@email.com',
    address: 'H.No 33-12, JNTU Road, Kukatpally, Hyderabad',
    subscription: 'Weekly',
    quantity: 14,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 4480,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2024-01-28',
    totalOrders: 35
  },
  {
    _id: 'cust_007',
    name: 'Krishna Murthy',
    phone: '+91 99887 76661',
    email: 'krishna.murthy@email.com',
    address: 'H.No 78-45, Road No 5, Miyapur, Hyderabad',
    subscription: 'Daily',
    quantity: 2,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 4800,
    status: 'pending',
    paymentStatus: 'pending',
    startDate: '2024-02-01',
    totalOrders: 2
  },
  {
    _id: 'cust_008',
    name: 'Radha Devi',
    phone: '+91 99887 76662',
    email: 'radha.devi@email.com',
    address: 'H.No 19-6-90, LIG Colony, Shamshabad',
    subscription: 'Daily',
    quantity: 1,
    unit: 'L',
    pricePerLiter: 80,
    totalMonthly: 2400,
    status: 'inactive',
    paymentStatus: 'paid',
    startDate: '2024-01-10',
    totalOrders: 23
  }
];

// Expense Data (Farm Expenses)
export const expensesData = [
  {
    _id: 'exp_001',
    category: 'Feed',
    subCategory: 'Cattle Feed',
    description: 'Gold Cow Feed - 50kg bags (10 bags)',
    amount: 8500,
    quantity: 10,
    unit: 'bags',
    vendor: 'Vijaya Feeds Ltd',
    date: '2024-02-02',
    status: 'paid',
    paymentMode: 'UPI'
  },
  {
    _id: 'exp_002',
    category: 'Feed',
    subCategory: 'Green Fodder',
    description: 'Fresh Napier Grass - 200kg',
    amount: 2000,
    quantity: 200,
    unit: 'kg',
    vendor: 'Local Fodder Supplier',
    date: '2024-02-02',
    status: 'paid',
    paymentMode: 'Cash'
  },
  {
    _id: 'exp_003',
    category: 'Medicine',
    subCategory: 'Vaccination',
    description: 'Foot and Mouth Disease Vaccine (20 doses)',
    amount: 1200,
    quantity: 20,
    unit: 'doses',
    vendor: 'Telangana Veterinary',
    date: '2024-02-01',
    status: 'approved',
    paymentMode: 'Pending'
  },
  {
    _id: 'exp_004',
    category: 'Labor',
    subCategory: 'Wages',
    description: 'Farm worker salary - February 2024',
    amount: 9000,
    quantity: 1,
    unit: 'month',
    vendor: '2 Workers',
    date: '2024-02-01',
    status: 'pending',
    paymentMode: 'Pending'
  },
  {
    _id: 'exp_005',
    category: 'Equipment',
    subCategory: 'Milking Machine',
    description: 'Milking machine spare parts - teat cups',
    amount: 3500,
    quantity: 4,
    unit: 'pieces',
    vendor: 'Agro Equipments',
    date: '2024-01-30',
    status: 'paid',
    paymentMode: 'Bank Transfer'
  },
  {
    _id: 'exp_006',
    category: 'Utilities',
    subCategory: 'Electricity',
    description: 'Farm electricity bill - January 2024',
    amount: 4500,
    quantity: 1,
    unit: 'month',
    vendor: 'TS Southern Power',
    date: '2024-01-28',
    status: 'paid',
    paymentMode: 'Auto Pay'
  },
  {
    _id: 'exp_007',
    category: 'Medicine',
    subCategory: 'Deworming',
    description: 'Deworming tablets - 50 tablets',
    amount: 800,
    quantity: 50,
    unit: 'tablets',
    vendor: 'Pharma Vet',
    date: '2024-01-25',
    status: 'paid',
    paymentMode: 'Cash'
  },
  {
    _id: 'exp_008',
    category: 'Feed',
    subCategory: 'Mineral Mixture',
    description: 'Vet-mineral supplement - 25kg',
    amount: 2200,
    quantity: 25,
    unit: 'kg',
    vendor: 'NDDB Products',
    date: '2024-01-22',
    status: 'paid',
    paymentMode: 'UPI'
  },
  {
    _id: 'exp_009',
    category: 'Maintenance',
    subCategory: 'Shed Repair',
    description: 'Cow shed roof repair - damaged sheets replacement',
    amount: 6000,
    quantity: 1,
    unit: 'job',
    vendor: 'Sri Venkateshwara Constructions',
    date: '2024-01-20',
    status: 'approved',
    paymentMode: 'Pending'
  },
  {
    _id: 'exp_010',
    category: 'Transportation',
    subCategory: 'Milk Van',
    description: 'Milk collection van fuel - February first week',
    amount: 1500,
    quantity: 1,
    unit: 'week',
    vendor: 'HP Petrol Pump',
    date: '2024-02-02',
    status: 'paid',
    paymentMode: 'Fuel Card'
  }
];

// Payment Data (Farmer Payments)
export const paymentsData = [
  {
    _id: 'pay_001',
    farmerId: 'farmer_001',
    farmerName: 'Ramesh Babu',
    amount: 12500,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'Bank Transfer',
    reference: 'TXN/2024/0201/001',
    status: 'paid'
  },
  {
    _id: 'pay_002',
    farmerId: 'farmer_002',
    farmerName: 'Lakshman Rao',
    amount: 9800,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'UPI',
    reference: 'TXN/2024/0201/002',
    status: 'paid'
  },
  {
    _id: 'pay_003',
    farmerId: 'farmer_003',
    farmerName: 'Venkateshwarlu',
    amount: 15200,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'Cheque',
    reference: 'TXN/2024/0201/003',
    status: 'paid'
  },
  {
    _id: 'pay_004',
    farmerId: 'farmer_004',
    farmerName: 'Srinivas Reddy',
    amount: 11800,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'Bank Transfer',
    reference: 'TXN/2024/0201/004',
    status: 'paid'
  },
  {
    _id: 'pay_005',
    farmerId: 'farmer_005',
    farmerName: 'Anjaneyulu',
    amount: 5500,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'Cash',
    reference: 'TXN/2024/0201/005',
    status: 'pending'
  },
  {
    _id: 'pay_006',
    farmerId: 'farmer_006',
    farmerName: 'Rama Krishna',
    amount: 10200,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'UPI',
    reference: 'TXN/2024/0201/006',
    status: 'paid'
  },
  {
    _id: 'pay_007',
    farmerId: 'farmer_007',
    farmerName: 'Surya Prakash',
    amount: 7800,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'Bank Transfer',
    reference: 'TXN/2024/0201/007',
    status: 'paid'
  },
  {
    _id: 'pay_008',
    farmerId: 'farmer_008',
    farmerName: 'Narayana Murthy',
    amount: 13500,
    date: '2024-02-01',
    month: 'January 2024',
    mode: 'Cheque',
    reference: 'TXN/2024/0201/008',
    status: 'pending'
  }
];

// Summary Statistics
export const summaryStats = {
  totalDailyMilk: 245,
  totalMonthlyMilk: 5840,
  totalCustomers: 156,
  activeCustomers: 142,
  pendingCustomers: 8,
  inactiveCustomers: 6,
  todaysIncome: 18500,
  monthlyIncome: 456000,
  pendingPayments: 42300,
  totalBuffaloes: 32,
  healthyBuffaloes: 28,
  sickBuffaloes: 2,
  pregnantBuffaloes: 2,
  totalMonthlyExpenses: 35600,
  netProfit: 420400
};

// Daily Milk Collection Data (last 7 days)
export const dailyMilkCollection = [
  { date: '2024-01-27', morning: 180, evening: 120, total: 300 },
  { date: '2024-01-28', morning: 185, evening: 115, total: 300 },
  { date: '2024-01-29', morning: 175, evening: 125, total: 300 },
  { date: '2024-01-30', morning: 190, evening: 110, total: 300 },
  { date: '2024-01-31', morning: 178, evening: 122, total: 300 },
  { date: '2024-02-01', morning: 182, evening: 118, total: 300 },
  { date: '2024-02-02', morning: 150, evening: 95, total: 245 }
];

// Monthly Milk Production (last 6 months)
export const monthlyMilkProduction = [
  { month: 'September 2023', production: 5200, avgFat: 8.2 },
  { month: 'October 2023', production: 5450, avgFat: 8.1 },
  { month: 'November 2023', production: 5680, avgFat: 8.3 },
  { month: 'December 2023', production: 5750, avgFat: 8.4 },
  { month: 'January 2024', production: 5840, avgFat: 8.2 },
  { month: 'February 2024', production: 2450, avgFat: 8.1 }
];

// Expense Summary by Category (current month)
export const expenseSummary = {
  Feed: 12700,
  Medicine: 2000,
  Labor: 9000,
  Equipment: 3500,
  Utilities: 4500,
  Maintenance: 6000,
  Transportation: 1500,
  Other: 0
};

export default {
  farmers: farmersData,
  buffaloes: buffaloesData,
  milkEntries: milkEntriesData,
  customers: customersData,
  expenses: expensesData,
  payments: paymentsData,
  summary: summaryStats,
  dailyCollection: dailyMilkCollection,
  monthlyProduction: monthlyMilkProduction,
  expenseSummary: expenseSummary
};
