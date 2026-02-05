import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveSubscription, getUserSubscription } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const quantities = [0.5, 0.75, 1, 2];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState<number | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getUserSubscription(user._id).then(setSubscription);
    }
  }, []);

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const save = async () => {
    await saveSubscription({
      userId: user._id,
      userName: user.name,
      quantity,
      days,
    });

    const sub = await getUserSubscription(user._id);
    setSubscription(sub);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>

      {/* Existing Subscription */}
      {subscription && (
        <div className="p-4 border rounded bg-muted">
          <p>Quantity: {subscription.quantity} L</p>
          <p>Days: {subscription.days.join(", ")}</p>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="font-medium mb-2">Select Quantity</p>
        <div className="flex gap-2">
          {quantities.map(q => (
            <Button
              key={q}
              variant={quantity === q ? "default" : "outline"}
              onClick={() => setQuantity(q)}
            >
              {q} L
            </Button>
          ))}
        </div>
      </div>

      {/* Days */}
      <div>
        <p className="font-medium mb-2">Delivery Days</p>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <Button
              key={day}
              variant={days.includes(day) ? "default" : "outline"}
              onClick={() => toggleDay(day)}
            >
              {day}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={!quantity || days.length === 0}>
        Save Subscription
      </Button>
    </div>
  );
};

export default SubscriptionPage;
