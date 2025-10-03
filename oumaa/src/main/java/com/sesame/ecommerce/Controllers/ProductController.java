package com.sesame.ecommerce.Controllers;

import com.sesame.ecommerce.Models.DTO.request.ProductDTO;
import com.sesame.ecommerce.Models.Product;
import com.sesame.ecommerce.Models.ProductCategory;
import com.sesame.ecommerce.Models.ProductStatus;
import com.sesame.ecommerce.Repositories.ProductCategoryRepository;
import com.sesame.ecommerce.Repositories.ProductStatusRepository;
import com.sesame.ecommerce.Security.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {


    @Autowired
    private final ProductsService productsService;
    @Autowired

    private final ProductCategoryRepository productCategoryRepository;
    @Autowired

    private final ProductStatusRepository productStatusRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            Product product = new Product();

            // Set basic fields
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setUnitPrice(productDTO.getUnitPrice());
            product.setUnitsInStock(productDTO.getUnitsInStock());
            product.setActive(productDTO.isActive());

            // Handle image
            if (productDTO.getImageBase64() != null && productDTO.getImageContentType() != null) {
                product.setImage(productDTO.getImageBase64());
                product.setImageContentType(productDTO.getImageContentType());
            }

            // Set category
            ProductCategory category = productCategoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
            product.setCategory(category);

            // Set status
            ProductStatus productStatus = productStatusRepository.findById(productDTO.getProductStatusId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid status ID"));
            product.setProductStatus(productStatus);

            // Save product
            Product createdProduct = productsService.createProduct(product);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
