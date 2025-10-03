package com.sesame.ecommerce.Controllers;

import com.sesame.ecommerce.Models.ProductStatus;
import com.sesame.ecommerce.Service.implSecurity.ProductStatusServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/productStatus")
@AllArgsConstructor
public class ProductStatusController {

    private final ProductStatusServiceImpl productStatusService;

    /**
     * Get all product statuses
     * @return List of all product statuses
     */
    @GetMapping
    public ResponseEntity<List<ProductStatus>> getProductStatusList() {
        List<ProductStatus> statusList = productStatusService.getProductStatusList();
        return ResponseEntity.ok(statusList);
    }

    /**
     * Create a new product status (Admin only)
     * @param productStatus Product status to create
     * @return Created product status
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductStatus> createProductStatus(@RequestBody ProductStatus productStatus) {
        try {
            ProductStatus savedStatus = productStatusService.saveProductStatus(productStatus);
            return new ResponseEntity<>(savedStatus, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update an existing product status (Admin only)
     * @param id Product status ID
     * @param productStatus Updated product status
     * @return Updated product status
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductStatus> updateProductStatus(
            @PathVariable Long id,
            @RequestBody ProductStatus productStatus) {
        try {
            productStatus.setId(id);
            ProductStatus updatedStatus = productStatusService.saveProductStatus(productStatus);
            return ResponseEntity.ok(updatedStatus);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
