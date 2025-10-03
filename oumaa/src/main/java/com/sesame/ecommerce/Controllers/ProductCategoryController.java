package com.sesame.ecommerce.Controllers;

import com.sesame.ecommerce.Models.ProductCategory;
import com.sesame.ecommerce.Service.implSecurity.ProductCategoryServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/productCategory")
@AllArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryServiceImpl productCategoryService;

    @GetMapping
    public List<ProductCategory> getProductCategoryList() {
        return productCategoryService.getProductCategoryList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProductCategory createProductCategory(@RequestBody ProductCategory productCategory) {
        return productCategoryService.createCategory(productCategory);
    }

    @PutMapping("/{id}")
    public ProductCategory updateProductCategory(
            @PathVariable Long id,
            @RequestBody ProductCategory productCategory) {
        return productCategoryService.updateCategory(id, productCategory);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteProductCategory(@PathVariable Long id) {
        productCategoryService.deleteCategory(id);
        return "Category with ID " + id + " has been deleted.";
    }
}
