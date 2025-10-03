package com.sesame.ecommerce.Security;

import com.sesame.ecommerce.Models.Product;
import com.sesame.ecommerce.Models.ProductCategory;
import com.sesame.ecommerce.Models.ProductStatus;

import java.util.List;

public interface ProductCategoryService {
    List<Product> getProductCategoryList();
    
    ProductStatus saveProducStatus(ProductStatus productStatus);
}
