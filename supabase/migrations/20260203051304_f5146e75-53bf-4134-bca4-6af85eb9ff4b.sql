-- Create buffaloes table
CREATE TABLE public.buffaloes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT,
  tag_number TEXT UNIQUE,
  date_of_birth DATE,
  purchase_date DATE,
  purchase_price NUMERIC(10,2),
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dry', 'pregnant', 'sold', 'deceased')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buffalo_milk_records for daily milk production per buffalo
CREATE TABLE public.buffalo_milk_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buffalo_id UUID REFERENCES public.buffaloes(id) ON DELETE CASCADE NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  morning_liters NUMERIC(5,2) DEFAULT 0,
  evening_liters NUMERIC(5,2) DEFAULT 0,
  total_liters NUMERIC(5,2) GENERATED ALWAYS AS (morning_liters + evening_liters) STORED,
  notes TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (buffalo_id, record_date)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  quantity_liters NUMERIC(5,2) NOT NULL,
  price_per_liter NUMERIC(6,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense_categories table
CREATE TABLE public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default expense categories
INSERT INTO public.expense_categories (name, description) VALUES
  ('Feed', 'Buffalo feed and fodder'),
  ('Veterinary', 'Medical and health expenses'),
  ('Labor', 'Staff wages and labor costs'),
  ('Equipment', 'Machinery and equipment'),
  ('Transport', 'Transportation and delivery'),
  ('Utilities', 'Electricity, water, etc.'),
  ('Maintenance', 'Farm maintenance'),
  ('Other', 'Miscellaneous expenses');

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.expense_categories(id),
  amount NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  unit TEXT NOT NULL DEFAULT 'kg',
  current_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
  minimum_stock NUMERIC(10,2) NOT NULL DEFAULT 10,
  price_per_unit NUMERIC(10,2),
  supplier TEXT,
  last_restocked DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default inventory items
INSERT INTO public.inventory_items (name, category, unit, current_stock, minimum_stock) VALUES
  ('Cattle Feed', 'feed', 'kg', 500, 100),
  ('Hay', 'feed', 'bales', 50, 20),
  ('Milk Cans', 'equipment', 'pcs', 25, 10),
  ('Cleaning Supplies', 'supplies', 'liters', 20, 5);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.buffaloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buffalo_milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Buffaloes policies (admin only)
CREATE POLICY "Admins can manage buffaloes"
  ON public.buffaloes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Buffalo milk records policies
CREATE POLICY "Admins can manage buffalo milk records"
  ON public.buffalo_milk_records FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies
CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.customers c 
      WHERE c.id = customer_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.customers c 
      WHERE c.id = customer_id AND c.user_id = auth.uid()
    )
  );

-- Expense categories policies (read for all authenticated, write for admin)
CREATE POLICY "Authenticated users can view expense categories"
  ON public.expense_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage expense categories"
  ON public.expense_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Expenses policies (admin only)
CREATE POLICY "Admins can manage expenses"
  ON public.expenses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Inventory policies (admin only)
CREATE POLICY "Admins can manage inventory"
  ON public.inventory_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs policies (admin only, read only)
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_buffaloes_updated_at
  BEFORE UPDATE ON public.buffaloes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create audit log function
CREATE OR REPLACE FUNCTION public.log_audit_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add audit triggers to important tables
CREATE TRIGGER audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();

CREATE TRIGGER audit_milk_entries
  AFTER INSERT OR UPDATE OR DELETE ON public.milk_entries
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();

CREATE TRIGGER audit_orders
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();

CREATE TRIGGER audit_expenses
  AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();