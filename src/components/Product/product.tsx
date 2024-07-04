import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { isNewProduct } from "../../lib/utils";

export default function Products({ products }: { products: any }) {
  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="bg-background rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl"
          >
            <Link to={`/items/${product._id}`} className="block">
              <img
                src={product.images[0]}
                alt={product.title}
                width={300}
                height={225}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    ₹{product.price}
                  </span>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </Badge>
                </div>
                {isNewProduct(product.createdAt) && (
                  <Badge
                    variant="default"
                    className="mt-2 text-xs text-white font-semibold"
                  >
                    New
                  </Badge>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
