import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Milk, Plus, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { getBuffaloes, getBuffaloStats, addBuffalo, updateBuffalo, deleteBuffalo } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { AddBuffaloDialog } from "@/components/admin/AddBuffaloDialog";

interface Buffalo {
  _id: string;
  name: string;
  tagId?: string;
  breed?: string;
  age: number;
  weight: number;
  milkProduction: number;
  fatContent?: number;
  healthStatus: 'healthy' | 'sick' | 'pregnant' | 'dry' | string;
  lastVaccinationDate?: string;
  lastMilkDate?: string;
  assignedTo?: { _id: string; name: string; phone: string };
  createdAt: string;
}

interface BuffaloStats {
  total: number;
  healthy: number;
  sick: number;
  pregnant: number;
  totalProduction: number;
}

const BuffaloesPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [buffaloes, setBuffaloes] = useState<Buffalo[]>([]);
  const [stats, setStats] = useState<BuffaloStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buffaloData, buffaloStats] = await Promise.all([
          getBuffaloes(),
          getBuffaloStats()
        ]);
        setBuffaloes(buffaloData);
        setStats(buffaloStats);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch buffalo data",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this buffalo?")) return;
    
    try {
      await deleteBuffalo(id);
      // Refetch data to ensure consistency
      const fetchData = async () => {
        try {
          const [buffaloData, buffaloStats] = await Promise.all([
            getBuffaloes(),
            getBuffaloStats()
          ]);
          setBuffaloes(buffaloData);
          setStats(buffaloStats);
        } catch (error) {
          console.error('Failed to fetch buffalo data:', error);
        }
      };
      await fetchData();
      toast({ title: "Success", description: "Buffalo deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete buffalo" });
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green/10';
      case 'sick': return 'text-red-600 bg-red/10';
      case 'pregnant': return 'text-blue-600 bg-blue/10';
      case 'dry': return 'text-gray-600 bg-gray/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {language === 'te' ? 'ఎద్దులు' : language === 'hi' ? 'भैंसें' : 'Buffaloes'}
        </h1>
        <AddBuffaloDialog onBuffaloAdded={() => {
          const fetchData = async () => {
            try {
              const [buffaloData, buffaloStats] = await Promise.all([
                getBuffaloes(),
                getBuffaloStats()
              ]);
              setBuffaloes(buffaloData);
              setStats(buffaloStats);
            } catch (error) {
              console.error('Failed to fetch buffalo data', error);
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
              <Milk className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Production</p>
              <p className="text-xl font-bold">{stats?.totalProduction || 0}L/day</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Healthy</p>
              <p className="text-xl font-bold">{stats?.healthy || 0}/{stats?.total || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Age</p>
              <p className="text-xl font-bold">
                {buffaloes.length > 0 
                  ? (buffaloes.reduce((sum, b) => sum + (b.age || 0), 0) / buffaloes.length).toFixed(1) 
                  : 0} years
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Need Attention</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats?.sick || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Buffaloes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buffaloes.map((buffalo) => (
          <Card key={buffalo._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber/10 rounded-full">
                <Milk className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{buffalo.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(buffalo.healthStatus)}`}>
                    {buffalo.healthStatus}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'జాతి' : 'Breed'}: {buffalo.breed || 'Murrah'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'వయస్సు' : 'Age'}: {buffalo.age} {language === 'te' ? 'సంవత్సరాలు' : 'years'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te' ? 'బరువు' : 'Weight'}: {buffalo.weight} kg
                  </p>
                  {buffalo.assignedTo && (
                    <p className="text-muted-foreground">
                      {language === 'te' ? 'కస్టమర్' : 'Customer'}: {buffalo.assignedTo.name}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'te' ? 'దినసరి ఉత్పత్తి' : 'Daily Production'}
                    </span>
                    <span className="font-bold text-primary">{buffalo.milkProduction}L</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {language === 'te' ? 'సవరించు' : language === 'hi' ? 'संपादित करें' : 'Edit'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(buffalo._id)}>
                    {language === 'te' ? 'తొలగించు' : language === 'hi' ? 'हटाएं' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuffaloesPage;
