package com.sesame.ecommerce.Service.implSecurity;

import com.sesame.ecommerce.Models.Product;
import com.sesame.ecommerce.Models.ProductCategory;
import com.sesame.ecommerce.Repositories.ProductRepository;
import com.sesame.ecommerce.Security.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductsService {
    @Autowired
    private  ProductRepository productRepository;

    @Override
    public Page<Product> getProductByStatusId(Long id, int page, int size) {
        return productRepository.findByProductStatusId(id, PageRequest.of(page, size));
    }


    @Override
    public List<Product> getProductByStatusIdLimit(Long id ) {
        return productRepository.findByProductStatusIdLimit(id);
    }



    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Page<Product> searchProductByName(String name, int page, int size) {
        return productRepository.findByNameContaining(name, PageRequest.of(page, size));
    }

    @Override
    public List<Product> getRandomProductByCategoryIdLimit(Long id) {
        return productRepository.findByCategoryIdLimit(id);
    }

    @Override
    public Product createProduct(Product product) {
        // Validate the product
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }

        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }

        if (product.getUnitPrice() == null || product.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Product price must be greater than zero");
        }

        if (product.getUnitsInStock() == null || product.getUnitsInStock() < 0) {
            throw new IllegalArgumentException("Units in stock must be greater than or equal to zero");
        }

        product.setDateCreated(Instant.now());
        product.setLastUpdated(Instant.now());

        return productRepository.save(product);
    }

    // Additional methods for CRUD operations (not in the interface but needed by controllers)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product updateProduct(Product product) {
        if (product == null || product.getId() == null) {
            throw new IllegalArgumentException("Product and Product ID cannot be null");
        }

        Optional<Product> existingProduct = productRepository.findById(product.getId());
        if (existingProduct.isEmpty()) {
            throw new IllegalArgumentException("Product with ID " + product.getId() + " not found");
        }

        product.setLastUpdated(Instant.now());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }

        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isEmpty()) {
            throw new IllegalArgumentException("Product with ID " + id + " not found");
        }

        productRepository.deleteById(id);
    }
}
