import { ProductsToolbar } from '@/features/products/ui/ProductsToolbar';
import { ProductsTable } from '@/features/products/ui/ProductsTable';

export function ProductsPage() {
    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-[1200px] space-y-4">
                <ProductsToolbar />
                <ProductsTable />
            </div>
        </div>
    );
}
