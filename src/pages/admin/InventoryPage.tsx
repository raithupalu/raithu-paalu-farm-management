import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Plus, AlertTriangle, Truck, Box, Search } from "lucide-react";
import { getInventory, getInventoryStats, addInventoryItem, deleteInventoryItem } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { AddInventoryDialog } from "@/components/admin/AddInventoryDialog";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  minQuantity?: number;
  price?: number;
  supplier?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  location?: string;
  createdAt: string;
}

interface InventoryStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

const InventoryPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryData, inventoryStats] = await Promise.all([
          getInventory(),
          getInventoryStats()
        ]);
        setInventory(inventoryData);
        setStats(inventoryStats);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green/10';
      case 'low-stock': return 'text-yellow-600 bg-yellow/10';
      case 'out-of-stock': return 'text-red-600 bg-red/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteInventoryItem(id);
      // Refetch data to ensure consistency
      const fetchData = async () => {
        try {
          const [inventoryData, inventoryStats] = await Promise.all([
            getInventory(),
            getInventoryStats()
          ]);
          setInventory(inventoryData);
          setStats(inventoryStats);
        } catch (error) {
          console.error('Failed to fetch inventory:', error);
        }
      };
      await fetchData();
      toast({ title: "Success", description: "Item deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete item" });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ఇన్వెంటరీ' : language === 'hi' ? 'इन्वेंटरी' : 'Inventory'}
        </h1>
        <AddInventoryDialog onInventoryAdded={() => {
          const fetchData = async () => {
            try {
              const [inventoryData, inventoryStats] = await Promise.all([
                getInventory(),
                getInventoryStats()
              ]);
              setInventory(inventoryData);
              setStats(inventoryStats);
            } catch (error) {
              console.error('Failed to fetch inventory:', error);
            }
          };
          fetchData();
        }} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'మొత్తం అంశాలు' : language === 'hi' ? 'कुल आइटम' : 'Total Items'}
              </p>
              <p className="text-xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'ఉంది' : language === 'hi' ? 'उपलब्ध' : 'In Stock'}
              </p>
              <p className="text-xl font-bold text-green-600">
                {inventory.filter(i => i.status === 'in-stock').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'తక్కువ స్టాక్' : language === 'hi' ? 'कम स्टॉक' : 'Low Stock'}
              </p>
              <p className="text-xl font-bold text-yellow-600">
                {inventory.filter(i => i.status === 'low-stock').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'మొత్తం విలువ' : language === 'hi' ? 'कुल मूल्य' : 'Total Value'}
              </p>
              <p className="text-xl font-bold text-blue-600">
                ₹{stats?.totalValue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={language === 'te' ? 'పేరు లేదా వర్గం ద్వారా శోధించండి' : 
                       language === 'hi' ? 'नाम या श्रेणी से खोजें' : 
                       'Search by name or category...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber/10 rounded-full">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'వర్గం' : 'Category'}: {item.category}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'పరిమాణం' : 'Quantity'}: {item.quantity} {item.unit}
                  </p>
                  {item.supplier && (
                    <p className="text-muted-foreground">
                      {language === 'te' ? 'సరఫరాదారు' : 'Supplier'}: {item.supplier}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center gap-2">
                  <Button variant="outline" size="sm">
                    {language === 'te' ? 'సవరించు' : 'Edit'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                    {language === 'te' ? 'తొలగించు' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {language === 'te' ? 'ఇన్వెంటరీ అంశాలు లేవు' : 
             language === 'hi' ? 'कोई इन्वेंटरी आइटम नहीं' : 
             'No inventory items found'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default InventoryPage;
