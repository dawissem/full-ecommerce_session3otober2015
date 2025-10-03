package com.sesame.ecommerce.Service.implSecurity;

import com.sesame.ecommerce.Models.ProductCategory;
import com.sesame.ecommerce.Repositories.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl   {

    private final ProductCategoryRepository productCategoryRepository;

     public List<ProductCategory> getProductCategoryList() {
        return productCategoryRepository.findAll();
    }



     public ProductCategory createCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }
     public ProductCategory updateCategory(Long id, ProductCategory productCategory) {
        Optional<ProductCategory> existingCategory = productCategoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            ProductCategory categoryToUpdate = existingCategory.get();
            categoryToUpdate.setCategoryName(productCategory.getCategoryName()); // Use category name from input
            // Update other fields as required
            return productCategoryRepository.save(categoryToUpdate);
        } else {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
    }
     public void deleteCategory(Long id) {
        Optional<ProductCategory> existingCategory = productCategoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            productCategoryRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
    }
}