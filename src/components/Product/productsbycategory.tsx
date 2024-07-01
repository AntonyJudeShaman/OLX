import { useParams } from "react-router-dom";
import SimilarProducts from "./similarproducts";

const ProductByCategory: React.FC = () => {
  let { category } = useParams<{ category: string }>();

  return (
    <SimilarProducts category={category as string} className="container" />
  );
};

export default ProductByCategory;
