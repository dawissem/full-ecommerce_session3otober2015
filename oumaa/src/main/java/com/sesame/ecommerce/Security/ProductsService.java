package com.sesame.ecommerce.Security;

import com.sesame.ecommerce.Models.Product;
import com.sesame.ecommerce.Models.ProductCategory;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ProductsService {
    
    Page<Product> getProductByStatusId(Long id, int page, int size);


    List<Product> getProductByStatusIdLimit(Long id);

    Optional<Product> getProductById(Long id);

    Page<Product> searchProductByName(String name, int page, int size);

    List<Product> getRandomProductByCategoryIdLimit(Long id);

    Product createProduct(Product product);

    List<Product> getAllProducts();

    Product updateProduct(Product product);

 }
